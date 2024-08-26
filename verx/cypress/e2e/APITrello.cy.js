describe('Automação API Trello', () => {
  const baseUrl = 'https://api.trello.com/1'

  // Cadastrar um board
  it('Cadastrar um board', () => {
    cy.request({
      method: 'POST',
      url: `${baseUrl}/boards/`,
      qs: {
        name: 'Board de Teste',
        key: Cypress.env('TRELLO_KEY'),
        token: Cypress.env('TRELLO_TOKEN')
      }
    }).then(response => {
      expect(response.status).to.eq(200)
      cy.wrap(response.body).should('have.property', 'id')
      cy.wrap(response.body).should('have.property', 'name', 'Board de Teste')
      cy.wrap(response.body.id).as('boardId') // Guarda o ID do board para uso posterior
    })
  })

  // Cadastrar um card
  it('Cadastrar um card', function () {
    cy.request({
      method: 'POST',
      url: `${baseUrl}/cards`,
      qs: {
        name: 'Card de Teste',
        idList: this.boardId, // Substitua pelo ID de uma lista do board
        key: Cypress.env('TRELLO_KEY'),
        token: Cypress.env('TRELLO_TOKEN')
      }
    }).then(response => {
      expect(response.status).to.eq(200)
      cy.wrap(response.body).should('have.property', 'id')
      cy.wrap(response.body).should('have.property', 'name', 'Card de Teste')
      cy.wrap(response.body).should('have.property', 'idList', this.boardId)
      cy.wrap(response.body.id).as('cardId') // Guarda o ID do card para uso posterior
    })
  })

  // Excluir um card
  it('Excluir um card', function () {
    cy.request({
      method: 'DELETE',
      url: `${baseUrl}/cards/${this.cardId}`,
      qs: {
        key: Cypress.env('TRELLO_KEY'),
        token: Cypress.env('TRELLO_TOKEN')
      }
    }).then(response => {
      expect(response.status).to.eq(200);
      cy.request({
        method: 'GET',
        url: `${baseUrl}/cards/${this.cardId}`,
        qs: {
          key: Cypress.env('TRELLO_KEY'),
          token: Cypress.env('TRELLO_TOKEN')
        },
        failOnStatusCode: false
      }).then(getResponse => {
        expect(getResponse.status).to.eq(404) // Verifica se o card foi realmente deletado
      })
    })
  })

  // Excluir um board
  it('Excluir um board', function () {
    cy.request({
      method: 'DELETE',
      url: `${baseUrl}/boards/${this.boardId}`,
      qs: {
        key: Cypress.env('TRELLO_KEY'),
        token: Cypress.env('TRELLO_TOKEN')
      }
    }).then(response => {
      expect(response.status).to.eq(200)
      cy.request({
        method: 'GET',
        url: `${baseUrl}/boards/${this.boardId}`,
        qs: {
          key: Cypress.env('TRELLO_KEY'),
          token: Cypress.env('TRELLO_TOKEN')
        },
        failOnStatusCode: false
      }).then(getResponse => {
        expect(getResponse.status).to.eq(404) // Verifica se o board foi realmente deletado
      })
    })
  })
})
