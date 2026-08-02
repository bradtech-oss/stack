import { AbstractMdmObject, MdmArchetypeSpec, MdmNature } from '@quatrain/mdm'
import { ObjectProperty, Core } from '@quatrain/core'
import { DeviceDimensionsMap, DeviceVendorInfoMap } from '@bradtech-oss/db'

/**
 * Concrete Device model for physical hardware (probes, gateways, weather stations)
 * Uses clean COLLECTION = 'devices' and manages inline specification groups for dimensions and vendor_info.
 */
export class Device extends AbstractMdmObject {
   static COLLECTION = 'devices'
   static PROPS_DEFINITION = [
      ...AbstractMdmObject.PROPS_DEFINITION,
      { name: 'dimensions', type: ObjectProperty.TYPE, required: false, default: { unitSystem: 'metric' } },
      { name: 'vendor_info', type: ObjectProperty.TYPE, required: false, default: {} },
   ] as typeof AbstractMdmObject.PROPS_DEFINITION

   getArchetypeSpec(): MdmArchetypeSpec {
      return {
         archetypeId: 'hardware.device',
         name: 'IoT Physical Device / Hardware System',
         nature: MdmNature.PHYSICAL,
         collection: Device.COLLECTION,
         requiredProperties: ['dimensions', 'vendor_info'],
         optionalProperties: ['powerCapabilities', 'commCapabilities']
      }
   }

   public get dimensionsMap(): DeviceDimensionsMap {
      return (this.dataObject.val('dimensions') as DeviceDimensionsMap) || { unitSystem: 'metric' }
   }

   public get vendorInfoMap(): DeviceVendorInfoMap {
      return (this.dataObject.val('vendor_info') as DeviceVendorInfoMap) || { status: 'ACTIVE' }
   }
}

// Register class to Quatrain Core class registry for object reference resolution
Core.addClass('Device', Device)
