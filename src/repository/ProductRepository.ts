import type DummyJsonClient from "../client/DummyJsonClient/client";

type GetProductsParams = {
  sortBy: "id" | "title" | "brand";
};

class ProductRepository {
  constructor(protected client: DummyJsonClient) {}

  getProductById(id: string) {
    return this.client.product(id);
  }

  getProducts(params: GetProductsParams) {
    return this.client.products().map((products) =>
      products.sort((a, b) => {
        switch (params.sortBy) {
          case "title":
            return a.title.localeCompare(b.title);
          case "brand":
            return a.brand.localeCompare(b.brand);
        }

        return a.id - b.id;
      }),
    );
  }
}

export default ProductRepository;
