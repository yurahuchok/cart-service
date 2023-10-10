import Container from "typedi";
import InputService from "./service/InputService";
import OutputService from "./service/OutputService";
import LoginService from "./service/LoginService";
import ProductService from "./service/ProductService";
import CartService from "./service/CartService";
import DummyJsonClient from "./client/DummyJsonClient/client";
import RepositoryManager from "./repository/RepositoryManager";

const dummyJsonClient = new DummyJsonClient("https://dummyjson.com");
const repositoryManager = new RepositoryManager(dummyJsonClient);
const loginService = new LoginService(dummyJsonClient);

export default Container.of()
  .set(InputService, new InputService())
  .set(OutputService, new OutputService())
  .set(LoginService, loginService)
  .set(ProductService, new ProductService(repositoryManager))
  .set(CartService, new CartService(repositoryManager, loginService));
