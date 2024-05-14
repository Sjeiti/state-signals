import {createSignal} from './signal'
import {createSlot} from './slot'

const getNoop = ()=>()=>{}
const noop = getNoop()
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

    it('should return the current value', ()=>{
      const signal = createSignal(0,0)
      expect(signal()).toEqual([0,0])
      signal.dispatch(12,34)
      expect(signal()).toEqual([12,34])
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

    it('should dispatch only once', ()=>{
      const signal = createSignal()
      let count = 0
      signal.add(()=>count++, true)
      expect(signal.length).toBe(1)
      expect(count).toBe(0)
      signal.dispatch()
      expect(signal.length).toBe(0)
      expect(count).toBe(1)
      signal.dispatch()
      expect(signal.length).toBe(0)
      expect(count).toBe(1)
    })

    it('should be able to dispatch immediately', ()=>{
      const signal = createSignal()
      signal.dispatch(23)
      let count = 0
      signal.add(n=>count=n, false, true)
      expect(count).toBe(23)
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
      signal.addOnce(getNoop())
      signal.add(getNoop())
      signal.add(getNoop())
      expect(signal.length).toBe(3)
      signal.clear()
      expect(signal.length).toBe(0)
    })

    it('should be chainable', function () {
      const value = createSignal(3)
          .clear()
          ()
      expect(value).toBe(3)
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

    it('should be chainable', function () {
      const value = createSignal(3)
          .dispatch(77)
          ()
      expect(value).toBe(77)
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

  describe('.state', function () {

    it('should hold state', function () {
      const signal = createSignal(1)
      expect(signal.state).toEqual([1])
      signal.dispatch(2,3)
      expect(signal.state).toEqual([2,3])
    })

  })

  describe('composition', function () {

    it('should stringify', function () {

      const name = createSignal('John Doe')
      const age = createSignal(30)

      const person = createSignal({name, age})

      age.dispatch(40)
      expect(person().age()).toEqual(40)
      expect(`${person().age}`).toEqual('40')
      expect(person().age.toString()).toEqual('40')
    })

  })

})
