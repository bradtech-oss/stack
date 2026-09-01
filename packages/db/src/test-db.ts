import { DeviceRow, DeviceTypeRow, VendorRow } from './index'

/**
 * Script inspecting PostgreSQL database deployed in Podman
 */
async function main() {
  const connectionUrl = process.env.DATABASE_URL || 'postgres://brad:bradpass@127.0.0.1:54322/bradtech_db'
  console.log(`🔍 Querying Podman PostgreSQL Database (${connectionUrl})...`)

  // Use Bun's native SQL client
  const { SQL } = require('bun')
  const sql = new SQL(connectionUrl)

  const vendors: VendorRow[] = await sql`SELECT * FROM vendors`
  console.log(`\n🏢 Found ${vendors.length} Vendors:`)
  vendors.forEach(v => console.log(`  - [${v.id}] ${v.name} (${v.url || 'No URL'})`))

  const deviceTypes: DeviceTypeRow[] = await sql`SELECT * FROM device_types`
  console.log(`\n📐 Found ${deviceTypes.length} Catalog Device Types (Type-Level Specs: dimensions Map, vendor Map, electrical Map):`)
  deviceTypes.forEach(dt => {
    console.log(`  - [${dt.id}] ${dt.name} (SKU: ${dt.sku})`)
    console.log(`    📐 Dimensions Map: ${JSON.stringify(dt.dimensions)}`)
    console.log(`    🏢 Vendor Map: ${JSON.stringify(dt.vendor)}`)
    console.log(`    ⚡ Electrical Map: ${JSON.stringify(dt.electrical)}`)
  })

  const devices: DeviceRow[] = await sql`SELECT * FROM devices`
  console.log(`\n📱 Found ${devices.length} Physical Inventory Device Units (Unit-Level Specs: network Map & S/N):`)
  devices.forEach(d => {
    console.log(`  - [${d.id}] ${d.name} (S/N: ${d.serial_number}, Model ID: ${d.device_type_id})`)
    console.log(`    🌐 Network Spec Map (eth/wifi/lorawan/gsm/powerSource): ${JSON.stringify(d.network)}`)
  })

  // Test PostgreSQL JOIN query
  const joinedQuery = await sql`
    SELECT d.serial_number, d.name as unit_name, d.network, dt.name as model_name, dt.sku, dt.dimensions->>'enclosureRating' as ip
    FROM devices d
    JOIN device_types dt ON d.device_type_id = dt.id
  `
  console.log(`\n🛡️ Joined Inventory Units with Catalog Models:`, joinedQuery)

  await sql.end()
}

main().catch(err => {
  console.error('Error querying DB:', err)
  process.exit(1)
})
