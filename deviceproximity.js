import Sensor from './sensor.js';

export default class ProximitySensor extends Sensor {
  #$ = null;

  constructor() {
    const api = {};
    super('proximity', api);
    this.#$ = api;
    this.#setupDataCollection();
  }

  #setupDataCollection() {
    window.addEventListener('deviceproximity', event => {
      this.#$.emit({
        distance: event.value,
        max: event.max,
        min: event.min
      });
    });
  }

  extractState(data) {
    return {
      proximity: {
        distance: data.distance,
        max: data.max,
        min: data.min
      }
    };
  }
}

