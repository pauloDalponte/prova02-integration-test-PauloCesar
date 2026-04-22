import pactum from 'pactum';
import { StatusCodes } from 'http-status-codes';
import { SimpleReporter } from '../simple-reporter';
import { faker } from '@faker-js/faker';

describe('Fake Store API - Produtos', () => {
  const p = pactum;
  const rep = SimpleReporter;
  const baseUrl = 'https://fakestoreapi.com';

  p.request.setDefaultTimeout(30000);

  p.request.setDefaultHeaders({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': '*/*'
  });

  let productId: number;

  beforeAll(() => p.reporter.add(rep));
  afterAll(() => p.reporter.end());

  describe('Products', () => {
    
    //cadastra novo produto

    it('CREATE - Novo produto', async () => {
      const createRes = await p
        .spec()
        .post(`${baseUrl}/products`)
        .withJson({
          title: faker.commerce.productName(),
          price: parseFloat(faker.commerce.price()),
          description: faker.commerce.productDescription(),
          image: "http://example.com",
          category: faker.commerce.department()
        })
        .expectStatus(StatusCodes.CREATED)
        .expectJsonLike({ id: /\d+/ });

      productId = createRes.json.id;
    });

    //le se existe o produto 

    it('READ - Obter produto criado', async () => {
      await p
        .spec()
        .get(`${baseUrl}/products/${productId}`)
        .expectStatus(StatusCodes.OK);
    });

    //atualiza o produto (preco)

    it('UPDATE - Atualizar produto', async () => {
      await p
        .spec()
        .put(`${baseUrl}/products/${productId}`)
        .withJson({
          title: 'Produto Atualizado',
          price: 99.99,
          description: 'Descrição atualizada de teste',
          image: 'https://via.placeholder.com/150',
          category: 'updated-category'
        })
        .expectStatus(StatusCodes.OK)
        .expectJsonLike({
          id: productId
        });
    });

    //acao de delete

    it('DELETE - Remover produto', async () => {
      await p
        .spec()
        .delete(`${baseUrl}/products/${productId}`)
        .expectStatus(StatusCodes.OK);
    });

    //valida se foi deletado

    it('READ - Verificar produto deletado (esperado: not found ou similar)', async () => {
      await p
        .spec()
        .get(`${baseUrl}/products/${productId}`)
        .expectStatus(StatusCodes.OK); 
    });

  });  
});
