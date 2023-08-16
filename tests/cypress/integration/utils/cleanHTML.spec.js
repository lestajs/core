import { cleanHTML } from '../../../../packages/utils'

describe('cleanHTML function', () => {
  it('should remove all script tags from HTML', () => {
    const htmlWithScript = `<script>alert('xss')</script>`
    
    const cleanedHTML = cleanHTML(htmlWithScript)
    
    cy.wrap(Array.from(cleanedHTML)).should('not.contain', '<script>')
  })
  
  it('should remove all potentially dangerous attributes from HTML', () => {
    const htmlWithDangerousAttributes = `<a href="javascript:alert('xss')">Link</a>`
    
    const cleanedHTML = cleanHTML(htmlWithDangerousAttributes)
    
    cy.wrap(Array.from(cleanedHTML)).should('not.contain', 'href')
  })
  
  it('should remove all potentially dangerous events from HTML', () => {
    const htmlWithDangerousEvents = `<div onclick="alert('xss')">Clickable</div>`
    
    const cleanedHTML = cleanHTML(htmlWithDangerousEvents)
    
    cy.wrap(Array.from(cleanedHTML)).should('not.contain', 'onclick')
  })
})