import { DeviceRow, DeviceTypeRow, VendorRow } from './index'

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

  const deviceTypes: DeviceTypeRow[] = await sql`SELECT * FROM device_types`
  console.log(`\n📐 Found ${deviceTypes.length} Catalog Device Types (carrying SKU, dimensions Map, vendor_info Map):`)
  deviceTypes.forEach(dt => {
    console.log(`  - [${dt.id}] ${dt.name} (SKU: ${dt.sku})`)
    console.log(`    📐 Dimensions Map: ${JSON.stringify(dt.dimensions)}`)
    console.log(`    🔗 Vendor Info Map: ${JSON.stringify(dt.vendor_info)}`)
  })

  const devices: DeviceRow[] = await sql`SELECT * FROM devices`
  console.log(`\n📱 Found ${devices.length} Physical Inventory Device Units (carrying Serial Numbers):`)
  devices.forEach(d => {
    console.log(`  - [${d.id}] ${d.name} (S/N: ${d.serial_number}, Model ID: ${d.device_type_id})`)
  })

  // Test PostgreSQL JOIN query
  const joinedQuery = await sql`
    SELECT d.serial_number, d.name as unit_name, dt.name as model_name, dt.sku, dt.dimensions->>'enclosureRating' as ip
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
