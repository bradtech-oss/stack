import { describe, expect, it } from 'bun:test'
import { BradOSCodec } from './BradOSCodec'

describe('BradOSCodec Unit Tests', () => {
   it('should decode Float32 Little-Endian from Base64 string', () => {
      // 24.5 as Float32 LE = [0x00, 0x00, 0xC4, 0x41] -> Base64: "AADEQQ=="
      const buf = Buffer.alloc(4)
      buf.writeFloatLE(24.5, 0)
      const base64 = buf.toString('base64')

      const decoded = BradOSCodec.decodeFloat32(base64)
      expect(decoded).toBeCloseTo(24.5, 3)
   })

   it('should map FPort 15 to canopy temperature channel with SHT40 sensor source', () => {
      const buf = Buffer.alloc(4)
      buf.writeFloatLE(21.4, 0)
      const channel = BradOSCodec.decodeFPortChannel(15, buf)

      expect(channel).toBeDefined()
      expect(channel?.channelType).toBe('canopy_temp')
      expect(channel?.rawValue).toBeCloseTo(21.4, 1)
      expect(channel?.sensorSource).toBe('SHT40')
      expect(channel?.sensorModel).toBe('Sensirion SHT40')
   })

   it('should map FPort 46 to 5cm soil moisture channel with Brad soil sensor source', () => {
      const buf = Buffer.alloc(4)
      buf.writeFloatLE(28.0, 0)
      const channel = BradOSCodec.decodeFPortChannel(46, buf)

      expect(channel).toBeDefined()
      expect(channel?.channelType).toBe('soil_moisture')
      expect(channel?.depthCm).toBe(5)
      expect(channel?.sensorSource).toBe('Brad soil sensor')
      expect(channel?.sensorModel).toBe('Brad Soil Sensor 5cm')
   })

   it('should map FPort 16 to 15cm soil moisture channel with Brad soil sensor source', () => {
      const buf = Buffer.alloc(4)
      buf.writeFloatLE(28.0, 0)
      const channel = BradOSCodec.decodeFPortChannel(16, buf)

      expect(channel).toBeDefined()
      expect(channel?.channelType).toBe('soil_moisture')
      expect(channel?.depthCm).toBe(15)
      expect(channel?.sensorSource).toBe('Brad soil sensor')
      expect(channel?.sensorModel).toBe('Brad Soil Sensor 15cm')
   })

   it('should map FPort 17 to 30cm soil moisture channel with Brad soil sensor source', () => {
      const buf = Buffer.alloc(4)
      buf.writeFloatLE(32.5, 0)
      const channel = BradOSCodec.decodeFPortChannel(17, buf)

      expect(channel).toBeDefined()
      expect(channel?.channelType).toBe('soil_moisture')
      expect(channel?.depthCm).toBe(30)
      expect(channel?.sensorSource).toBe('Brad soil sensor')
      expect(channel?.sensorModel).toBe('Brad Soil Sensor 30cm')
   })

   it('should map FPort 13 to illuminance lux with SI1145 sensor source', () => {
      const buf = Buffer.alloc(4)
      buf.writeFloatLE(45000.0, 0)
      const channel = BradOSCodec.decodeFPortChannel(13, buf)

      expect(channel).toBeDefined()
      expect(channel?.channelType).toBe('solar_lux')
      expect(channel?.sensorSource).toBe('SI1145')
      expect(channel?.sensorModel).toBe('Silicon Labs SI1145')
   })

   it('should map FPort 9 to UV index with SI1145 sensor source', () => {
      const buf = Buffer.alloc(4)
      buf.writeFloatLE(6.2, 0)
      const channel = BradOSCodec.decodeFPortChannel(9, buf)

      expect(channel).toBeDefined()
      expect(channel?.channelType).toBe('solar_uv')
      expect(channel?.sensorSource).toBe('SI1145')
      expect(channel?.sensorModel).toBe('Silicon Labs SI1145')
   })

   it('should map FPort 50 to broadband solar irradiance with Davis 6450 sensor source', () => {
      const buf = Buffer.alloc(4)
      buf.writeFloatLE(750.0, 0)
      const channel = BradOSCodec.decodeFPortChannel(50, buf)

      expect(channel).toBeDefined()
      expect(channel?.channelType).toBe('solar')
      expect(channel?.sensorSource).toBe('Davis 6450')
      expect(channel?.sensorModel).toBe('Davis Solar Radiation Sensor')
   })
})
