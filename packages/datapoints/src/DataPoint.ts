import {
   PersistedBaseObject,
   PersistedDataObject,
} from '@quatrain/backend'
import {
   StringProperty,
   NumberProperty,
   EnumProperty,
   DateTimeProperty,
   ObjectProperty,
   Core,
} from '@quatrain/core'

/**
 * Property schema definition for the DataPoint model.
 */
export const DataPointProperties = [
   {
      name: 'device',
      type: StringProperty.TYPE,
      required: true,
   },
   {
      name: 'plot',
      type: StringProperty.TYPE,
      required: false,
   },
   {
      name: 'company',
      type: StringProperty.TYPE,
      required: false,
   },
   {
      name: 'metric',
      type: StringProperty.TYPE,
      required: true,
   },
   {
      name: 'value',
      type: NumberProperty.TYPE,
      required: true,
   },
   {
      name: 'unit',
      type: StringProperty.TYPE,
      default: '',
   },
   {
      name: 'kind',
      type: EnumProperty.TYPE,
      values: ['measured', 'forecast', 'computed'],
      default: 'measured',
   },
   {
      name: 'confidence',
      type: NumberProperty.TYPE,
      default: 1.0,
   },
   {
      name: 'timestamp',
      type: DateTimeProperty.TYPE,
      required: true,
   },
   {
      name: 'recordedat',
      type: DateTimeProperty.TYPE,
   },
   {
      name: 'metadata',
      type: ObjectProperty.TYPE,
      default: {},
   },
]

/**
 * Canonical DataPoint domain model in the Brad & Quatrain ecosystem.
 * Represents an atomic time-indexed telemetry or calculated agronomic measurement.
 */
export class DataPoint extends PersistedBaseObject {
   /** Database collection / table name. */
   static COLLECTION = 'datapoints'
   /** Property definition schema. */
   static PROPS_DEFINITION = DataPointProperties

   /**
    * Overrides default fillProperties to prevent injecting CRUD columns
    * (name, status, createdby, updatedby...) into the pure TimescaleDB hypertable schema.
    * 
    * @param child - Child class reference.
    * @returns The DataObject instance configured strictly with DataPointProperties.
    */
   static fillProperties(child: any = this) {
      const dao = PersistedDataObject.factory({
         properties: this.PROPS_DEFINITION,
         parentProp: this.PARENT_PROP,
      })
      dao.uri.class = child
      return dao
   }

   /**
    * Instantiates a new DataPoint model from raw data or existing entity.
    * 
    * @param src - Initial data or object URI.
    * @returns A promise resolving to the instantiated DataPoint.
    */
   static async factory(src: any = undefined): Promise<DataPoint> {
      return super.factory(src, DataPoint)
   }
}

Core.addClass('DataPoint', DataPoint)
