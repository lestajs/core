import { dive } from '../../../../packages/utils'

describe('dive function', () => {
  
  let proxied = {}
  
  const target = {
    name: 'Daria',
    age: 30,
    hobbies: ['reading', 'playing guitar'],
    address: {
      city: 'New York',
      state: 'NY'
    }
  }
  
  const handler = {
    beforeSet: (value, ref, compare, intercept) => {
        return compare()
    },
    set: (target, path, value, ref) => {},
    get: (target, ref) => {}
  }
  
  proxied = dive(target, handler)
  
  it('creates a proxy object that can track changes', () => {
    // Make changes to the object
    proxied.age = 31
    proxied.hobbies.push('hiking')
    proxied.address.zip = '10001'
    
    // Assert that changes were made
    expect(proxied.age).to.equal(31)
    expect(proxied.hobbies[2]).to.equal( 'hiking')
    expect(proxied.address.zip).to.equal('10001')
  })
  
  it('should be able to handle nested objects', () => {
    // Make changes to the nested object
    proxied.address.city = 'San Francisco'
    proxied.address['zip'] = '94016'
    
    // Assert that changes were made
    expect(proxied.address.city).to.equal('San Francisco')
    expect(proxied.address.zip).to.equal('94016')
  })
  
  it('should properly copy property descriptors', () => {
    // Change and check the descriptor of 'name' property
    Object.defineProperty(target, 'name', { writable: false })
    expect(Object.getOwnPropertyDescriptor(proxied, 'name').writable).to.equal(false)
  })
  
})