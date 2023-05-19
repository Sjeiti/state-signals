import {createSignal} from './signal'
import {createSlot} from './slot'

const noop = ()=>{}
const getNoop = ()=>()=>{}
const addThrowMessage = 'listener is a required param of add() and should be a Function.'

describe('signal', ()=>{

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

  describe('add', () => {

    it('should return a slot', ()=>{
      const signal = createSignal()
      const slot = signal.add(noop)
      expect(slot.__proto__).toBe(createSlot({}).__proto__)
    })

    it('should increase number of listeners', ()=>{
      const signal = createSignal()
      expect( signal.getNumListeners() ).toBe( 0 )
      signal.add(getNoop())
      expect( signal.getNumListeners() ).toBe( 1 )
      signal.add(getNoop())
      expect( signal.getNumListeners() ).toBe( 2 )
    })

    it('should not add same listener twice', ()=>{
      const signal = createSignal()
      signal.add(noop)
      const lastSlot = signal.add(noop)
      expect( signal.getNumListeners() ).toBe( 1 )
      expect( lastSlot ).toBe( undefined)
    })


    it('should throw error if listener isn\'t a function', ()=>{
      const signal = createSignal()
      expect(()=>signal.add()).toThrow(addThrowMessage)
      expect(()=>signal.add(123)).toThrow(addThrowMessage)
      expect(()=>signal.add(true)).toThrow(addThrowMessage)
      expect(signal.getNumListeners()).toBe( 0 )
    })

  })

  describe('has()', function () {

    it('it should check if signal has listener', function () {
      const signal = createSignal()
      expect(signal.has(noop)).toBe(false)
      signal.add(noop)
      expect(signal.has(noop)).toBe(true)
    })

  })

})



//

// const earned = createSignal(0)
// const spent = createSignal(0)
// const totals = createSignal(0)
//
// earned.add(n=>totals.dispatch(totals()+n))
// spent.add(n=>totals.dispatch(totals()-n))
// totals.add(console.log.bind(console,'totals'))
//
// earned.dispatch(100) // :   0 + 100 = 100
//       .dispatch(50)  // : 100 +  50 = 150
// spent.dispatch(120)  // : 150 - 120 =  30            earned.dispatch(20)  // :  30 +  20 =  50
// console.log('totals()',totals()) // : 50



//
// describe('array', () => {
//   describe('compareArrays', () => {
//     test('should compare', () => {
//       const a1 = [1, 3, 4, 5]
//       const a2 = [5, 1, 4, 3]
//       const a3 = [1, 2, 3, 4]
//       const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})
//       expect(compareArrays(a1, a2, 'console.warn for first', console)).toBe(true)
//       expect(warn).toBeCalledTimes(0)
//       expect(compareArrays(a1, a3, 'console.warn for second', console)).toBe(false)
//       expect(warn).toBeCalledTimes(1)
//     })
//   })
//
//   describe('areArraysEqual', () => {
//     test('should check if arrays are equal', () => {
//       const a1 = [1, 3, 4, 5]
//       const a2 = [5, 1, 4, 3]
//       const a3 = [5, 1, 4]
//       const a4 = [5, 1, 4, 3, 3]
//       expect(areArraysEqual(a1, a2)).toBe(true)
//       expect(areArraysEqual(a1, a3)).toBe(false)
//       expect(areArraysEqual(a3, a1)).toBe(false)
//       expect(areArraysEqual(a1, a4)).toBe(true)
//     })
//   })
//
//   describe('sumToFixed', () => {
//     test('should create something readable', () => {
//       expect(sumToFixed([1, 2])).toBe('3')
//       expect(sumToFixed([1.2, 2.4])).toBe('3.6')
//       expect(sumToFixed([1.2, 2.4], 1)).toBe('3.6')
//     })
//     test('should create something empty string for NaN', () => {
//       expect(sumToFixed(new Array(4))).toEqual('')
//     })
//   })
//
//   describe('intersect', () => {
//     test('should find the overlap between arrays', () => {
//       expect(intersect([1, 2], [2, 3])).toEqual([2])
//       expect(intersect([1, 2], [2, 2, 3])).toEqual([2])
//       expect(intersect([1, 2, 2], [2, 3])).toEqual([2, 2])
//     })
//   })
//
//   describe('removeFromArray', () => {
//     test('should remove stuff', () => {
//       let a
//       expect(removeFromArray([1, 2, 3], 2)).toEqual(true)
//       expect(removeFromArray([1, 2, 3], 4)).toEqual(false)
//       expect((a=[1, 2, 3], removeFromArray(a, 2), a)).toEqual([1, 3])
//       expect((a=[1, 2, 2, 3], removeFromArray(a, 2), a)).toEqual([1, 2, 3])
//     })
//   })
//
//   describe('pushReturn', () => {
//     test('should return the pushed element', () => {
//       const obj = {}
//       expect(pushReturn([], obj)).toEqual(obj)
//     })
//   })
//
//   describe('unique', () => {
//     test('should return an array with unique elements', () => {
//       expect(unique([1, 2, 3, 1, 2, 3])).toEqual([1, 2, 3])
//     })
//   })
//
// })
