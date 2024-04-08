import {createSlot} from './slot'

/**
 * A signal instance that returns the current value when called as a function.
 * @namespace Signal
 * @type {Function}
 * @returns {any}
 */
const signalPrototype = {
  /**
   * Add listener to signal
   * @memberof Signal#
   * @param {Function} listener The listener to be executed when the signal dispatches
   * @param {boolean} [once=false] Executes the listener only once when set to true
   * @param {boolean} [immediate=false] Executes the listener immediately with current state
   * @returns {Slot}
   */
  add(listener, once=false, immediate=false) {
    if (typeof listener!=='function') throw 'listener is a required param of add() and should be a Function.'
    let slot
    if (!this.has(listener)) {
      slot = createSlot(listener, this, once)
      this._slots.push(slot)
    }
    immediate&&listener(...this._values)
    return slot
  },
  /**
   * Add listener to signal
   * @memberof Signal#
   * @param {Function} listener The listener to be executed when the signal dispatches
   * @returns {Slot}
   */
  addOnce(listener) {
    return this.add(listener, true)
  },
  /**
   * Remove all signal listeners
   * @memberof Signal#
   * @returns {Signal}
   */
  clear() {
    this._slots.forEach(slot => slot._signal = null)
    this._slots.splice(0, Number.MAX_SAFE_INTEGER)
    return this
  },
  /**
   * Dispatch the signal
   * The `values` parameter can be empty, a single value, or an array of values. The listener is executed with these values as parameters.
   * @memberof Signal#
   * @param {any[]} values
   * @returns {Signal}
   */
  dispatch(...values) {
    this._values.splice(0, Number.MAX_SAFE_INTEGER, ...values)
    this._slots.forEach(slot => {
      slot._listener(...values)
      slot.once&&slot.remove()
    })
    return this
  },
  /**
   * Test if listener was added
   * @memberof Signal#
   * @returns {boolean}
   */
  has(listener){
    return this._slots.find(slot=>slot._listener===listener)!==undefined
  },
  /**
   * The current state
   * @memberof Signal#
   * @returns {any[]}
   */
  get state(){
    return this._values
  }
}

/**
 * Factory method to create a signal
 * @param {any[]} [values] Values to initialise the signals state with
 * @returns {Signal}
 */
export function createSignal(...values) {
  const signalProperties = {
    /**
     * @memberof Signal#
     * @type {any}
     * @private
     */
    _values: {
      writable: false, value: values
    },
    /**
     * @memberof Signal#
     * @type {Slot[]}
     * @private
     */
    _slots: {
      writable: false, value: []
    },
    /**
     The number of listeners added
     * @memberof Signal#
     * @type {number}
     * @readonly
     */
    length: {
      get: function(){ return this._slots.length }
    }
  }
  const inst = Object.create(signalPrototype, signalProperties)
  return Object.defineProperties(() => {
    const {_values} = inst
    return _values.length===1?_values[0]:_values
  }, Object.keys({...signalPrototype, ...signalProperties}).reduce((acc, key) => {
    acc[key] = {get: () => inst[key]}
    return acc
  },{}))
}
