import { type APIGatewayProxyWithLambdaAuthorizerEvent } from "aws-lambda";
import type DummyJsonClient from "../client/DummyJsonClient/client";
import { ok } from "neverthrow";

export type LoginUser = {
  id: string;
  username: string;
  email: string;
};

class LoginService {
  protected authenticated: LoginUser | null = null;

  constructor(protected client: DummyJsonClient) {}

  protected setAuthenticated(user: LoginUser) {
    this.authenticated = user;
    return this.authenticated;
  }

  getAuthenticated() {
    return this.authenticated;
  }

  generateToken(username: string, password: string) {
    return this.client
      .login(username, password)
      .map((loginResponse) => loginResponse.token);
  }

  authenticateWithLoginUser(user: LoginUser) {
    return ok(this.setAuthenticated(user));
  }

  authenticateWithEvent(
    event: APIGatewayProxyWithLambdaAuthorizerEvent<LoginUser>,
  ) {
    return ok(this.setAuthenticated(event.requestContext.authorizer));
  }

  authenticateWithToken(token: string) {
    return this.client.validateAndDecodeToken(token).map((clientUser) =>
      this.setAuthenticated({
        id: clientUser.id.toString(),
        username: clientUser.username,
        email: clientUser.email,
      }),
    );
  }
}

export default LoginService;
