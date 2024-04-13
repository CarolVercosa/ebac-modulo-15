/// <reference types="cypress" />

import contrato from '../contracts/usuarios.contract'

describe("Testes da Funcionalidade Usuários", () => {

  let token

  beforeEach(() => {
    cy.token("fulano@qa.com", "teste").then((tkn) => {
    token = tkn;
    });
  });

  it("Deve validar contrato de usuários", () => {
    cy.request('usuarios').then(response => {
      return contrato.validateAsync(response.body)
    })
  });

  it("Deve listar usuários cadastrados", () => {
    cy.request({
      method: "GET",
      url: "usuarios",
    }).should((response) => {
      expect(response.status).equal(200);
      expect(response.body).to.have.property("usuarios");
    });
  });

  it("Deve cadastrar usuário com sucesso", () => {
    const generateRandomEmail = () => Math.random().toString(36).substring(7) + '@example.com';
    cy.request({
      method: "POST",
      url: "usuarios",
      headers: {authorization: token},
      body: {
        "nome": "Exclusão 05",
        "email": generateRandomEmail(),
        "password": "senha1234",
        "administrador": "true",
      },
    }).should((response) => {
      expect(response.status).equal(201);
      expect(response.body.message).equal("Cadastro realizado com sucesso");
    });
  });

  it("Deve validar um usuário com email inválido", () => {
    cy.request({
      method: "POST",
      url: "usuarios",
      headers: {authorization: token},
      body: {
        nome: "Socorro",
        email: "socorro1278909@teste.com",
        password: "senha1234",
        administrador: "true",
      },
      failOnStatusCode: false
    }).should((response) => {
      expect(response.status).equal(400);
      expect(response.body.message).equal("Este email já está sendo usado");
    });
  });

  it("Deve editar um usuário previamente cadastrado", () => {
    cy.request({
      method: "PUT",
      url: "usuarios/VZfWDshgJ3KPk7xy",
      headers: {authorization: token},
      body: {
        nome: "Mariana alterada",
        email: "mariana_alterada@teste.com.br",
        password: "senha1234",
        administrador: "true",
      },
    }).should((response) => {
      expect(response.status).equal(200);
      expect(response.body.message).equal("Registro alterado com sucesso");
    });
  });

  it("Deve deletar um usuário previamente cadastrado", () => {
    cy.request({
      method: "DELETE",
      url: "usuarios/pgNGnFcH0yokQ4BY",
      headers: {authorization: token},
    }).should((response) => {
      expect(response.status).equal(200);
      expect(response.body.message).equal("Registro excluído com sucesso");
    });
  });
});
