import Sensor from './sensor.js';

export default class ConnectivitySensor extends Sensor {
  // Protected API
  #$ = null;

  constructor() {
    const api = {};
    super('connectivity', api);
    this.#$ = api;
    this.#setupDataCollection();
  }

  #setupDataCollection() {
    // Set initial connectivity state
    setTimeout(() => this.#$.emit(this.#getConnectivityState()), 0);

    // Listen for online/offline changes
    window.addEventListener('online', () => {
      this.#$.emit(this.#getConnectivityState());
    });

    window.addEventListener('offline', () => {
      this.#$.emit(this.#getConnectivityState());
    });

    // If the Network Information API is supported, listen for changes in connection type
    if ('connection' in navigator) {
      navigator.connection.addEventListener('change', () => {
        this.#$.emit(this.#getConnectivityState());
      });
    }
  }

  #getConnectivityState() {
    const connectivityState = {
      online: navigator.onLine
    };

    // Include network information if available
    if ('connection' in navigator) {
      connectivityState.connection = {
        type: navigator.connection.type,
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        downlinkMax: navigator.connection.downlinkMax,
        rtt: navigator.connection.rtt,
        saveData: navigator.connection.saveData
      };
    }

    return connectivityState;
  }

  extractState(data) {
    // Here we just return the data as is, since it's already in a good format
    return {
      connectivity: data
    };
  }
}

