import { DeviceRow, VendorRow } from './index'

/**
 * Script inspecting PostgreSQL database deployed in Podman
 */
async function main() {
  console.log('🔍 Querying Podman PostgreSQL Database (localhost:5432)...')

  // Use Bun's native SQL client
  const { SQL } = require('bun')
  const sql = new SQL('postgres://brad:bradpass@127.0.0.1:5432/bradtech_db')

  const vendors: VendorRow[] = await sql`SELECT * FROM vendors`
  console.log(`\n🏢 Found ${vendors.length} Vendors:`)
  vendors.forEach(v => console.log(`  - [${v.id}] ${v.name} (${v.url || 'No URL'})`))

  const devices: DeviceRow[] = await sql`SELECT * FROM devices`
  console.log(`\n📱 Found ${devices.length} Devices (Inline JSONB Store):`)
  devices.forEach(d => {
    console.log(`  - [${d.id}] ${d.name} (${d.archetype_id})`)
    console.log(`    📐 Dimensions Map: ${JSON.stringify(d.dimensions)}`)
    console.log(`    🔗 Vendor Info Map: ${JSON.stringify(d.vendor_info)}`)
  })

  // Test PostgreSQL GIN JSONB querying
  const ip68Devices = await sql`SELECT name, dimensions->>'enclosureRating' as ip FROM devices WHERE dimensions->>'enclosureRating' = 'IP68'`
  console.log(`\n🛡️ High-Protection IP68 Devices (GIN Query):`, ip68Devices)

  await sql.end()
}

main().catch(err => {
  console.error('Error querying DB:', err)
  process.exit(1)
})
