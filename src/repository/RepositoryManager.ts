import CartRepository from "./CartRepository"
import ProductRepository from "./ProductRepository";
import DummyJsonClient from "../client/DummyJsonClient/client";
import { Output } from "@pulumi/pulumi";

type Repositories = {
  cart: CartRepository;
  product: ProductRepository;
}

class RepositoryManager {
  constructor(
    protected dummyJsonClient: DummyJsonClient,
    protected cartTableName: Output<string>
  ) {}
  
  get<T extends keyof Repositories>(name: T): Repositories[T] {
    switch(name) {
      case 'cart':
        return new CartRepository(this.cartTableName) as Repositories[T];
      case 'product':
        return new ProductRepository(this.dummyJsonClient) as Repositories[T];
    }

    throw new Error('Invalid repository name');
  }
}

export default RepositoryManager;
