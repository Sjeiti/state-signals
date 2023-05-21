import {Signal} from './signal'

/**
 * Factory method to create a slot
 * @param {Function} listener
 * @param {Signal} signal
 * @param {boolean} [once=false]
 * @returns {Slot}
 */
export function createSlot(listener: Function, signal: Signal, once?: boolean): Slot;

/**
 * A slot used in a signal
 * Contains the listener function and a reference to the related signal
 * @namespace Slot
 */
interface Slot {
  /**
   * Remove signal listener
   * @memberof Slot#
   * @returns {Slot}
   */
  remove: ()=>Slot

  /**
   * Listener can be executed only once
   * @memberof Slot#
   * @type {boolean}
   * @readonly
   */
  once: boolean

  /**
   * Slot is bound to a signal
   * @memberof Slot#
   * @type {boolean}
   * @readonly
   */
  isBound: boolean

}

