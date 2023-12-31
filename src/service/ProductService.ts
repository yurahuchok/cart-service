import type RepositoryManager from "../repository/RepositoryManager";

class ProductService {
  constructor(protected rm: RepositoryManager) {}

  getProducts() {
    return this.rm.get("product").getProducts({
      sortBy: "title",
    });
  }

  getProductById(productId: string) {
    return this.rm.get("product").getProductById(productId);
  }
}

export default ProductService;
