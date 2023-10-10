import { combine, err, okAsync } from "neverthrow";
import type LoginService from "./LoginService";
import AuthError from "../error/AuthError";
import CartRepository from "../repository/CartRepository";
import ProductRepository from "../repository/ProductRepository";

class CartService {
  constructor(
    protected cartRepository: CartRepository,
    protected productRepository: ProductRepository,
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
    return this.productRepository.getProductById(productId);
  }

  getCartItems() {
    return this.getUserId().andThen((userId) => {
      return this.cartRepository.getCartItemsByUserId(userId);
    });
  }

  upsertProductToCart(productId: string, quantity: number) {
    return combine([
      this.getUserId(),
      this.getProductById(productId),
    ] as const).andThen(([userId]) => {
      return this.cartRepository
        .addOrUpdateCartItemByUserIdAndProductId(userId, productId, {
          Count: quantity,
        });
    });
  }

  removeProductFromCart(productId: string) {
    return this.getUserId().andThen((userId) => {
      return this.cartRepository
        .deleteCartItemByUserIdAndProductId(userId, productId);
    });
  }

  clearCart() {
    return this.getUserId().andThen((userId) => {
      return this.cartRepository.deleteCartItemsByUserId(userId);
    });
  }
}

export default CartService;
