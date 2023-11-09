import Sensor from './class.js';

export default class BluetoothSensor extends Sensor {
  // Protected API
  #$ = null;

  constructor() {
    const api = {};
    super('bluetooth', api);
    this.#$ = api;
    // Directly call the setup function since Bluetooth permissions are requested upon device connection
    this.#setupDataCollection();
  }

  // Set up data collection from the Bluetooth device
  #setupDataCollection() {
    if ( 'bluetooth' in navigator ) {
      navigator.bluetooth.requestDevice({ acceptAllDevices: true })
        .then(device => {
          console.log('Bluetooth device connected:', device.name);
          // Here you would implement the logic to communicate with the device
          // For example, getting a GATT server and reading from or writing to a characteristic
          return device.gatt.connect();
        })
        .then(server => {
          // Get the primary service and characteristic you want to interact with
          // This is just placeholder logic and would need to be adapted for your specific device
          // return server.getPrimaryService('battery_service');
        })
        .then(service => {
          // Again, placeholder logic
          // return service.getCharacteristic('battery_level');
        })
        .then(characteristic => {
          // Once you have a characteristic, you can start reading from or writing to it
          // characteristic.readValue().then(value => {
          //   this.#$.emit({ batteryLevel: value.getUint8(0) });
          // });
        })
        .catch(error => {
          console.error('Bluetooth error:', error);
        });
    } 
  }

  extractState(data) {
    // The actual implementation would depend on the data structure provided by your Bluetooth device
    return {
      bluetooth: {
        // ...data properties here
      }
    };
  }
}

