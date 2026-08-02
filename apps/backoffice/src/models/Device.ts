import { AbstractMdmObject, MdmArchetypeSpec, MdmNature } from '@quatrain/mdm'
import { MapProperty, StringProperty, ObjectProperty, Core } from '@quatrain/core'
import { DeviceDimensionsMap, DeviceVendorInfoMap } from '@bradtech-oss/db'

import deviceArchetypeConfig from './mdm_device.json'

/**
 * Concrete Device model for physical hardware inventory units (probes, gateways, weather stations)
 * Loads its archetype specification dynamically from mdm_device.json (at the same level as Device.ts).
 * Carries serial_number and references device_type_id (catalog model carrying SKU and dimensions Map).
 */
export class Device extends AbstractMdmObject {
   static COLLECTION = 'devices'
   static PROPS_DEFINITION = [
      ...AbstractMdmObject.PROPS_DEFINITION,
      { name: 'serialNumber', type: StringProperty.TYPE, required: true },
      { name: 'deviceTypeId', type: StringProperty.TYPE, required: true },
      { name: 'dimensions', type: MapProperty.TYPE, required: false, default: { unitSystem: 'metric' } },
      { name: 'vendor_info', type: MapProperty.TYPE, required: false, default: {} },
   ] as typeof AbstractMdmObject.PROPS_DEFINITION

   getArchetypeSpec(): MdmArchetypeSpec {
      return deviceArchetypeConfig as MdmArchetypeSpec
   }

   public get serialNumber(): string {
      return (this.dataObject.val('serialNumber') as string) || ''
   }

   public get deviceTypeId(): string {
      return (this.dataObject.val('deviceTypeId') as string) || ''
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
