import { Device } from './Device'
import { MdmNature, Mdm } from '@quatrain/mdm'
import { MockMdmAdapter } from '@quatrain/mdm'

describe('@bradtech-oss/backoffice Device Model & Specification Groups Test Suite', () => {
   beforeEach(() => {
      const adapter = new MockMdmAdapter('default')
      Mdm.addAdapter(adapter, 'default', true)
   })

   it('should instantiate Soil Probe device with inline dimensions Map (unitSystem: metric, height, width, depth, weight) and vendor_info ObjectUri', () => {
      const probe = Device.fromObject({
         id: 'd311aa66-6f0e-1ef5-883a-3aa6ba050a44',
         name: 'Soil Moisture Probe V2',
         sku: 'BRAD-PROBE-V2-HYBRID',
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

      expect(probe.dataObject.val('name')).toBe('Soil Moisture Probe V2')
      expect(probe.dimensionsMap.unitSystem).toBe('metric')
      expect(probe.dimensionsMap.height).toBe(450)
      expect(probe.dimensionsMap.weight).toBe(480)
      expect(probe.dimensionsMap.enclosureRating).toBe('IP68')
      expect(probe.vendorInfoMap.vendorUri).toBe('vendors/a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11')
      expect(probe.vendorInfoMap.status).toBe('ACTIVE')
      expect(probe.getSubcollectionName('keychains')).toBe('devices/d311aa66-6f0e-1ef5-883a-3aa6ba050a44/keychains')
   })
})
