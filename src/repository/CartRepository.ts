import { type ResultAsync, fromPromise, ok } from "neverthrow";
import * as sdk from "aws-sdk";
import { cartTable } from "../../index";
import ServerError from "../error/ServerError";

export interface CartItem {
  UserId: string;
  ProductId: string;
  Count: number;
}

class CartRepository {
  protected table = cartTable;

  protected documentClient = new sdk.DynamoDB.DocumentClient();

  getCartItemByUserIdAndProductId(
    userId: string,
    productId: string,
  ): ResultAsync<CartItem | null, ServerError> {
    return fromPromise(
      this.documentClient
        .get({
          TableName: this.table.name.get(),
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
          TableName: this.table.name.get(),
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
          TableName: this.table.name.get(),
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
          TableName: this.table.name.get(),
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
          TableName: this.table.name.get(),
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
