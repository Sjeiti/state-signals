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
   * @param callback {Function}
   * @returns {Slot}
   */
  add(callback) {
    // (typeof callback==='function')||throw new Error('listener is a required param of add() and should be a Function.')
    (typeof callback==='function')||(throw 'listener is a required param of add() and should be a Function.')
    const {_slots} = this
    const hasSlotWithCallback = _slots.find(slot=>slot._callback===callback) // todo: will fail for addOnce
    let slot
    if (hasSlotWithCallback===undefined) {
      slot = createSlot(callback,this)
      _slots.push(slot)
    }
    return slot
  },
  /**
   * Add listener to signal
   * @memberof Signal#
   * @param callback {Function}
   * @returns {Slot}
   */
  addOnce(callback) {
    const slot = createSlot(r,this)

    function r(...values) {
      callback(...values)
      slot.remove()
    }

    this._slots.push(slot)
    return slot
  },
  /**
   * Remove all signal listeners
   * @memberof Signal#
   * @returns {Signal}
   */
  clear() {
    this._slots.forEach(slot => slot._signal = null)
    this._slots.splice(0,Number.MAX_SAFE_INTEGER)
    return this
  },
  /**
   * Dispatch the signal
   * @memberof Signal#
   * @param values {any[]}
   * @returns {Signal}
   */
  dispatch(...values) {
    this._values.splice(0,Number.MAX_SAFE_INTEGER,...values)
    this._slots.forEach(slot => slot._callback(...values))
    return this
  },
  /**
   * Get the number of listeners
   * @memberof Signal#
   * @returns {number}
   */
  getNumListeners(...values) {
    return this._slots.length
  }
}

/**
 * Factory method to create a signal
 * @param values {any[]}
 * @return {Signal}
 */
export function createSignal(...values) {
  const signalProperties = {
    /**
     * @memberof Signal#
     * @type {any}
     */
    _values: {
      writable: false,value: values
    },
    /**
     * @memberof Signal#
     * @type {Slot[]}
     */
    _slots: {
      writable: false,value: []
    }
  }
  const inst = Object.create(signalPrototype,signalProperties)
  return Object.defineProperties(() => {
    const {_values} = inst
    return _values.length===1?_values[0]:_values
  },Object.keys({...signalPrototype,...signalProperties}).reduce((acc,key) => {
    acc[key] = {get: () => inst[key]}
    return acc
  },{}))
}