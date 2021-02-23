/// <reference types="Cypress"/>

describe('Price Components without form manipulation', () => {
  const NEW_BASE_PRICE = 5

  beforeEach(() => {
    cy.visit('http://localhost:3000')
  })

  it('Change Base Price value to 5', () => {
    cy.get('#BasePrice').trigger('mouseenter').get('#base-edit-icon').click()
    cy.get('#base-value-input').clear().type(NEW_BASE_PRICE)
    cy.get('#base-check-icon').click()
    cy.get('[data-cy=totalValue]').should('contain', NEW_BASE_PRICE)
  })
})

describe('Price Components with form manipulation', () => {
  const INITIAL_BASE_PRICE = 1
  const TEST_VALUES = [
    ['Alloy surcharge', 2.15],
    ['Scrap surcharge', 3.14],
    ['Internal surcharge', 0.7658],
    ['External surcharge', 1],
    ['Storage surcharge', 0.3],
  ]
  const newTotal = TEST_VALUES.reduce((acc, curr) => {
    return parseFloat(acc) + parseFloat(curr[1])
  }, INITIAL_BASE_PRICE)

  beforeEach(() => {
    cy.visit('http://localhost:3000')
    TEST_VALUES.forEach((testValue) => {
      cy.get('#ghost-label-input').clear().type(testValue[0])
      cy.get('#ghost-value-input').clear().type(testValue[1])
      cy.get('#ghost-check-icon').click()
    })
  })
  it('Add all price components from Testdata', () => {
    function countDecimals(num) {
      const decimals = String(num).split('.')
      return decimals[1] ? decimals[1].length : 0
    }

    TEST_VALUES.forEach((testValue, i) => {
      if (countDecimals(testValue[1]) > 1) {
        cy.get(`[data-cy=orderRow${+i}]`).should(
          'contain',
          testValue[1].toFixed(2)
        )
      } else {
        cy.get(`[data-cy=orderRow${+i}]`).should(
          'contain',
          testValue[1].toFixed(1)
        )
      }
    })
  })
  it('Remove price component: Internal surcharge', () => {
    const ITEM_TO_REMOVE_LABEL = 'Internal surcharge'
    const ITEM_TO_REMOVE_VALUE = TEST_VALUES[2][1].toFixed(2)

    cy.contains(ITEM_TO_REMOVE_LABEL)
      .trigger('mouseenter')
      .get('[data-cy=trashIcon2]')
      .click()
    cy.get('[data-cy=totalValue]').should(
      'contain',
      newTotal.toFixed(2) - ITEM_TO_REMOVE_VALUE
    )
  })
  it('Edit price component: Storage surcharge', () => {
    const ITEM_LABEL_TO_EDIT = 'Storage surcharge'
    const ITEM_LABEL_SHORT = 'T'

    cy.contains(ITEM_LABEL_TO_EDIT)
      .trigger('mouseenter')
      .get('[data-cy=editIcon4]')
      .click()
    cy.get('[data-cy=labelInput4]').clear().type(ITEM_LABEL_SHORT)
    cy.get('[data-cy=fieldRow4]').should('contain', 'This label is too short!')
    cy.get('[data-cy=checkIcon4]').click()
    cy.get('[data-cy=fieldRow4]').should('contain', ITEM_LABEL_TO_EDIT)
  })
  it('Edit price component: Scrap surcharge', () => {
    const ITEM_LABEL_TO_EDIT = 'Scrap surcharge'
    const INITIAL_ITEM_VALUE = 3.14
    const NEW_ITEM_VALUE = -2.15

    cy.contains(ITEM_LABEL_TO_EDIT)
      .trigger('mouseenter')
      .get('[data-cy=editIcon1]')
      .click()
    cy.get('[data-cy=labelInputValue1]').clear().type(NEW_ITEM_VALUE)
    cy.get('[data-cy=fieldRow1]').should('contain', 'Cannot be negative!')
    cy.get('[data-cy=checkIcon1]').click()
    cy.get('[data-cy=orderRow1]').should('contain', INITIAL_ITEM_VALUE)
  })
  it('Edit price component: Alloy surcharge', () => {
    const ITEM_LABEL_TO_EDIT = 'Alloy surcharge'
    const NEW_ITEM_VALUE = 1.79
    const initialItemValue = 2.15
    const difference = initialItemValue - NEW_ITEM_VALUE

    cy.contains(ITEM_LABEL_TO_EDIT)
      .trigger('mouseenter')
      .get('[data-cy=editIcon0]')
      .click()
    cy.get('[data-cy=labelInputValue0]').clear().type(NEW_ITEM_VALUE)
    cy.get('[data-cy=checkIcon0]').click()
    cy.get('[data-cy=totalValue]').should(
      'contain',
      newTotal.toFixed(2) - difference
    )
  })
})
