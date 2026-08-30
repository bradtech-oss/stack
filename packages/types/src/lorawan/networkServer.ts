import type { AsyncResult } from 'shulk'

/**
 * Supported Network Server Technology Stacks
 * Open type: includes common known technologies while allowing any custom server string.
 */
export type NetworkServerTechnology =
   | 'chirpstack'
   | 'the-things-stack'
   | 'orange-live-objects'
   | 'custom'
   | (string & {})

/**
 * Supported Gateway Hardware Models
 */
export type GatewayHardwareModel = 'DLOS8N' | 'TTIG' | 'TTG' | 'TTOG' | 'KONA_MICRO' | 'CUSTOM'

/**
 * Gateway Network Backhaul / Connectivity Type
 */
export type GatewayBackhaulType = '4G_CELLULAR' | 'WIFI' | 'ETHERNET'

/**
 * Technical Specification for Gateway Hardware Models
 */
export interface GatewayHardwareSpecificationInterface {
   model: GatewayHardwareModel
   manufacturer: string
   commercialName: string
   backhaul: GatewayBackhaulType
   isOutdoor: boolean
   defaultNetworkServer: NetworkServerTechnology
}

/**
 * Standard Gateway Health & Connectivity Status
 */
export interface GatewayHealthStatusInterface {
   gatewayId: string
   name: string
   isOnline: boolean
   lastSeenAt: Date
   technology: NetworkServerTechnology
   model?: GatewayHardwareModel
   backhaul?: GatewayBackhaulType
   rxPacketsCount?: number
   txPacketsCount?: number
   rawStats?: Record<string, any>
}

/**
 * Parameters required to provision an end-device (probe / weather station)
 */
export interface DeviceProvisioningParamsInterface {
   deviceId: string
   devEUI: string
   appEUI: string
   appKey: string
   companyName?: string
   companyId?: string
   plotName?: string
   deviceProfileId?: string
}

/**
 * Parameters to update an end-device's metadata (name, description, tags)
 */
export interface DeviceMetadataUpdateParamsInterface {
   devEUI: string
   name?: string
   description: string
   companyName?: string
   plotName?: string
}

/**
 * Technical Downlink Message to be queued on the Network Server
 */
export interface DownlinkMessageInterface {
   devEUI: string
   fPort: number
   payloadHex: string // e.g. "01" (Reboot), "0601" (Change mode)
   confirmed?: boolean
   priority?: 'LOW' | 'NORMAL' | 'HIGH'
}

/**
 * Common Network Server Connection Configuration
 */
export interface NetworkServerConfigInterface {
   serverUrl: string
   apiKey?: string
   timeoutMs?: number
   options?: Record<string, any>
}

/**
 * Universal Network Server Adapter Interface
 * Implemented by adapters for ChirpStack, The Things Stack (TTN), Orange Live Objects, etc.
 */
export interface NetworkServerAdapterInterface {
   readonly technology: NetworkServerTechnology

   // 📡 Gateway Monitoring & Telemetry
   getGatewayHealth(gatewayId: string): AsyncResult<Error, GatewayHealthStatusInterface>
   getGatewayStats(gatewayId: string, intervalSeconds?: number): AsyncResult<Error, Record<string, any>>

   // 📟 Device / Probe Management
   provisionDevice(params: DeviceProvisioningParamsInterface): AsyncResult<Error, void>
   updateDeviceMetadata(params: DeviceMetadataUpdateParamsInterface): AsyncResult<Error, void>
   deprovisionDevice(devEUI: string): AsyncResult<Error, void>
   resetDeviceSession(devEUI: string): AsyncResult<Error, void>

   // ⬇️ Downlinks & Control Commands
   sendDownlink(message: DownlinkMessageInterface): AsyncResult<Error, { messageId?: string }>

   // 📡 Real-time Telemetry Streams (MQTT)
   getMqttTopicFormats(): MqttTopicFormatInterface
   parseMqttMessage(topic: string, message: Buffer | string): MqttTelemetryEventInterface | null
   createMqttSubscriber(options?: Partial<MqttSubscriberConfigInterface>): MqttSubscriberInterface
}

/**
 * Topic pattern and formatting specifications per Network Server provider
 */
export interface MqttTopicFormatInterface {
   readonly technology: NetworkServerTechnology
   readonly defaultSubscriptionTopics: string[]
   readonly uplinkTopicTemplate: string
   readonly statusTopicTemplate?: string
   readonly joinTopicTemplate?: string
   readonly ackTopicTemplate?: string
   readonly customTopicPatterns?: string[]
}

/**
 * Configuration contract for MQTT Telemetry Subscribers (e.g. ChirpStack, TTN, Orange)
 */
export interface MqttSubscriberConfigInterface {
   brokerUrl: string
   dryRun: boolean
   clientId?: string
   topics?: string[]
   topicFormats?: MqttTopicFormatInterface
   messageParser?: (topic: string, message: Buffer | string) => MqttTelemetryEventInterface | null
   username?: string
   password?: string
   reconnectPeriodMs?: number
}

/**
 * Parsed event contract emitted by MQTT Telemetry Subscribers
 */
export interface MqttTelemetryEventInterface {
   topic: string
   applicationId: string
   devEui: string
   eventType: 'up' | 'status' | 'join' | 'ack' | 'location' | 'integration' | string
   timestamp: number
   fPort?: number
   fCnt?: number
   dataBase64?: string
   decodedPayload?: Record<string, any>
   rssi?: number
   snr?: number
   frequency?: number
   raw: Record<string, any>
}

/**
 * Common contract for MQTT Telemetry Subscriber instances across all Network Server providers
 */
export interface MqttSubscriberInterface {
   readonly config: MqttSubscriberConfigInterface
   connect(): Promise<void>
   disconnect(): Promise<void>
   onTelemetry(handler: (event: MqttTelemetryEventInterface) => Promise<void> | void): void
   parseMessage(topic: string, message: Buffer | string): MqttTelemetryEventInterface | null
}
