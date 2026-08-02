import { AbstractMdmObject, MdmArchetypeSpec } from '@quatrain/mdm'
import { MapProperty, StringProperty, Core } from '@quatrain/core'

import deviceArchetypeConfig from './device.json'

/**
 * Concrete Device Model for Catalog Models (DeviceType)
 * Carries type-level static hardware specifications (dimensions, vendor, electrical ratings).
 */
export class DeviceType extends AbstractMdmObject {
   static COLLECTION = 'device_types'
   static PROPS_DEFINITION = [
      ...AbstractMdmObject.PROPS_DEFINITION,
      { name: 'sku', type: StringProperty.TYPE, required: true },
      { name: 'dimensions', type: MapProperty.TYPE, required: false, default: { unitSystem: 'metric' } },
      { name: 'vendor', type: MapProperty.TYPE, required: false, default: {} },
      { name: 'electrical', type: MapProperty.TYPE, required: false, default: {} },
   ] as typeof AbstractMdmObject.PROPS_DEFINITION

   getArchetypeSpec(): MdmArchetypeSpec {
      return deviceArchetypeConfig as MdmArchetypeSpec
   }
}

// Register class to Quatrain Core class registry for object reference resolution
Core.addClass('DeviceType', DeviceType)
