import { Device } from './Device'
import { Mdm } from '@quatrain/mdm'
import { MockMdmAdapter } from '@quatrain/mdm'
import deviceArchetypeConfig from './mdm_device.json'

describe('@bradtech-oss/backoffice Device Model & Declarative JSON Schema Test Suite', () => {
   beforeEach(() => {
      const adapter = new MockMdmAdapter('default')
      Mdm.addAdapter(adapter, 'default', true)
   })

   it('should load archetype spec from mdm_device.json at the exact same directory level', () => {
      const device = new Device({} as any)
      const spec = device.getArchetypeSpec()

      expect(spec.archetypeId).toBe('hardware.device')
      expect(spec.nature).toBe('physical')
      expect(spec.collection).toBe('devices')
      expect(deviceArchetypeConfig.requiredProperties).toContain('dimensions')
   })

   it('should instantiate physical device inventory unit with serialNumber and deviceTypeId', () => {
      const probeUnit = Device.fromObject({
         id: 'd311aa66-6f0e-1ef5-883a-3aa6ba050a44',
         deviceTypeId: '7711aa66-6f0e-1ef5-883a-3aa6ba050a11',
         serialNumber: 'SN-BRAD-PROBE-2026-0042',
         name: 'Soil Probe #042 - Field Parcel 3',
         archetypeId: 'hardware.probe',
         lifecycleState: 'ASSOCIATED',
         dimensions: {
            unitSystem: 'metric',
            height: 450,
            width: 65,
            depth: 65,
            weight: 480,
            enclosureRating: 'IP68'
         },
         vendor_info: {
            vendorUri: 'vendors/a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
            vendorSku: 'BRAD-PHY-PCB-HYBRID-01',
            status: 'ACTIVE',
            releaseDate: '2025-06-01',
            eolDate: '2030-12-31'
         }
      })

      expect(probeUnit.dataObject.val('name')).toBe('Soil Probe #042 - Field Parcel 3')
      expect(probeUnit.serialNumber).toBe('SN-BRAD-PROBE-2026-0042')
      expect(probeUnit.deviceTypeId).toBe('7711aa66-6f0e-1ef5-883a-3aa6ba050a11')
      expect(probeUnit.dimensionsMap.height).toBe(450)
      expect(probeUnit.vendorInfoMap.vendorSku).toBe('BRAD-PHY-PCB-HYBRID-01')
   })
})
