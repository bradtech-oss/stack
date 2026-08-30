import { describe, expect, it } from 'bun:test'
import { Sensor } from '@bradtech/sensor'
import { defaultSensorAdapters, registerDefaultSensorAdapters } from './defaultAdapters'

describe('defaultSensorAdapters & Sensor registration tests', () => {
   it('should expose pre-instantiated domain adapters ready for immediate use', () => {
      expect(defaultSensorAdapters.canopyAir).toBeDefined()
      expect(defaultSensorAdapters.soilMoisture).toBeDefined()
      expect(defaultSensorAdapters.solarRadiation).toBeDefined()
      expect(defaultSensorAdapters.rainGauge).toBeDefined()
      expect(defaultSensorAdapters.battery).toBeDefined()
      expect(defaultSensorAdapters.acousticSpl).toBeDefined()
   })

   it('should register all built-in adapters into the global Quatrain Sensor facade', () => {
      registerDefaultSensorAdapters()

      expect(Sensor.hasAdapter('canopyAir')).toBe(true)
      expect(Sensor.hasAdapter('soilMoisture')).toBe(true)
      expect(Sensor.hasAdapter('solarRadiation')).toBe(true)
      expect(Sensor.hasAdapter('battery')).toBe(true)

      const batteryAdapter = Sensor.getAdapter('battery')
      expect(batteryAdapter).toBe(defaultSensorAdapters.battery)

      const outputs = Sensor.convert('battery', { voltageMv: 3800, chemistry: 'li_ion' })
      expect(outputs.length).toBe(2)
      expect(outputs[0].metric).toBe('okf:power/battery/voltage')
      expect(outputs[0].value).toBe(3.8)
   })
})
