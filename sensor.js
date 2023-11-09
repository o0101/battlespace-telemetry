/**
 * Sensor is an abstract superclass for all sensor-related classes.
 * It defines a common interface and data structure for all types of sensors.
 * Specific sensor classes should inherit from this class and implement
 * the abstract methods to handle their particular data and permissions.
 */
export default class Sensor {
  // Subclasses should define a private field to namespace the protected members. #$ is recommended.

  // Private queue to store sensor data
  #_dataQueue = [];

  // Identifier for the type of sensor
  type = '';

  /**
   * Constructs a sensor object with a given type.
   * Throws an error if attempted to instantiate directly.
   *
   * @param {string} type - The type of the sensor.
   */
  constructor(type, api) {
    if (new.target === Sensor) {
      throw new TypeError('Sensor is an abstract class and cannot be instantiated directly.');
    }
    this.type = type;
    this.#imprintProtectedMembers(api);
  }

  // subclasses should pass their own symbol and set the API as follows
  /*
    // protected namespace 
    #$ = null; 

    constructor(type) {
      const $ = Symbol(`[[protected]]`);
      super(type, $);
      this.#$ = this[$];
    }
    // now protected methods are available under this.#$.<names> etc 
  */

  #imprintProtectedMembers(api) {
    Object.defineProperties(api, {
      emit: { value: this.#_enqueueData.bind(this), enumerable: true },
      q: {
        get: () => this.#_dataQueue,
        set: (val) => {
          this.#_dataQueue = val;
        },
        enumerable: true
      }
    });
  }

  /**
   * Queries the current permission status for the sensor.
   * Must be implemented by subclasses that require permissions.
   * @returns {Promise} A promise that resolves with the permission status.
   */
  async #queryPermissions() {
    throw new Error('#queryPermissions must be implemented by subclasses.');
  }

  /**
   * Requests permissions for the sensor, if necessary.
   * Must be implemented by subclasses that require permissions.
   * @returns {Promise} A promise that resolves when permissions are granted or rejected.
   */
  async #requestPermissions() {
    throw new Error('#requestPermissions must be implemented by subclasses.');
  }

  /**
   * Sets up the data collection mechanism for the sensor.
   * Must be implemented by subclasses to add event listeners or initiate data polling.
   */
  #setupDataCollection() {
    throw new Error('#setupDataCollection must be implemented by subclasses.');
  }

  /**
   * Adds data to the internal queue. This method is typically called within an event listener
   * or a data fetch operation to store the latest data from the sensor.
   *
   * @param {any} data - The sensor data to be enqueued.
   */
  #_enqueueData(data) {
    this.#_dataQueue.push(data);
  }

  /**
   * Checks if there is data available in the sensor's data queue.
   *
   * @returns {boolean} - True if data is available, false otherwise.
   */
  hasData() {
    return this.#_dataQueue.length > 0;
  }

  /**
   * Retrieves and removes the next available data item from the queue.
   *
   * @returns {Promise<any>} - A promise that resolves with the next data item.
   */
  async popData() {
    return this.#_dataQueue.shift();
  }

  /**
   * Extracts a state object from the raw sensor data.
   * This abstract method should be implemented by subclasses to
   * transform the raw sensor data into a structured state object.
   *
   * @param {any} data - The raw sensor data.
   * @returns {object} - The state object derived from the raw sensor data.
   */
  extractState(data) {
    throw new Error('extractState must be implemented by subclasses.');
  }

  // Additional methods and properties can be added here as needed.
}

