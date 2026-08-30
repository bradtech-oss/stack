import { Sensor } from '@bradtech/sensor'
import {
   CanopyMicroclimateConverter,
   EvapotranspirationConverter,
   GroundFrostRiskConverter,
} from '@bradtech/sensor-air'
import {
   SoilMoistureConverter,
   SoilWaterPotentialConverter,
   SoilTemperatureConverter,
   SoilElectricalConductivityConverter,
} from '@bradtech/sensor-soil'
import {
   SolarRadiationConverter,
   RainGaugeConverter,
   WindConverter,
   BarometricPressureConverter,
} from '@bradtech/sensor-weather'
import { BatterySoCConverter, SolarHarvestingConverter } from '@bradtech/sensor-power'
import { AcousticSplConverter, AcousticWeatherConverter } from '@bradtech/sensor-acoustic'

/**
 * Pre-instantiated out-of-the-box domain sensor adapters dictionary.
 * Avoids redundant allocations across high-frequency message processing pipelines.
 */
export const defaultSensorAdapters = {
   /** In-canopy temperature, humidity, dew point and foliar VPD adapter */
   canopyAir: new CanopyMicroclimateConverter(),
   /** Hargreaves-Samani FAO-56 daily reference evapotranspiration (ET0) adapter */
   evapotranspiration: new EvapotranspirationConverter(),
   /** Roland Stull wet-bulb temperature and ground frost risk evaluator */
   frostRisk: new GroundFrostRiskConverter(),
   /** Multi-depth soil volumetric water content (VWC %) calibrated adapter */
   soilMoisture: new SoilMoistureConverter(),
   /** Van Genuchten soil matric water potential (kPa) and pF scale adapter */
   soilWaterPotential: new SoilWaterPotentialConverter(),
   /** Multi-depth soil profile thermistor adapter */
   soilTemperature: new SoilTemperatureConverter(),
   /** 25°C temperature-normalized soil electrical conductivity (mS/cm) adapter */
   soilEc: new SoilElectricalConductivityConverter(),
   /** Broadband solar pyranometer (W/m²) and PAR PPFD photon flux adapter */
   solarRadiation: new SolarRadiationConverter(),
   /** Tipping bucket rainfall accumulation (mm) and rain rate (mm/h) adapter */
   rainGauge: new RainGaugeConverter(),
   /** Anemometer wind speed (km/h) and 16-cardinal vane direction adapter */
   wind: new WindConverter(),
   /** Absolute barometric pressure and sea-level QNH reduction adapter */
   barometricPressure: new BarometricPressureConverter(),
   /** Chemistry-aware non-linear battery SoC (%) and brownout adapter */
   battery: new BatterySoCConverter(),
   /** Solar panel photovoltaic harvesting voltage adapter */
   solarHarvesting: new SolarHarvestingConverter(),
   /** MEMS microphone Sound Pressure Level (dBA SPL) adapter */
   acousticSpl: new AcousticSplConverter(),
   /** Acoustic rain droplet impact and aerodynamic wind turbulence adapter */
   acousticWeather: new AcousticWeatherConverter(),
}

/**
 * Registers all built-in Brad domain sensor adapters into the global Quatrain Sensor facade.
 *
 * @returns The initialized Sensor singleton class for fluent chaining.
 */
export function registerDefaultSensorAdapters(): typeof Sensor {
   Sensor.addAdapter(defaultSensorAdapters.canopyAir, 'canopyAir')
   Sensor.addAdapter(defaultSensorAdapters.evapotranspiration, 'evapotranspiration')
   Sensor.addAdapter(defaultSensorAdapters.frostRisk, 'frostRisk')
   Sensor.addAdapter(defaultSensorAdapters.soilMoisture, 'soilMoisture')
   Sensor.addAdapter(defaultSensorAdapters.soilWaterPotential, 'soilWaterPotential')
   Sensor.addAdapter(defaultSensorAdapters.soilTemperature, 'soilTemperature')
   Sensor.addAdapter(defaultSensorAdapters.soilEc, 'soilEc')
   Sensor.addAdapter(defaultSensorAdapters.solarRadiation, 'solarRadiation')
   Sensor.addAdapter(defaultSensorAdapters.rainGauge, 'rainGauge')
   Sensor.addAdapter(defaultSensorAdapters.wind, 'wind')
   Sensor.addAdapter(defaultSensorAdapters.barometricPressure, 'barometricPressure')
   Sensor.addAdapter(defaultSensorAdapters.battery, 'battery')
   Sensor.addAdapter(defaultSensorAdapters.solarHarvesting, 'solarHarvesting')
   Sensor.addAdapter(defaultSensorAdapters.acousticSpl, 'acousticSpl')
   Sensor.addAdapter(defaultSensorAdapters.acousticWeather, 'acousticWeather')

   return Sensor
}
