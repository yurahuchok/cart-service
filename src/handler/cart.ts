import * as aws from "@pulumi/aws";
import { okAsync } from "neverthrow";
import OutputService from "../service/OutputService";
import CartService from "../service/CartService";
import container from "../bootstrap";
import InputService from "../service/InputService";
import getUpsertProductToCartValidator from "../request/UpsertProductToCartRequest";
import getRemoveProductFromCartValidator from "../request/RemoveProductFromCartRequest";
import LoginService, { type LoginUser } from "../service/LoginService";
import {
  type APIGatewayProxyResult,
  type APIGatewayProxyWithLambdaAuthorizerEvent,
} from "aws-lambda";

export const getCartItems = new aws.lambda.CallbackFunction<
  APIGatewayProxyWithLambdaAuthorizerEvent<LoginUser>,
  APIGatewayProxyResult
>("get-cart-items", {
  callback: async (event, _) => {
    return await okAsync(event)
      .andThen((event) =>
        container
          .get(LoginService)
          .authenticateWithEvent(event)
          .map(() => event),
      )
      .andThen(() => container.get(CartService).getCartItems())
      .match(
        (items) => container.get(OutputService).handleSuccess(items),
        (_) => container.get(OutputService).handleError(_),
      );
  },
});

export const upsertProductToCart = new aws.lambda.CallbackFunction<
  APIGatewayProxyWithLambdaAuthorizerEvent<LoginUser>,
  APIGatewayProxyResult
>("upsert-product-to-cart", {
  callback: async (event, _) => {
    return await okAsync(event)
      .andThen((event) =>
        container
          .get(LoginService)
          .authenticateWithEvent(event)
          .map(() => event),
      )
      .andThen((event) =>
        container
          .get(InputService)
          .validateInput(event, getUpsertProductToCartValidator()),
      )
      .andThen((input) =>
        container
          .get(CartService)
          .upsertProductToCart(input.productId, input.quantity),
      )
      .andThen(() => container.get(CartService).getCartItems())
      .match(
        (items) => container.get(OutputService).handleSuccess(items),
        (_) => container.get(OutputService).handleError(_),
      );
  },
});

export const removeProductFromCart = new aws.lambda.CallbackFunction<
  APIGatewayProxyWithLambdaAuthorizerEvent<LoginUser>,
  APIGatewayProxyResult
>("remove-product-from-cart", {
  callback: async (event, _) => {
    return await okAsync(event)
      .andThen((event) =>
        container
          .get(LoginService)
          .authenticateWithEvent(event)
          .map(() => event),
      )
      .andThen((event) =>
        container
          .get(InputService)
          .validateInput(event, getRemoveProductFromCartValidator()),
      )
      .andThen((input) =>
        container.get(CartService).removeProductFromCart(input.productId),
      )
      .andThen(() => container.get(CartService).getCartItems())
      .match(
        (items) => container.get(OutputService).handleSuccess(items),
        (_) => container.get(OutputService).handleError(_),
      );
  },
});

export const clearCart = new aws.lambda.CallbackFunction<
  APIGatewayProxyWithLambdaAuthorizerEvent<LoginUser>,
  APIGatewayProxyResult
>("clear-cart", {
  callback: async (event, _) => {
    return await okAsync(event)
      .andThen((event) =>
        container
          .get(LoginService)
          .authenticateWithEvent(event)
          .map(() => event),
      )
      .andThen(() => container.get(CartService).clearCart())
      .andThen(() => container.get(CartService).getCartItems())
      .match(
        (items) => container.get(OutputService).handleSuccess(items),
        (_) => container.get(OutputService).handleError(_),
      );
  },
});
