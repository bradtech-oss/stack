import { AbstractMdmObject, MdmArchetypeSpec } from '@quatrain/mdm'
import { MapProperty, StringProperty, Core } from '@quatrain/core'

import deviceArchetypeConfig from './device.json'

/**
 * Physical Device Inventory Unit Model
 * Carries serialNumber and unit-level network Map (eth, wifi, lorawan, gsm, powerSource).
 */
export class Device extends AbstractMdmObject {
   static COLLECTION = 'devices'
   static PROPS_DEFINITION = [
      ...AbstractMdmObject.PROPS_DEFINITION,
      { name: 'serialNumber', type: StringProperty.TYPE, required: true },
      { name: 'deviceTypeId', type: StringProperty.TYPE, required: true },
      { name: 'network', type: MapProperty.TYPE, required: false, default: {} },
   ] as typeof AbstractMdmObject.PROPS_DEFINITION

   getArchetypeSpec(): MdmArchetypeSpec {
      return deviceArchetypeConfig as MdmArchetypeSpec
   }
}

// Register class to Quatrain Core class registry for object reference resolution
Core.addClass('Device', Device)
