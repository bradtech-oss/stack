import { readFileSync } from 'fs'
import { join } from 'path'
import deviceSchema from './models/device.json'
import { MdmSpecGroups } from '@quatrain/mdm'

declare const Bun: any

// Bun SQL client for PostgreSQL connection
const { SQL } = require('bun')
const DB_URL = process.env.DATABASE_URL || 'postgres://brad:bradpass@127.0.0.1:54322/bradtech_db'
let sql: any = null

try {
  sql = new SQL(DB_URL)
  console.log(`🐘 Connected to PostgreSQL at ${DB_URL}`)
} catch (err) {
  console.warn(`⚠️ Warning: Could not connect directly to PostgreSQL. Running with mock fallback server.`, err)
}

const htmlPath = join(__dirname, 'ui', 'index.html')

export function startServer(port = 3000) {
  return Bun.serve({
    port,
    async fetch(req: any) {
      const url = new URL(req.url)
      const method = req.method
      const path = url.pathname

      // Serve UI Dashboard
      if (path === '/' || path === '/index.html') {
        const html = readFileSync(htmlPath, 'utf-8')
        return new Response(html, { headers: { 'Content-Type': 'text/html' } })
      }

      // API: List JSON Schemas & Group Specifications
      if (path === '/api/schemas') {
        return Response.json({
          archetype: deviceSchema,
          groups: {
            dimensions: MdmSpecGroups.getGroup('@quatrain/mdm/groups/dimensions'),
            vendor: MdmSpecGroups.getGroup('@quatrain/mdm/groups/vendor'),
            electrical: MdmSpecGroups.getGroup('@quatrain/mdm/groups/electrical'),
            network: MdmSpecGroups.getGroup('@quatrain/mdm/groups/network')
          }
        })
      }

      // API: Vendors CRUD
      if (path === '/api/vendors') {
        if (method === 'GET') {
          if (!sql) return Response.json([])
          const rows = await sql`SELECT * FROM vendors ORDER BY name ASC`
          return Response.json(rows)
        }
        if (method === 'POST') {
          const body = await req.json()
          if (!sql) return Response.json(body)
          const rows = await sql`
            INSERT INTO vendors (name, sku, url, details)
            VALUES (${body.name}, ${body.sku}, ${body.url}, ${JSON.stringify(body.details || {})})
            RETURNING *
          `
          return Response.json(rows[0], { status: 201 })
        }
      }

      const vendorMatch = path.match(/^\/api\/vendors\/([a-f0-9-]+)$/)
      if (vendorMatch) {
        const id = vendorMatch[1]
        if (method === 'PUT') {
          const body = await req.json()
          if (!sql) return Response.json(body)
          const rows = await sql`
            UPDATE vendors
            SET name = ${body.name}, sku = ${body.sku}, url = ${body.url}, details = ${JSON.stringify(body.details || {})}
            WHERE id = ${id}::uuid
            RETURNING *
          `
          return Response.json(rows[0] || {})
        }
        if (method === 'DELETE') {
          if (sql) await sql`DELETE FROM vendors WHERE id = ${id}::uuid`
          return Response.json({ success: true, id })
        }
      }

      // API: Device Types (Catalog Models) CRUD
      if (path === '/api/device-types') {
        if (method === 'GET') {
          if (!sql) return Response.json([])
          const rows = await sql`
            SELECT dt.*, v.name as vendor_name, v.url as vendor_url, v.details as vendor_details
            FROM device_types dt
            LEFT JOIN vendors v ON ('vendors/' || v.id::text) = (dt.vendor->>'vendorUri')
            ORDER BY dt.name ASC
          `
          return Response.json(rows)
        }
        if (method === 'POST') {
          const body = await req.json()
          if (!sql) return Response.json(body)
          const rows = await sql`
            INSERT INTO device_types (name, sku, archetype_id, dimensions, vendor, electrical)
            VALUES (${body.name}, ${body.sku}, ${body.archetype_id || 'hardware.device'}, ${JSON.stringify(body.dimensions || {})}, ${JSON.stringify(body.vendor || {})}, ${JSON.stringify(body.electrical || {})})
            RETURNING *
          `
          return Response.json(rows[0], { status: 201 })
        }
      }

      const devTypeMatch = path.match(/^\/api\/device-types\/([a-f0-9-]+)$/)
      if (devTypeMatch) {
        const id = devTypeMatch[1]
        if (method === 'PUT') {
          const body = await req.json()
          if (!sql) return Response.json(body)
          const rows = await sql`
            UPDATE device_types
            SET name = ${body.name}, sku = ${body.sku}, dimensions = ${JSON.stringify(body.dimensions || {})}, vendor = ${JSON.stringify(body.vendor || {})}, electrical = ${JSON.stringify(body.electrical || {})}
            WHERE id = ${id}::uuid
            RETURNING *
          `
          return Response.json(rows[0] || {})
        }
        if (method === 'DELETE') {
          if (sql) await sql`DELETE FROM device_types WHERE id = ${id}::uuid`
          return Response.json({ success: true, id })
        }
      }

      // API: Physical Devices CRUD (IMMUTABLE device_type_id ON UPDATE!)
      if (path === '/api/devices') {
        if (method === 'GET') {
          if (!sql) return Response.json([])
          const rows = await sql`
            SELECT d.*, dt.name as model_name, dt.sku as model_sku, dt.vendor as model_vendor
            FROM devices d
            JOIN device_types dt ON d.device_type_id = dt.id
            ORDER BY d.created_at DESC
          `
          return Response.json(rows)
        }
        if (method === 'POST') {
          const body = await req.json()
          if (!sql) return Response.json(body)
          const rows = await sql`
            INSERT INTO devices (device_type_id, serial_number, name, lifecycle_state, network)
            VALUES (${body.device_type_id}::uuid, ${body.serial_number}, ${body.name}, ${body.lifecycle_state || 'AVAILABLE'}, ${JSON.stringify(body.network || {})})
            RETURNING *
          `
          return Response.json(rows[0], { status: 201 })
        }
      }

      const deviceMatch = path.match(/^\/api\/devices\/([a-f0-9-]+)$/)
      if (deviceMatch) {
        const id = deviceMatch[1]
        if (method === 'PUT') {
          const body = await req.json()
          if (!sql) return Response.json(body)
          // IMMUTABLE CONSTRAINT: device_type_id is intentionally EXCLUDED from UPDATE query!
          const rows = await sql`
            UPDATE devices
            SET serial_number = ${body.serial_number}, name = ${body.name}, lifecycle_state = ${body.lifecycle_state}, network = ${JSON.stringify(body.network || {})}
            WHERE id = ${id}::uuid
            RETURNING *
          `
          return Response.json(rows[0] || {})
        }
        if (method === 'DELETE') {
          if (sql) await sql`DELETE FROM devices WHERE id = ${id}::uuid`
          return Response.json({ success: true, id })
        }
      }

      return new Response('Not Found', { status: 404 })
    }
  })
}

if (import.meta.main) {
  const port = parseInt(process.env.PORT || '3000', 10)
  const server = startServer(port)
  console.log(`\n🚀 Quatrain MDM CRUD App running at: http://localhost:${server.port}`)
  console.log(`📄 Visualizing Vendors, Catalog Models & Physical Devices in Real-Time\n`)
}
