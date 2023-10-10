import * as aws from "@pulumi/aws";
import {
  type APIGatewayProxyEvent,
  type APIGatewayProxyResult,
} from "aws-lambda";
import { okAsync } from "neverthrow";
import OutputService from "../service/OutputService";
import container from "../bootstrap";
import ProductService from "../service/ProductService";

export default new aws.lambda.CallbackFunction<
  APIGatewayProxyEvent,
  APIGatewayProxyResult
>("products", {
  callback: async (event, _) => {
    return await okAsync(event)
      .andThen(() => container.get(ProductService).getProducts())
      .match(
        (products) => container.get(OutputService).handleSuccess(products),
        (_) => container.get(OutputService).handleError(_),
      );
  },
});
