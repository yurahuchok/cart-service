import CartRepository from "./CartRepository";
import ProductRepository from "./ProductRepository";
import type DummyJsonClient from "../client/DummyJsonClient/client";

type Repositories = {
  cart: CartRepository;
  product: ProductRepository;
};

class RepositoryManager {
  constructor(protected dummyJsonClient: DummyJsonClient) {}

  get<T extends keyof Repositories>(name: T): Repositories[T] {
    switch (name) {
      case "cart":
        return new CartRepository() as Repositories[T];
      case "product":
        return new ProductRepository(this.dummyJsonClient) as Repositories[T];
    }

    throw new Error("Invalid repository name");
  }
}

export default RepositoryManager;
