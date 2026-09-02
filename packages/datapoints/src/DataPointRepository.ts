import {
   BaseRepository,
   Query,
   OperatorKeys,
   type BackendInterface,
} from '@quatrain/backend'
import { DataPoint } from './DataPoint'
import type { DataPointType, TimelineQueryOptions } from './types'

/**
 * Repository interface for creating, batch-persisting, and querying DataPoints.
 */
export class DataPointRepository extends BaseRepository<DataPointType> {
   /**
    * Instantiates the DataPointRepository with an optional specific backend adapter.
    * 
    * @param backendAdapter - Optional Quatrain backend adapter instance (e.g. PostgresAdapter).
    */
   constructor(backendAdapter?: BackendInterface) {
      super(DataPoint, backendAdapter)
   }

   /**
    * Instantiates and saves a single DataPoint into the configured database backend.
    * 
    * @param input - Partial DataPoint property values.
    * @returns The newly created and saved DataPoint instance.
    */
   async createDataPoint(input: Partial<DataPointType>): Promise<DataPoint> {
      const dataPoint = await DataPoint.factory()

      if (input.device) dataPoint._.device = input.device
      if (input.plot !== undefined) dataPoint._.plot = input.plot
      if (input.company !== undefined) dataPoint._.company = input.company
      if (input.metric) dataPoint._.metric = input.metric
      if (input.value !== undefined) dataPoint._.value = input.value
      if (input.unit !== undefined) dataPoint._.unit = input.unit
      if (input.kind !== undefined) dataPoint._.kind = input.kind
      if (input.confidence !== undefined) dataPoint._.confidence = input.confidence
      if (input.timestamp !== undefined) dataPoint._.timestamp = input.timestamp instanceof Date ? input.timestamp.toISOString() : input.timestamp
      if (input.recordedat !== undefined) dataPoint._.recordedat = input.recordedat instanceof Date ? input.recordedat.toISOString() : input.recordedat
      if (input.metadata !== undefined) dataPoint._.metadata = input.metadata

      return this.create(dataPoint)
   }

   /**
    * Batch inserts multiple DataPoints sequentially or via transaction.
    * 
    * @param dataPoints - Array of partial DataPoint inputs.
    * @returns Number of successfully persisted DataPoints.
    */
   async insertMany(dataPoints: Partial<DataPointType>[]): Promise<number> {
      let count = 0
      for (const item of dataPoints) {
         await this.createDataPoint(item)
         count++
      }
      return count
   }

   /**
    * Queries timeseries telemetry using the fluent @quatrain/backend Query builder.
    * 
    * @param options - Timeline filter, sorting, and pagination parameters.
    * @returns Array of matching DataPoint model instances.
    */
   async getTimeline(options: TimelineQueryOptions = {}): Promise<DataPoint[]> {
      const query = new Query<typeof DataPoint>(DataPoint)

      if (options.device) {
         query.where('device', options.device)
      }

      if (options.plot) {
         query.where('plot', options.plot)
      }

      if (options.company) {
         query.where('company', options.company)
      }

      if (options.metric) {
         query.where('metric', options.metric)
      }

      if (options.kind) {
         query.where('kind', options.kind)
      }

      if (options.from) {
         const fromStr = options.from instanceof Date ? options.from.toISOString() : options.from
         query.where('timestamp', fromStr, OperatorKeys.greaterOrEquals)
      }

      if (options.to) {
         const toStr = options.to instanceof Date ? options.to.toISOString() : options.to
         query.where('timestamp', toStr, OperatorKeys.lowerOrEquals)
      }

      query.sortBy('timestamp', options.order || 'desc')
      const limit = options.limit || 100
      query.batch(limit)

      if (options.page && options.page > 1) {
         query.offset((options.page - 1) * limit)
      }

      const { items } = await this.query(query)
      return items as unknown as DataPoint[]
   }

   /**
    * Retrieves the most recent DataPoint reading for a specific device or plot.
    * 
    * @param identifier - Device or plot identifier.
    * @param metric - Optional specific metric to filter on.
    * @returns The latest DataPoint, or undefined if no measurements exist.
    */
   async getLatest(identifier: string, metric?: string): Promise<DataPoint | undefined> {
      const query = new Query<typeof DataPoint>(DataPoint)

      query.where('device', identifier)

      if (metric) {
         query.where('metric', metric)
      }

      query.sortBy('timestamp', 'desc').batch(1)

      const { items } = await this.query(query)
      if (items.length > 0) {
         return items[0] as unknown as DataPoint
      }

      // Fallback query by plot if device didn't match
      const plotQuery = new Query<typeof DataPoint>(DataPoint)
      plotQuery.where('plot', identifier)
      if (metric) {
         plotQuery.where('metric', metric)
      }
      plotQuery.sortBy('timestamp', 'desc').batch(1)

      const plotResults = await this.query(plotQuery)
      return plotResults.items[0] as unknown as DataPoint | undefined
   }
}
