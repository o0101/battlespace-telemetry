import Sensor from './sensor.js';

export default class DeviceOrientationSensor extends Sensor {
  // Protected API
  #$ = null;

  constructor() {
    const api = {};
    super('deviceOrientation', api);
    this.#$ = api;
    this.#setupDataCollection();
  }

  #setupDataCollection() {
    window.addEventListener('deviceorientation', (event) => {
      this.#$.emit({
        alpha: event.alpha, // Z-axis rotation in degrees
        beta: event.beta,  // X-axis rotation in degrees
        gamma: event.gamma // Y-axis rotation in degrees
      });
    });
  }

  extractState(data) {
    return {
      deviceOrientation: {
        alpha: data.alpha,
        beta: data.beta,
        gamma: data.gamma
      }
    };
  }
}

