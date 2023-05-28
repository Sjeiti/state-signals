import {Slot} from './slot'

/**
 * Factory method to create a signal
 * @param {any[]} [values] Values to initialise the signals state with
 * @returns {Signal}
 */
export function createSignal(...values: any[]): Signal;

/**
 * A signal instance that returns the current value when called as a function.
 * @namespace Signal
 * @type {Function}
 * @returns {any}
 */
export interface Signal {
  (): any

  /**
   * Add listener to signal
   * @memberof Signal#
   * @param {Function} listener The listener to be executed when the signal dispatches
   * @param {boolean} [once=false] Executes the listener only once when set to true
   * @returns {Slot}
   */
  add: (listener, once?)=>Slot

  /**
   * Add listener to signal
   * @memberof Signal#
   * @param {Function} listener The listener to be executed when the signal dispatches
   * @returns {Slot}
   */
  addOnce: (listener)=>Slot

  /**
   * Remove all signal listeners
   * @memberof Signal#
   * @returns {Signal}
   */
  clear: ()=>Signal

  /**
   * Dispatch the signal
   * The `values` parameter can be empty, a single value, or an array of values. The listener is executed with these values as parameters.
   * @memberof Signal#
   * @param {any[]} values
   * @returns {Signal}
   */
  dispatch: (...values)=>Signal

  /**
   * Test if listener was added
   * @memberof Signal#
   * @returns {boolean}
   */
  has: (listener)=>boolean

  /**
   The number of listeners added
   * @memberof Signal#
   * @type {number}
   * @readonly
   */
  length: number
}

