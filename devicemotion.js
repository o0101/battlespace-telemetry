import Sensor from './sensor.js';

export default class DeviceMotionSensor extends Sensor {
  // protected api
  #$ = null;

  constructor() {
    const api = {}
    super('deviceMotion', api); 
    this.#$ = api;
    this.#requestPermissions().then(permissionState => {
      if (permissionState === 'granted') {
        this.#setupDataCollection();
      } else {
        console.error('DeviceMotion permission not granted.');
      }
    }).catch(console.error);
  }

  async #queryPermissions() {
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
      const permissionState = await DeviceMotionEvent.requestPermission();
      return permissionState;
    }
    return 'granted';
  }

  async #requestPermissions() {
    const permissionState = await this.#queryPermissions();
    return permissionState;
  }

  #setupDataCollection() {
    window.addEventListener('devicemotion', (event) => {
      this.#$.emit({
        acceleration: event.acceleration,
        rotationRate: event.rotationRate,
        interval: event.interval
      });
    });
  }

  extractState(data) {
    return {
      deviceMotion: {
        acceleration: data.acceleration,
        rotationRate: data.rotationRate,
        interval: data.interval
      }
    };
  }
}

