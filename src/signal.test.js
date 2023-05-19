import {createSignal} from './signal'
import {createSlot} from './slot'

const noop = ()=>{}
const getNoop = ()=>()=>{}
const addThrowMessage = 'listener is a required param of add() and should be a Function.'

describe('factory', ()=>{

  describe('createSignal', ()=>{

    it('should create an object', ()=>{
      expect(createSignal(1, 2)).toBeDefined()
    })

    it('should be able to nest signals', ()=>{
      const earned = createSignal(0)
      const totals = createSignal(0)

      let dispatchCalled = 0

      earned.add(n=>totals.dispatch(totals()+n))
      totals.add(()=>dispatchCalled++)

      earned.dispatch(100)

      expect(totals()).toBe(100)
      expect(dispatchCalled).toBe(1)
    })

  })

})

describe('signal', ()=>{

  describe('.add()', () => {

    it('should return a slot', ()=>{
      const signal = createSignal()
      const slot = signal.add(noop)
      expect(slot.__proto__).toBe(createSlot({}).__proto__)
    })

    it('should not add same listener twice', ()=>{
      const signal = createSignal()
      signal.add(noop)
      const lastSlot = signal.add(noop)
      expect(signal.length).toBe(1)
      expect(lastSlot).toBe(undefined)
    })

    it('should throw error if listener isn\'t a function', ()=>{
      const signal = createSignal()
      expect(()=>signal.add()).toThrow(addThrowMessage)
      expect(()=>signal.add(123)).toThrow(addThrowMessage)
      expect(()=>signal.add(true)).toThrow(addThrowMessage)
      expect(signal.length).toBe(0)
    })

    it('should dispatch more than once', ()=>{
      const signal = createSignal()
      let count = 0
      signal.add(()=>count++)
      expect(signal.length).toBe(1)
      expect(count).toBe(0)
      signal.dispatch()
      expect(signal.length).toBe(1)
      expect(count).toBe(1)
      signal.dispatch()
      expect(signal.length).toBe(1)
      expect(count).toBe(2)
    })

  })

  describe('.addOnce()', () => {

    it('should only dispatch once', ()=>{
      const signal = createSignal()
      let count = 0
      const listener = ()=>count++
      signal.addOnce(listener)
      expect(signal.length).toBe(1)
      expect(count).toBe(0)
      signal.dispatch()
      expect(signal.length).toBe(0)
      expect(count).toBe(1)
      signal.dispatch()
      expect(signal.length).toBe(0)
      expect(count).toBe(1)

      const slot1 = signal.addOnce(listener)
      expect(signal.length).toBe(1)
      expect(slot1).toBeDefined()
      const slot2 = signal.addOnce(listener)
      expect(signal.length).toBe(1)
      expect(slot2).toBeUndefined()
      slot1.remove()
      expect(signal.length).toBe(0)
      const slot3 = signal.addOnce(listener)
      expect(signal.length).toBe(1)
      expect(slot3).toBeDefined()
    })

  })

  describe('.clear()', () => {

    it('should remove all listeners', ()=>{
      const signal = createSignal()
      let count = 0
      signal.addOnce(getNoop())
      signal.add(getNoop())
      signal.add(getNoop())
      expect(signal.length).toBe(3)
      signal.clear()
      expect(signal.length).toBe(0)
    })

  })

  describe('.has()', function () {

    it('should check if signal has listener', function () {
      const signal = createSignal()
      expect(signal.has(noop)).toBe(false)
      signal.add(noop)
      expect(signal.has(noop)).toBe(true)
    })

  })

  describe('.dispatch()', function () {

    it('should execute all listeners', function () {
      const signal = createSignal()
      let dispatchedValue1 = 0
      let dispatchedValue2 = 0
      signal.add(v=>dispatchedValue1=v)
      signal.add(v=>dispatchedValue2=v)
      signal.dispatch(123)
      expect(dispatchedValue1).toBe(123)
      expect(dispatchedValue2).toBe(123)
    })

    it('should be able to execute with multiple params', function () {
      const signal = createSignal()
      let dispatchedValue = 0
      signal.add((a, b, c)=>dispatchedValue=a+b+c)
      signal.dispatch(1, 2, 3)
      expect(dispatchedValue).toBe(6)
    })

  })

  describe('.length', function () {

    it('should return the number of added listeners', function () {
      const signal = createSignal()
      expect(signal.length).toBe(0)
      signal.add(noop)
      expect(signal.length).toBe(1)
      signal.addOnce(noop)
      expect(signal.length).toBe(1)
      const noop1 = getNoop()
      signal.addOnce(noop1)
      expect(signal.length).toBe(2)
      signal.add(noop1)
      expect(signal.length).toBe(2)
      signal.add(getNoop())
      expect(signal.length).toBe(3)
    })

  })

})

describe('factory', ()=>{

  describe('createSlot', ()=>{

    it('should create an object', ()=>{
      expect(createSlot(()=>{}, {})).toBeDefined()
      expect(createSlot(()=>{}, {}, true)).toBeDefined()
    })

  })

})

describe('slot', ()=>{

  describe('.remove()', function () {

    it('should remove slot from signal', function () {
      const signal = createSignal()
      expect(signal.length).toBe(0)
      const slot = signal.add(noop)
      expect(signal.length).toBe(1)
      expect(signal.has(noop)).toBe(true)
      slot.remove()
      expect(signal.length).toBe(0)
      expect(signal.has(noop)).toBe(false)
    })

    it('should be callable multiple times', function () {
      const signal = createSignal()
      expect(signal.length).toBe(0)
      const slot = signal.add(noop)
      expect(signal.length).toBe(1)
      slot.remove()
      slot.remove()
      expect(signal.length).toBe(0)
    })

  })

  describe('.once', function () {

    it('should return whether slot can only be executed once', function () {
      const signal = createSignal()
      expect(signal.add(getNoop()).once).toBe(false)
      expect(signal.addOnce(getNoop()).once).toBe(true)
    })

  })

  describe('.isBound', function () {

    it('should be true when slot is bound to a signal', function () {
      const signal = createSignal()
      const slot = signal.add(noop)
      expect(slot.isBound).toBe(true)
      slot.remove()
      expect(slot.isBound).toBe(false)

      const slot1 = signal.addOnce(noop)
      expect(slot1.isBound).toBe(true)
      signal.dispatch()
      expect(slot1.isBound).toBe(false)
    })

  })

})