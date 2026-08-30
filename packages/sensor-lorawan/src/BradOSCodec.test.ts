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

   it('should map FPort 12 to 10cm soil moisture channel with Brad soil sensor source', () => {
      const buf = Buffer.alloc(4)
      buf.writeFloatLE(28.0, 0)
      const channel = BradOSCodec.decodeFPortChannel(12, buf)

      expect(channel).toBeDefined()
      expect(channel?.channelType).toBe('soil_moisture')
      expect(channel?.depthCm).toBe(10)
      expect(channel?.sensorSource).toBe('Brad soil sensor')
      expect(channel?.sensorModel).toBe('Brad Soil Sensor 10cm')
   })

   it('should map FPort 19 to solar irradiance with SI1145 sensor source', () => {
      const buf = Buffer.alloc(4)
      buf.writeFloatLE(750.0, 0)
      const channel = BradOSCodec.decodeFPortChannel(19, buf)

      expect(channel).toBeDefined()
      expect(channel?.channelType).toBe('solar')
      expect(channel?.sensorSource).toBe('SI1145')
      expect(channel?.sensorModel).toBe('Silicon Labs SI1145')
   })
})

