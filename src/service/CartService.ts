import { combine, err, okAsync } from "neverthrow";
import type LoginService from "./LoginService";
import AuthError from "../error/AuthError";
import CartRepository from "../repository/CartRepository";
import ProductRepository from "../repository/ProductRepository";
import RepositoryManager from "../repository/RepositoryManager";

class CartService {
  constructor(
    protected rm: RepositoryManager,
    protected loginService: LoginService,
  ) {}

  protected getUserId() {
    return okAsync(this.loginService.getAuthenticated()?.id).andThen((id) => {
      return id !== undefined
        ? okAsync(id)
        : err(new AuthError("Unauthorized."));
    });
  }

  protected getProductById(productId: string) {
    return this.rm.get('product').getProductById(productId);
  }

  getCartItems() {
    return this.getUserId().andThen((userId) => {
      return this.rm.get('cart').getCartItemsByUserId(userId);
    });
  }

  upsertProductToCart(productId: string, quantity: number) {
    return combine([
      this.getUserId(),
      this.getProductById(productId),
    ] as const).andThen(([userId]) => {
      return this.rm.get('cart')
        .addOrUpdateCartItemByUserIdAndProductId(userId, productId, {
          Count: quantity,
        });
    });
  }

  removeProductFromCart(productId: string) {
    return this.getUserId().andThen((userId) => {
      return this.rm.get('cart')
        .deleteCartItemByUserIdAndProductId(userId, productId);
    });
  }

  clearCart() {
    return this.getUserId().andThen((userId) => {
      return this.rm.get('cart').deleteCartItemsByUserId(userId);
    });
  }
}

export default CartService;
