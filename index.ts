import "reflect-metadata";
import * as apigateway from "@pulumi/aws-apigateway";
import login from "./src/handler/login";
import authorizer from "./src/handler/authorizer";
import me from "./src/handler/me";
import products from "./src/handler/products";
import * as cart from "./src/handler/cart";
import * as aws from "@pulumi/aws";

const cartTable = new aws.dynamodb.Table("cart-items", {
  attributes: [
    {
      name: "UserId",
      type: "S",
    },
    {
      name: "ProductId",
      type: "S",
    },
    {
      name: "Count",
      type: "N",
    },
  ],
  billingMode: "PROVISIONED",
  globalSecondaryIndexes: [
    {
      name: "Count",
      hashKey: "Count",
      projectionType: "INCLUDE",
      nonKeyAttributes: ["UserId", "ProductId"],
      writeCapacity: 10,
      readCapacity: 10,
    },
  ],
  hashKey: "UserId",
  rangeKey: "ProductId",
  readCapacity: 20,
  tags: {
    Environment: "dev",
    Name: "cart-table-1",
  },
  writeCapacity: 20,
});

export const cartTableName = cartTable.name;

const auth: apigateway.types.input.AuthorizerArgs = {
  authType: "custom",
  parameterName: "Authorization",
  type: "request",
  identitySource: ["method.request.header.Authorization"],
  handler: authorizer,
};

const restApi = new apigateway.RestAPI("api-gateway", {
  routes: [
    {
      path: "/login",
      method: "POST",
      eventHandler: login,
    },
    {
      path: "/me",
      method: "GET",
      eventHandler: me,
      authorizers: [auth],
    },
    {
      path: "/products",
      method: "GET",
      eventHandler: products,
    },
    {
      path: "/cart",
      method: "GET",
      eventHandler: cart.getCartItems,
      authorizers: [auth],
    },
    {
      path: "/cart/item",
      method: "PUT",
      eventHandler: cart.upsertProductToCart,
      authorizers: [auth],
    },
    {
      path: "/cart/item/{productId}",
      method: "DELETE",
      eventHandler: cart.removeProductFromCart,
      authorizers: [auth],
    },
    {
      path: "/cart",
      method: "DELETE",
      eventHandler: cart.clearCart,
      authorizers: [auth],
    },
  ],
});
