import pactum from 'pactum';
import { StatusCodes } from 'http-status-codes';
import { SimpleReporter } from '../simple-reporter';
import { faker } from '@faker-js/faker';

describe('JSONPlaceholder API - Testes de Integração', () => {
  const p = pactum;
  const baseUrl = 'https://typicode.com';

  // Aumenta o timeout global e define headers básicos para evitar rejeição
  p.request.setDefaultTimeout(30000);
  
  beforeAll(() => p.reporter.add(SimpleReporter));
  afterAll(() => p.reporter.end());

  describe('Posts (Simulando Produtos)', () => {

    it('CREATE - Criar novo post', async () => {
      await p
        .spec()
        .post(`${baseUrl}/posts`)
        .withJson({
          title: faker.commerce.productName(),
          body: faker.commerce.productDescription(),
          userId: 1
        })
        .expectStatus(StatusCodes.CREATED);
    });

    it('READ - Obter post por ID', async () => {
      await p
        .spec()
        .get(`${baseUrl}/posts/1`)
        // O .inspect() imprimirá no console do GitHub Actions se a resposta vier vazia
        .inspect() 
        .expectStatus(StatusCodes.OK);
    });

    it('UPDATE - Atualizar post', async () => {
      await p
        .spec()
        .put(`${baseUrl}/posts/1`)
        .withJson({
          id: 1,
          title: 'Título Atualizado',
          body: 'Conteúdo atualizado',
          userId: 1
        })
        .expectStatus(StatusCodes.OK);
    });

    it('DELETE - Remover post', async () => {
      await p
        .spec()
        .delete(`${baseUrl}/posts/1`)
        .expectStatus(StatusCodes.OK);
    });

    it('READ - Verificar persistência (Mock behavior)', async () => {
      // Adicionamos um pequeno retry ou delay caso a rede do CI oscile
      await new Promise(res => setTimeout(res, 1000));

      await p
        .spec()
        .get(`${baseUrl}/posts/1`)
        .expectStatus(StatusCodes.OK);
    });
  });  
});
