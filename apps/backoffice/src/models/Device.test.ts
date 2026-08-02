import { Device } from './Device'
import { MdmNature, Mdm } from '@quatrain/mdm'
import { MockMdmAdapter } from '@quatrain/mdm'

describe('@bradtech-oss/backoffice Device Model & Specification Groups Test Suite', () => {
   beforeEach(() => {
      const adapter = new MockMdmAdapter('default')
      Mdm.addAdapter(adapter, 'default', true)
   })

   it('should instantiate Soil Probe device with inline dimensions Map and vendor_info ObjectUri & lifecycle', () => {
      const probe = Device.fromObject({
         uid: 'dev_probe_001',
         name: 'Soil Moisture Probe V2',
         sku: 'BRAD-PROBE-V2-HYBRID',
         archetypeId: 'hardware.probe',
         nature: MdmNature.PHYSICAL,
         lifecycleState: 'ASSOCIATED',
         dimensions: {
            heightMm: 450,
            widthMm: 65,
            depthMm: 65,
            weightGrams: 480,
            enclosureRating: 'IP68'
         },
         vendor_info: {
            vendorUri: 'vendors/vendor_brad_tech',
            vendorSku: 'BRAD-PHY-PCB-HYBRID-01',
            status: 'ACTIVE',
            releaseDate: '2025-06-01',
            eolDate: '2030-12-31'
         }
      })

      expect(probe.dataObject.val('name')).toBe('Soil Moisture Probe V2')
      expect(probe.dimensionsMap.heightMm).toBe(450)
      expect(probe.dimensionsMap.enclosureRating).toBe('IP68')
      expect(probe.vendorInfoMap.vendorUri).toBe('vendors/vendor_brad_tech')
      expect(probe.vendorInfoMap.status).toBe('ACTIVE')
      expect(probe.getSubcollectionName('keychains')).toBe('devices/dev_probe_001/keychains')
   })
})
