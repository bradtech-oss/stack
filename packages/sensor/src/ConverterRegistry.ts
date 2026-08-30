import type { SensorConverterInterface } from './types'

/**
 * Global registry for discovering and indexing sensor converter instances
 * by sensor family and algorithmic model code.
 */
export class ConverterRegistry {
   /** Internal lookup map indexed by `family:modelCode` */
   private static _converters: Map<string, SensorConverterInterface> = new Map()

   /**
    * Registers an instantiated sensor converter into the global registry.
    *
    * @param converter - The sensor converter instance to index.
    */
   static register(converter: SensorConverterInterface): void {
      const key = `${converter.sensorFamily}:${converter.modelCode}`
      this._converters.set(key, converter)
   }

   /**
    * Looks up a converter by its sensor family and model code.
    *
    * @param sensorFamily - The domain family (e.g. 'soil', 'air').
    * @param modelCode - The unique model code (e.g. 'soil-vwc-texture-calibrated').
    * @returns The matching converter instance, or undefined if not found.
    */
   static get(sensorFamily: string, modelCode: string): SensorConverterInterface | undefined {
      return this._converters.get(`${sensorFamily}:${modelCode}`)
   }

   /**
    * Retrieves all converters registered under a specific sensor family.
    *
    * @param sensorFamily - The sensor family to filter by.
    * @returns An array of registered converters for the family.
    */
   static getByFamily(sensorFamily: string): SensorConverterInterface[] {
      return Array.from(this._converters.values()).filter((c) => c.sensorFamily === sensorFamily)
   }

   /**
    * Returns all currently registered converter instances.
    */
   static getAll(): SensorConverterInterface[] {
      return Array.from(this._converters.values())
   }

   /**
    * Clears all registered converters from the registry.
    */
   static clear(): void {
      this._converters.clear()
   }
}
