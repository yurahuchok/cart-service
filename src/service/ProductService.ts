import ProductRepository from "../repository/ProductRepository";

class ProductService {
  constructor(protected productRepository: ProductRepository) {}

  getProducts() {
    return this.productRepository.getProducts();
  }

  getProductById(productId: string) {
    return this.productRepository.getProductById(productId);
  }
}

export default ProductService;
