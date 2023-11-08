import Sensor from './super.js';

/**
 * DeviceMotionSensor extends the Sensor class to handle device motion data.
 */
export default class DeviceMotionSensor extends Sensor {
  constructor() {
    super('deviceMotion');
    this._setupDataCollection();
  }

  _setupDataCollection() {
    // DeviceMotionEvent.requestPermission() is a method specifically for iOS 13+
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
      DeviceMotionEvent.requestPermission()
        .then(permissionState => {
          if (permissionState === 'granted') {
            window.addEventListener('devicemotion', (event) => {
              this._enqueueData({
                acceleration: event.acceleration,
                rotationRate: event.rotationRate,
                interval: event.interval
              });
            });
          } else {
            console.error('DeviceMotion permission not granted.');
          }
        })
        .catch(console.error);
    } else {
      // For non-iOS 13+ devices, just add the event listener
      window.addEventListener('devicemotion', (event) => {
        this._enqueueData({
          acceleration: event.acceleration,
          rotationRate: event.rotationRate,
          interval: event.interval
        });
      });
    }
  }

  extractState(data) {
    // Here, you could convert the data into a different format,
    // or just return it directly if it's already in the desired format.
    return {
      deviceMotion: {
        acceleration: data.acceleration,
        rotationRate: data.rotationRate,
        interval: data.interval
      }
    };
  }
}


