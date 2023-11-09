import Sensor from './sensor.js';

export default class GeolocationSensor extends Sensor {
  // Protected API
  #$ = null;

  constructor() {
    const api = {};
    super('geolocation', api);
    this.#$ = api;
    this.#queryPermissions();
  }

  async #queryPermissions() {
    if (navigator.permissions && navigator.permissions.query) {
      try {
        const result = await navigator.permissions.query({ name: 'geolocation' });
        if (result.state === 'granted') {
          this.#setupDataCollection();
        } else if (result.state === 'prompt') {
          // Request permission by actually trying to use the geolocation API
          navigator.geolocation.getCurrentPosition(position => {
            this.#setupDataCollection();
          }, error => {
            console.error('Geolocation permission denied.', error);
          });
        } else {
          console.error('Geolocation permission denied.');
        }
      } catch (error) {
        console.error('Error while querying geolocation permissions:', error);
      }
    } else {
      // Permissions API isn't supported or permission is already granted
      this.#setupDataCollection();
    }
  }

  #setupDataCollection() {
    // Assuming permission is granted, set up the position watcher
    navigator.geolocation.watchPosition(
      position => {
        this.#$.emit({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          altitude: position.coords.altitude,
          accuracy: position.coords.accuracy
        });
      },
      error => {
        console.error('Geolocation error:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  }

  extractState(data) {
    return {
      geolocation: {
        latitude: data.latitude,
        longitude: data.longitude,
        altitude: data.altitude,
        accuracy: data.accuracy
      }
    };
  }
}

