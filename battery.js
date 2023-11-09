import Sensor from './sensor.js';

export default class BatterySensor extends Sensor {
  // Protected API
  #$ = null;

  constructor() {
    const api = {};
    super('battery', api);
    this.#$ = api;
    this.#setupDataCollection();
  }

  async #setupDataCollection() {
    try {
      const battery = await navigator.getBattery();
      this.#$.emit(this.#getBatteryState(battery));

      // Add event listeners for battery status updates
      battery.addEventListener('chargingchange', () => {
        this.#$.emit(this.#getBatteryState(battery));
      });
      battery.addEventListener('levelchange', () => {
        this.#$.emit(this.#getBatteryState(battery));
      });
      battery.addEventListener('chargingtimechange', () => {
        this.#$.emit(this.#getBatteryState(battery));
      });
      battery.addEventListener('dischargingtimechange', () => {
        this.#$.emit(this.#getBatteryState(battery));
      });
    } catch (error) {
      console.error('Battery Sensor setup failed:', error);
    }
  }

  #getBatteryState(battery) {
    return {
      charging: battery.charging,
      level: battery.level,
      chargingTime: battery.chargingTime,
      dischargingTime: battery.dischargingTime
    };
  }

  extractState(data) {
    // Here we just return the data as is, since it's already in a good format
    return {
      battery: data
    };
  }
}

