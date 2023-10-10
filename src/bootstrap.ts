import Container from "typedi";
import InputService from "./service/InputService";
import OutputService from "./service/OutputService";
import LoginService from "./service/LoginService";
import ProductService from "./service/ProductService";
import CartService from "./service/CartService";
import DummyJsonClient from "./client/DummyJsonClient/client";
import ProductRepository from "./repository/ProductRepository";
import CartRepository from "./repository/CartRepository";

const dummyJsonClient = new DummyJsonClient("https://dummyjson.com");
const loginService = new LoginService(dummyJsonClient);

// TODO. Possibly some kind of repository manager instead.
const productRepository = new ProductRepository(dummyJsonClient);
const cartRepository = new CartRepository();

export default Container.of()
  .set(InputService, new InputService())
  .set(OutputService, new OutputService())
  .set(LoginService, loginService)
  .set(ProductService, new ProductService(productRepository))
  .set(CartService, new CartService(cartRepository, productRepository, loginService));
