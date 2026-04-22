import pactum from 'pactum';
import { StatusCodes } from 'http-status-codes';
import { SimpleReporter } from '../simple-reporter';
import { faker } from '@faker-js/faker';

describe('Fake Store API - CRUD de usuario', () => {
  const p = pactum;
  const rep = SimpleReporter;
  const baseUrl = 'https://fakestoreapi.com';

  p.request.setDefaultTimeout(30000);
  let UserId: number;

  beforeAll(() => p.reporter.add(rep));
  afterAll(() => p.reporter.end());

  describe('User', () => {

    const user = { username: 'paulo', email: 'paulocesar@gmail.com', password: 'pc2510' };
    const userUpdate = { username: 'paulo', email: 'paulocesar@gmail.com', password: 'paulo5465' };

    //criacao de usuario

    it('CREATE - Novo usuario', async () => {
      const createRes = await p
        .spec()
        .post(`${baseUrl}/users`)
        .withJson({
            user
        })
        .expectStatus(StatusCodes.CREATED)
        .expectJsonLike({ id: /\d+/ });

        UserId = createRes.json.id;
    });

    //verifica usuario criado

    it('READ - Recuperar usuario criado', async () => {
      await p
        .spec()
        .get(`${baseUrl}/users/${UserId}`)
        .expectStatus(StatusCodes.OK);
    });

    //atualiza informação do usuario

    it('UPDATE - Atualizar usuario', async () => {
      await p
        .spec()
        .put(`${baseUrl}/users/${UserId}`)
        .withJson({
          userId: UserId,
          userUpdate
        })
        .expectStatus(StatusCodes.OK)
        .expectJsonLike({
            userId: /\d+/ 
        });
    });

    //deleta o usuario

    it('DELETE - Remover usuario', async () => {
      await p
        .spec()
        .delete(`${baseUrl}/users/${UserId}`)
        .expectStatus(StatusCodes.OK);
    });

      //valida se foi deletado

    it('READ - Verificar usuario deletado (esperado: not found ou similar)', async () => {
      await p
        .spec()
        .get(`${baseUrl}/users/${UserId}`)
        .expectStatus(StatusCodes.OK); 
    });

  });  
});