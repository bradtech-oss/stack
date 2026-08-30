import { Core } from '@quatrain/core'
import type { ConversionContext, ConversionOutput, SensorConverterInterface } from './types'

export type SensorAdapterRegistry = { [alias: string]: SensorConverterInterface<any, any> }

/**
 * Sensor Micro-Framework Singleton Facade
 * Extends Quatrain Core, manages instantiated sensor adapters and coordinates conversions.
 */
export class Sensor extends Core {
   /** Reference ID for the primary default sensor adapter. */
   static defaultAdapter = '@default'

   /** Domain-specific Core Logger. */
   static logger = this.addLogger('Sensor')

   /** Registry of bound, instantiated sensor adapters */
   protected static _adapters: SensorAdapterRegistry = {}

   /**
    * Appends a new instantiated sensor adapter into the registry.
    *
    * @param adapter - The instantiated sensor converter/adapter.
    * @param alias - The lookup alias (defaults to adapter.modelCode).
    * @param setDefault - True to switch standard default adapter.
    */
   static addAdapter(
      adapter: SensorConverterInterface<any, any>,
      alias: string = adapter.modelCode,
      setDefault: boolean = false,
   ): typeof Sensor {
      this._adapters[alias] = adapter
      this.logger.debug?.(`Registered sensor adapter: '${alias}' (${adapter.constructor.name})`)

      if (setDefault) {
         this.defaultAdapter = alias
      }
      return this
   }

   /**
    * Retrieves an instantiated adapter by alias or model code.
    *
    * @param alias - Adapter alias or modelCode (defaults to defaultAdapter).
    * @returns Instantiated sensor adapter.
    * @throws When adapter is not found in registry.
    */
   static getAdapter<T extends SensorConverterInterface<any, any> = SensorConverterInterface<any, any>>(
      alias: string = this.defaultAdapter,
   ): T {
      if (this._adapters[alias]) {
         return this._adapters[alias] as T
      }
      throw new Error(`[Sensor] Unknown sensor adapter alias: '${alias}'. Registered adapters: [${Object.keys(this._adapters).join(', ')}]`)
   }

   /**
    * Checks if a sensor adapter is currently registered.
    */
   static hasAdapter(alias: string): boolean {
      return Boolean(this._adapters[alias])
   }

   /**
    * Returns the list of all registered adapter aliases.
    */
   static listAdapters(): string[] {
      return Object.keys(this._adapters)
   }

   /**
    * Clears all registered adapters (useful for test resets).
    */
   static reset(): void {
      this._adapters = {}
      this.defaultAdapter = '@default'
   }

   /**
    * Direct conversion helper using a named adapter.
    */
   static convert<TRaw = any, TContext extends ConversionContext = ConversionContext>(
      alias: string,
      raw: TRaw,
      context?: TContext,
   ): ConversionOutput[] {
      const adapter = this.getAdapter(alias)
      return adapter.convert(raw, context)
   }
}
