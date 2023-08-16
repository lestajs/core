import { deliver } from '../../../../packages/utils'

describe('deliver function', () => {
  it('should deliver the value to the target object', () => {
    const targetObj = {a: {b: {c: null}}}
    const path = ['a', 'b', 'c']
    const value = 'Hello World'
    deliver(targetObj, path, value)
    expect(targetObj.a.b.c).to.eq(value)
  })
})