import { AbstractMdmObject, MdmArchetypeSpec } from '@quatrain/mdm'
import { MapProperty, StringProperty, Core } from '@quatrain/core'
import { DeviceDimensionsMap, DeviceVendorMap, DeviceElectricalMap, DeviceNetMap } from '@bradtech-oss/db'

import deviceArchetypeConfig from './mdm_device.json'

/**
 * Concrete Device Model for Catalog Models (DeviceType) and Physical Units (Device)
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

   public get sku(): string {
      return (this.dataObject.val('sku') as string) || ''
   }

   public get dimensionsMap(): DeviceDimensionsMap {
      return (this.dataObject.val('dimensions') as DeviceDimensionsMap) || { unitSystem: 'metric' }
   }

   public get vendorMap(): DeviceVendorMap {
      return (this.dataObject.val('vendor') as DeviceVendorMap) || { status: 'ACTIVE' }
   }

   public get electricalMap(): DeviceElectricalMap {
      return (this.dataObject.val('electrical') as DeviceElectricalMap) || {}
   }
}

/**
 * Physical Device Inventory Unit Model (Carries serialNumber and unit-level net Map)
 */
export class Device extends AbstractMdmObject {
   static COLLECTION = 'devices'
   static PROPS_DEFINITION = [
      ...AbstractMdmObject.PROPS_DEFINITION,
      { name: 'serialNumber', type: StringProperty.TYPE, required: true },
      { name: 'deviceTypeId', type: StringProperty.TYPE, required: true },
      { name: 'net', type: MapProperty.TYPE, required: false, default: {} },
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

   public get netMap(): DeviceNetMap {
      return (this.dataObject.val('net') as DeviceNetMap) || {}
   }
}

// Register classes to Quatrain Core class registry for object reference resolution
Core.addClass('DeviceType', DeviceType)
Core.addClass('Device', Device)
