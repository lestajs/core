import { queue } from '../../../../packages/utils'

describe('Queue', () => {
  
  it('should return correct size of the queue', () => {
    const fn1 = () => console.log('test1')
    const fn2 = () => console.log('test2')
    cy.wrap(queue()).then((q) => {
      q.add(fn1)
      q.add(fn2)
      expect(q.size()).to.equal(2)
    })
  })
  
  it('should return false when queue is not empty', () => {
    const fn = async () => await cy.wait(200)
    cy.wrap(queue()).then((q) => {
      q.add(fn)
      expect(q.isEmpty()).to.be.false
    })
  })
  
})