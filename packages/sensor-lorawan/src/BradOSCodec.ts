/**
 * Standard decoded telemetry channel extracted from a binary LoRaWAN payload frame.
 */
export interface DecodedRawChannel {
   /** Semantic channel type corresponding to the decoded physical quantity */
   channelType:
      | 'canopy_temp'
      | 'canopy_hum'
      | 'soil_moisture'
      | 'soil_temp'
      | 'soil_ec'
      | 'solar'
      | 'rain'
      | 'wind_speed'
      | 'wind_dir'
      | 'pressure'
      | 'battery'
      | 'acoustic_spl'
      | 'acoustic_rain'
      | 'acoustic_wind'
      | 'generic'
   /** Numerical value extracted from the 32-bit floating point payload */
   rawValue: number
   /** Physical hardware transducer manufacturer identifier (e.g. 'SHT40', 'Brad soil sensor', 'SI1145', 'BMP280') */
   sensorSource?: string
   /** Full commercial model name of the sensor component (e.g. 'Sensirion SHT40', 'Silicon Labs SI1145') */
   sensorModel?: string
   /** Depth placement in centimeters for multi-layer soil probes (10, 20, 30 cm) */
   depthCm?: number
   /** Optional unit hint for human diagnostic display */
   unitHint?: string
}

/**
 * Decoded fields extracted from the 9-byte BradOS boot frame (FPort 1).
 */
export interface DecodedBootPayload {
   /** Firmware semantic version string (e.g. "2.1.0") */
   version: string
   /** Build day of year code (e.g. 236 for DOY 236) */
   buildDoy: number
   /** Battery voltage at boot in millivolts */
   batteryMv: number
   /** Microcontroller hardware reset reason bitmask/code */
   resetReason: number
}

/**
 * BradOS Binary LoRaWAN Payload Codec.
 *
 * Decodes compact IEEE 754 Float32 Little-Endian telemetry payloads and maps
 * LoRaWAN FPort identifiers to hardware sensor sources and physical channels.
 */
export class BradOSCodec {
   /**
    * Decodes a Base64-encoded string or raw binary Buffer into an IEEE 754 32-bit Little-Endian float.
    *
    * @param data - Base64 string from ChirpStack or Node.js Buffer.
    * @returns Decoded number, or null if buffer length is invalid (< 4 bytes).
    */
   static decodeFloat32(data: string | Buffer): number | null {
      try {
         const buffer = typeof data === 'string' ? Buffer.from(data, 'base64') : data
         if (buffer.length < 4) return null
         return buffer.readFloatLE(0)
      } catch {
         return null
      }
   }

   /**
    * Decodes the 9-byte BradOS boot payload frame transmitted on FPort 1.
    *
    * Byte layout:
    * - Byte 0..2: Major, Minor, Patch version (uint8, uint8, uint8)
    * - Byte 3..4: Build Day-of-Year (uint16 LE)
    * - Byte 5..6: Battery voltage in mV (uint16 LE)
    * - Byte 7: Hardware reset reason (uint8)
    *
    * @param data - Base64 string or binary buffer.
    * @returns Decoded boot parameters, or null if corrupted.
    */
   static decodeBootPayload(data: string | Buffer): DecodedBootPayload | null {
      try {
         const buffer = typeof data === 'string' ? Buffer.from(data, 'base64') : data
         if (buffer.length < 8) return null

         const major = buffer.readUInt8(0)
         const minor = buffer.readUInt8(1)
         const patch = buffer.readUInt8(2)
         const buildDoy = buffer.readUInt16LE(3)
         const batteryMv = buffer.readUInt16LE(5)
         const resetReason = buffer.readUInt8(7)

         return {
            version: `${major}.${minor}.${patch}`,
            buildDoy,
            batteryMv,
            resetReason,
         }
      } catch {
         return null
      }
   }

   /**
    * Maps an incoming LoRaWAN FPort number and binary payload to a standard channel descriptor
    * with automatic hardware sensor attribution (SHT40, Brad soil sensor, Davis, SI1145, BMP280, MP34DT01).
    *
    * @param fPort - LoRaWAN Application Port number.
    * @param data - Base64 string or raw binary buffer containing the 4-byte Float32 payload.
    * @returns Decoded raw channel descriptor, or null if payload is malformed.
    */
   static decodeFPortChannel(fPort: number, data: string | Buffer): DecodedRawChannel | null {
      const floatVal = this.decodeFloat32(data)
      if (floatVal === null) return null

      switch (fPort) {
         case 2:
            return { channelType: 'battery', rawValue: floatVal, sensorSource: 'ASR6502 ADC', sensorModel: 'Internal ADC', unitHint: 'V' }
         case 9:
            return { channelType: 'solar', rawValue: floatVal, sensorSource: 'SI1145', sensorModel: 'Silicon Labs SI1145', unitHint: 'index' }
         case 11:
            return { channelType: 'canopy_hum', rawValue: floatVal, sensorSource: 'SHT40', sensorModel: 'Sensirion SHT40', unitHint: '%' }
         case 12:
            return { channelType: 'soil_moisture', rawValue: floatVal, sensorSource: 'Brad soil sensor', sensorModel: 'Brad Soil Sensor 10cm', depthCm: 10, unitHint: '%' }
         case 13:
            return { channelType: 'soil_moisture', rawValue: floatVal, sensorSource: 'Brad soil sensor', sensorModel: 'Brad Soil Sensor 20cm', depthCm: 20, unitHint: '%' }
         case 14:
            return { channelType: 'soil_moisture', rawValue: floatVal, sensorSource: 'Brad soil sensor', sensorModel: 'Brad Soil Sensor 30cm', depthCm: 30, unitHint: '%' }
         case 15:
            return { channelType: 'canopy_temp', rawValue: floatVal, sensorSource: 'SHT40', sensorModel: 'Sensirion SHT40', unitHint: '°C' }
         case 16:
            return { channelType: 'soil_temp', rawValue: floatVal, sensorSource: 'Brad soil sensor', sensorModel: 'Brad Soil Sensor 10cm', depthCm: 10, unitHint: '°C' }
         case 17:
            return { channelType: 'soil_temp', rawValue: floatVal, sensorSource: 'Brad soil sensor', sensorModel: 'Brad Soil Sensor 20cm', depthCm: 20, unitHint: '°C' }
         case 18:
            return { channelType: 'soil_temp', rawValue: floatVal, sensorSource: 'Brad soil sensor', sensorModel: 'Brad Soil Sensor 30cm', depthCm: 30, unitHint: '°C' }
         case 19:
            return { channelType: 'solar', rawValue: floatVal, sensorSource: 'SI1145', sensorModel: 'Silicon Labs SI1145', unitHint: 'W/m²' }
         case 20:
            return { channelType: 'rain', rawValue: floatVal, sensorSource: 'Davis 7852', sensorModel: 'Davis Rain Collector', unitHint: 'mm' }
         case 21:
            return { channelType: 'wind_speed', rawValue: floatVal, sensorSource: 'Davis 6410', sensorModel: 'Davis Anemometer', unitHint: 'km/h' }
         case 22:
            return { channelType: 'wind_dir', rawValue: floatVal, sensorSource: 'Davis 6410', sensorModel: 'Davis Vane', unitHint: '°' }
         case 23:
            return { channelType: 'pressure', rawValue: floatVal, sensorSource: 'BMP280', sensorModel: 'Bosch BMP280', unitHint: 'hPa' }
         case 24:
            return { channelType: 'acoustic_spl', rawValue: floatVal, sensorSource: 'MP34DT01', sensorModel: 'ST MEMS Microphone', unitHint: 'dBA' }
         case 25:
            return { channelType: 'acoustic_rain', rawValue: floatVal, sensorSource: 'MP34DT01', sensorModel: 'ST MEMS Microphone', unitHint: 'index' }
         case 26:
            return { channelType: 'acoustic_wind', rawValue: floatVal, sensorSource: 'MP34DT01', sensorModel: 'ST MEMS Microphone', unitHint: 'index' }
         case 31:
            return { channelType: 'soil_ec', rawValue: floatVal, sensorSource: 'Brad soil sensor', sensorModel: 'Brad Soil Sensor 10cm', depthCm: 10, unitHint: 'mS/cm' }
         case 32:
            return { channelType: 'soil_ec', rawValue: floatVal, sensorSource: 'Brad soil sensor', sensorModel: 'Brad Soil Sensor 20cm', depthCm: 20, unitHint: 'mS/cm' }
         case 33:
            return { channelType: 'soil_ec', rawValue: floatVal, sensorSource: 'Brad soil sensor', sensorModel: 'Brad Soil Sensor 30cm', depthCm: 30, unitHint: 'mS/cm' }
         default:
            return { channelType: 'generic', rawValue: floatVal }
      }
   }
}
