import * as aws from "@pulumi/aws";
import {
  type APIGatewayAuthorizerWithContextResult,
  type APIGatewayRequestAuthorizerEvent,
} from "aws-lambda";
import container from "../bootstrap";
import LoginService, { type LoginUser } from "../service/LoginService";

export default new aws.lambda.CallbackFunction<
  APIGatewayRequestAuthorizerEvent,
  APIGatewayAuthorizerWithContextResult<LoginUser>
>("authorizer", {
  callback: async (event, _) => {
    return await container
      .get(LoginService)
      .authenticateWithToken(event.headers?.Authorization ?? "")
      .match(
        (loginUser) => ({
          principalId: loginUser.id,
          context: loginUser,
          policyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Action: "execute-api:Invoke",
                Effect: "Allow",
                Resource: event.methodArn,
              },
            ],
          },
        }),
        (_) => {
          throw new Error("Unauthorized");
        },
      );
  },
});
