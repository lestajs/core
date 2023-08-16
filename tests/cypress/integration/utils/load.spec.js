import { load } from '../../../../packages/utils'

describe('load function', () => {
  it('should return the default module if passed a Promise-wrapped module factory function', async () => {
    const fakeModule = { default: 'Hello, world!' }
    const testModule = () => Promise.resolve(fakeModule)
    const result = await load(testModule)
    expect(result).to.be.equal(fakeModule.default)
  })
  
  it('should return the original input if passed a non-function value', async () => {
    const result = await load('Hello, world!')
    expect(result).to.be.equal('Hello, world!')
  })
  
  it('should return undefined if passed a non-Promise-wrapped module factory function', async () => {
    const invalidModule = () => ({})
    const result = await load(invalidModule)
    expect(result).to.be.undefined
  })
}) 