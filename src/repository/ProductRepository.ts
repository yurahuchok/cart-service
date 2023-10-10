import type DummyJsonClient from "../client/DummyJsonClient/client";

class ProductRepository {
  constructor(protected client: DummyJsonClient) {}

  getProductById(id: string) {
    return this.client.product(id);
  }

  getProducts() {
    return this.client.products();
  }
}

export default ProductRepository;
