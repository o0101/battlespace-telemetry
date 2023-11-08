# SensorStream

The `SensorStream` class aggregates data from multiple sensors and provides an asynchronous stream of the combined sensor states.

This documentation provides a quick start guide for developers to understand and begin using the `SensorStream` class. It includes examples to demonstrate how to instantiate the class, use the available options, and consume the sensor data stream.

## Constructor

Create a new `SensorStream` instance with an array of sensor objects and an optional options object.

```javascript
const sensorStream = new SensorStream(sensorArray, options);
```

- `sensorArray`: An array of sensors to be added to the stream.
- `options`: An object with optional settings.
  - `delay`: The delay between stream iterations in milliseconds or `'requestAnimationFrame'` for visual frame updates.
  - `accumulate`: A boolean to determine whether to accumulate state over time or to yield fresh state objects each iteration.

## Methods

### add(sensor)

Adds a new sensor to the stream.

```javascript
sensorStream.add(newSensor);
```

### remove(sensor)

Removes an existing sensor from the stream.

```javascript
sensorStream.remove(existingSensor);
```

### start()

Starts the sensor data stream.

```javascript
sensorStream.start();
```

### stop()

Stops the sensor data stream.

```javascript
sensorStream.stop();
```

## Usage

### Basic Usage

Create sensors and start streaming:

```javascript
const motionSensor = new DeviceMotionSensor();
const orientationSensor = new DeviceOrientationSensor();

const sensorStream = new SensorStream([motionSensor, orientationSensor]);

sensorStream.start();

(async () => {
  for await (const state of sensorStream) {
    console.log(state);
  }
})();
```

### With Options

```javascript
// Stream with a 100ms delay between iterations
const sensorStreamWithDelay = new SensorStream(sensorArray, { delay: 100 });

// Stream with state accumulation
const sensorStreamWithAccumulation = new SensorStream(sensorArray, { accumulate: true });

sensorStreamWithDelay.start();

(async () => {
  for await (const state of sensorStreamWithDelay) {
    console.log(state);
  }
})();
```

### Request Animation Frame Delay

Utilize the `requestAnimationFrame` to synchronize with browser repaints, useful for visual updates:

```javascript
const sensorStreamWithRAF = new SensorStream(sensorArray, { delay: 'requestAnimationFrame' });

sensorStreamWithRAF.start();

(async () => {
  for await (const state of sensorStreamWithRAF) {
    // Update your visualization here
  }
})();
```

## Notes

- When the `accumulate` option is `true`, the state object is built up over time with data from the sensors, with each sensor's latest data overwriting its previous state in the object.
- When the `delay` option is set to `'requestAnimationFrame'`, the stream yields new state data synchronized with the browser's repaint, making it ideal for animations or visual data representations.

