import { type ResultAsync, fromPromise, ok } from "neverthrow";
import * as sdk from "aws-sdk";
import ServerError from "../error/ServerError";
import { cartTableName } from "../..";

export interface CartItem {
  UserId: string;
  ProductId: string;
  Count: number;
}

class CartRepository {
  protected documentClient = new sdk.DynamoDB.DocumentClient();

  protected cartTableName = cartTableName;

  getCartItemByUserIdAndProductId(
    userId: string,
    productId: string,
  ): ResultAsync<CartItem | null, ServerError> {
    return fromPromise(
      this.documentClient
        .get({
          TableName: this.cartTableName.get(),
          Key: {
            UserId: userId,
            ProductId: productId,
          },
        })
        .promise(),
      (e) => {
        return new ServerError("Failed to connect to database", e);
      },
    ).andThen((result) => {
      return ok(result.Item !== undefined ? (result.Item as CartItem) : null);
    });
  }

  getCartItemsByUserId(userId: string): ResultAsync<CartItem[], ServerError> {
    return fromPromise(
      this.documentClient
        .query({
          TableName: this.cartTableName.get(),
          KeyConditionExpression: "UserId = :userId",
          ExpressionAttributeValues: {
            ":userId": userId,
          },
        })
        .promise(),
      (e) => {
        return new ServerError("Failed to connect to database", e);
      },
    ).andThen((result) => {
      return ok((result.Items ?? []) as CartItem[]);
    });
  }

  addOrUpdateCartItemByUserIdAndProductId(
    userId: string,
    productId: string,
    data: Omit<CartItem, "UserId" | "ProductId">,
  ) {
    return fromPromise(
      this.documentClient
        .update({
          TableName: this.cartTableName.get(),
          Key: {
            UserId: userId,
            ProductId: productId,
          },
          UpdateExpression: "SET #count = :count",
          ExpressionAttributeNames: {
            "#count": "Count",
          },
          ExpressionAttributeValues: {
            ":count": data.Count,
          },
          ReturnValues: "ALL_NEW",
        })
        .promise(),
      (e) => {
        return new ServerError("Failed to connect to database", e);
      },
    );
  }

  deleteCartItemsByUserId(userId: string) {
    return fromPromise(
      this.documentClient
        .delete({
          TableName: this.cartTableName.get(),
          Key: {
            UserId: userId,
          },
        })
        .promise(),
      (e) => {
        return new ServerError("Failed to connect to database", e);
      },
    );
  }

  deleteCartItemByUserIdAndProductId(userId: string, productId: string) {
    return fromPromise(
      this.documentClient
        .delete({
          TableName: this.cartTableName.get(),
          Key: {
            UserId: userId,
            ProductId: productId,
          },
        })
        .promise(),
      (e) => {
        return new ServerError("Failed to connect to database", e);
      },
    );
  }
}

export default CartRepository;
