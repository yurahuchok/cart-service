import * as aws from "@pulumi/aws";
import {
  type APIGatewayProxyEvent,
  type APIGatewayProxyResult,
} from "aws-lambda";
import { okAsync } from "neverthrow";
import InputService from "../service/InputService";
import OutputService from "../service/OutputService";
import container from "../bootstrap";
import getLoginValidator from "../request/LoginRequest";
import LoginService from "../service/LoginService";

export default new aws.lambda.CallbackFunction<
  APIGatewayProxyEvent,
  APIGatewayProxyResult
>("login", {
  callback: async (event, _) => {
    return await okAsync(event)
      .andThen((event) =>
        container.get(InputService).validateInput(event, getLoginValidator()),
      )
      .andThen((input) =>
        container.get(LoginService).generateToken(input.login, input.password),
      )
      .match(
        (token) =>
          container
            .get(OutputService)
            .handleSuccess({ message: "Login successful.", token }),
        (_) => container.get(OutputService).handleError(_),
      );
  },
});
