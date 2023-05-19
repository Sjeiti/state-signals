import {createSlot} from './slot'

/**
 * A signal
 * @name Signal
 * @function
 */
const signalPrototype = {
  /**
   * Add listener to signal
   * @memberof Signal#
   * @param listener {Function}
   * @param once {boolean}
   * @returns {Slot}
   */
  add(listener, once=false) {
    (typeof listener==='function')||(throw 'listener is a required param of add() and should be a Function.')
    let slot
    if (!this.has(listener)) {
      slot = createSlot(listener, this, once)
      this._slots.push(slot)
    }
    return slot
  },
  /**
   * Add listener to signal
   * @memberof Signal#
   * @param listener {Function}
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
   * @memberof Signal#
   * @param values {any[]}
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
   * @returns {number}
   */
  has(listener){
    return this._slots.find(slot=>slot._listener===listener)!==undefined // todo: will fail for addOnce
  }
}

/**
 * Factory method to create a signal
 * @param values {any[]}
 * @returns {Signal}
 */
export function createSignal(...values) {
  const signalProperties = {
    /**
     * @memberof Signal#
     * @type {any}
     */
    _values: {
      writable: false, value: values
    },
    /**
     * @memberof Signal#
     * @type {Slot[]}
     */
    _slots: {
      writable: false, value: []
    },
    /**
     The number of listeners added
     * @memberof Signal#
     * @type {number}
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
