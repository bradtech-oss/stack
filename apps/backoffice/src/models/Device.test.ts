import { Device, DeviceType } from './Device'
import { Mdm } from '@quatrain/mdm'
import { MockMdmAdapter } from '@quatrain/mdm'
import deviceArchetypeConfig from './mdm_device.json'

describe('@bradtech-oss/backoffice Device Model & Specification Scopes (Type vs Unit) Test Suite', () => {
   beforeEach(() => {
      const adapter = new MockMdmAdapter('default')
      Mdm.addAdapter(adapter, 'default', true)
   })

   it('should declare specification group scopes in mdm_device.json (scope: type vs scope: unit)', () => {
      const device = new Device({} as any)
      const spec = device.getArchetypeSpec()

      expect(spec.archetypeId).toBe('hardware.device')
      expect(deviceArchetypeConfig.specGroupRefs.find(r => r.key === 'dimensions')?.scope).toBe('type')
      expect(deviceArchetypeConfig.specGroupRefs.find(r => r.key === 'vendor')?.scope).toBe('type')
      expect(deviceArchetypeConfig.specGroupRefs.find(r => r.key === 'electrical')?.scope).toBe('type')
      expect(deviceArchetypeConfig.specGroupRefs.find(r => r.key === 'network')?.scope).toBe('unit')
   })

   it('should instantiate Catalog DeviceType with clean physical specs (dimensions, vendor, electrical)', () => {
      const probeType = DeviceType.fromObject({
         id: '7711aa66-6f0e-1ef5-883a-3aa6ba050a11',
         name: 'Soil Moisture Probe V2 Model',
         sku: 'BRAD-PROBE-V2-HYBRID',
         archetypeId: 'hardware.probe',
         dimensions: {
            unitSystem: 'metric',
            height: 450,
            width: 65,
            depth: 65,
            weight: 480,
            enclosureRating: 'IP68'
         },
         vendor: {
            vendorUri: 'vendors/a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
            vendorSku: 'BRAD-PHY-PCB-HYBRID-01',
            status: 'ACTIVE',
            releaseDate: '2025-06-01',
            eolDate: '2030-12-31'
         },
         electrical: {
            voltageNominal: 3.6,
            voltageMin: 3.0,
            voltageMax: 4.2,
            currentMax: 120,
            powerActive: 432,
            powerSleep: 18
         }
      })

      expect(probeType.sku).toBe('BRAD-PROBE-V2-HYBRID')
      expect(probeType.dimensionsMap.height).toBe(450)
      expect(probeType.vendorMap.status).toBe('ACTIVE')
      expect(probeType.electricalMap.voltageNominal).toBe(3.6)
      expect(probeType.electricalMap.currentMax).toBe(120)
   })

   it('should instantiate Physical Device Unit with unit-level specs (network carrying powerSource & LoRaWAN DevEUI / Wi-Fi MAC / GSM IMEI)', () => {
      const probeUnit = Device.fromObject({
         id: 'd311aa66-6f0e-1ef5-883a-3aa6ba050a44',
         deviceTypeId: '7711aa66-6f0e-1ef5-883a-3aa6ba050a11',
         serialNumber: 'SN-BRAD-PROBE-2026-0042',
         name: 'Soil Probe #042 - Field Parcel 3',
         archetypeId: 'hardware.probe',
         lifecycleState: 'ASSOCIATED',
         network: {
            powerSource: 'BATTERY',
            lorawan: {
               devEui: '0018B44113AB7042',
               appEui: '70B3D57ED0000001',
               frequencyBand: 'EU868',
               activationMode: 'OTAA'
            }
         }
      })

      expect(probeUnit.dataObject.val('name')).toBe('Soil Probe #042 - Field Parcel 3')
      expect(probeUnit.serialNumber).toBe('SN-BRAD-PROBE-2026-0042')
      expect(probeUnit.networkMap.powerSource).toBe('BATTERY')
      expect(probeUnit.networkMap.lorawan?.devEui).toBe('0018B44113AB7042')
      expect(probeUnit.networkMap.lorawan?.frequencyBand).toBe('EU868')
   })
})
