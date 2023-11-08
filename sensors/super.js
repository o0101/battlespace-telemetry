/**
 * Sensor is a superclass for all sensors. It provides the structure and
 * common functionality for sensor objects. Subclasses should provide 
 * specific implementations for data collection and state extraction.
 */
export default class Sensor {
  #dataQueue = [];
  type = '';

  constructor(type) {
    if (new.target === Sensor) {
      throw new TypeError('Sensor cannot be directly instantiated.');
    }
    this.type = type;
  }

  /**
   * Subclasses should implement this method to setup event listeners or
   * any necessary initialization for data collection.
   */
  _setupDataCollection() {
    throw new Error('_setupDataCollection must be implemented by subclasses.');
  }

  /**
   * Adds data to the internal queue. This should be called by the event
   * listeners or data fetching logic specific to the sensor type.
   * @param {any} data The data to enqueue.
   */
  _enqueueData(data) {
    this.#dataQueue.push(data);
  }

  /**
   * Checks if data is available in the queue.
   * @returns {boolean} True if data is available, false otherwise.
   */
  async hasData() {
    return this.#dataQueue.length > 0;
  }

  /**
   * Retrieves the next available data from the queue.
   * @returns {any} The next data item in the queue.
   */
  async popData() {
    return this.#dataQueue.shift();
  }

  /**
   * Extracts the current state from the sensor data. This method should
   * be implemented by subclasses to parse and format the sensor data.
   * @param {any} data The raw sensor data.
   * @returns {object} The extracted state.
   */
  extractState(data) {
    throw new Error('extractState must be implemented by subclasses.');
  }

  // ... additional common methods and utilities...
}


