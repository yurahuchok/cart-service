import * as aws from "@pulumi/aws";
import {
  type APIGatewayProxyResult,
  type APIGatewayProxyWithLambdaAuthorizerEvent,
} from "aws-lambda";
import { okAsync } from "neverthrow";
import container from "../bootstrap";
import OutputService from "../service/OutputService";
import LoginService, { type LoginUser } from "../service/LoginService";

export default new aws.lambda.CallbackFunction<
  APIGatewayProxyWithLambdaAuthorizerEvent<LoginUser>,
  APIGatewayProxyResult
>("me", {
  callback: async (event, _) => {
    return await okAsync(event)
      .andThen((event) =>
        container.get(LoginService).authenticateWithEvent(event),
      )
      .match(
        (user) => container.get(OutputService).handleSuccess(user),
        (_) => container.get(OutputService).handleError(_),
      );
  },
});
