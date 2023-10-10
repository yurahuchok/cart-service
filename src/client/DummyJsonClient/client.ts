import {
  type ResultAsync,
  err,
  fromPromise,
  fromThrowable,
  ok,
  okAsync,
  errAsync,
} from "neverthrow";
import ClientError from "./errors/DummyJsonClientError";
import AuthError from "../../error/AuthError";
import fetch from "node-fetch";
import jwtDecode from "jwt-decode";
import {
  type ClientLoginResponse,
  type ClientProduct,
  type ClientUser,
} from "./types";
import {
  isClientLoginResponse,
  isClientProduct,
  isClientProducts,
  isClientUser,
} from "./guards";
import NotFoundError from "../../error/NotFoundError";

class DummyJsonClient {
  constructor(protected baseUrl: string) {}

  products(): ResultAsync<ClientProduct[], ClientError> {
    return okAsync({})
      .andThen(() => {
        return fromPromise(
          fetch(`${this.baseUrl}/products`, { method: "GET" }),
          (e) =>
            new ClientError("Client products fetch request failure.", { e }),
        );
      })
      .andThen((response) => {
        return fromPromise(
          response.json(),
          (e) =>
            new ClientError(
              "Client products fetch response json parse failure.",
              e,
            ),
        );
      })
      .andThen((response) => {
        if (!("products" in response) || !Array.isArray(response.products)) {
          return err(
            new ClientError("Unexpected format in products fetch response."),
          );
        }

        const products = response.products;
        if (!isClientProducts(products)) {
          return err(
            new ClientError(
              "Unexpected product entity format in products fetch response.",
            ),
          );
        }

        return ok(products);
      });
  }

  product(id: string): ResultAsync<ClientProduct, ClientError | NotFoundError> {
    return okAsync({})
      .andThen(() => {
        return fromPromise(
          fetch(`${this.baseUrl}/products/${id}`, { method: "GET" }),
          (e) =>
            new ClientError("Client product fetch request failure.", { e }),
        );
      })
      .andThen((response) => {
        if (response.status === 404) {
          return errAsync(new NotFoundError("Product not found."));
        } else if (response.status !== 200) {
          return errAsync(
            new ClientError("Unexpected client response status."),
          );
        }

        return fromPromise(
          response.json(),
          (e) =>
            new ClientError(
              "Client product fetch response json parse failure.",
              e,
            ),
        );
      })
      .andThen((response) => {
        const product = response;
        if (!isClientProduct(product)) {
          return err(
            new ClientError(
              "Unexpected product entity format in products fetch response.",
            ),
          );
        }

        return ok(product);
      });
  }

  login(
    username: string,
    password: string,
  ): ResultAsync<ClientLoginResponse, ClientError | AuthError> {
    return okAsync({})
      .andThen(() => {
        return fromPromise(
          fetch(`${this.baseUrl}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username,
              password,
            }),
          }),
          (e) => new ClientError("Login fetch request failure.", e),
        );
      })
      .andThen((response) => {
        if (response.status === 200) {
          return ok(response);
        }

        return err(new AuthError("Invalid credentials."));
      })
      .andThen((response) => {
        return fromPromise(
          response.json(),
          (e) => new ClientError("Login response json parse failure.", e),
        );
      })
      .andThen((json) => {
        if (!isClientLoginResponse(json)) {
          return err(new ClientError("Unexpected format in login response."));
        }

        return ok(json);
      });
  }

  decodeToken(token: string): ResultAsync<ClientUser, AuthError> {
    return okAsync({})
      .andThen(() => {
        return fromThrowable(
          () => {
            const decoded = jwtDecode(token);
            if (!(typeof decoded === "object")) {
              throw new Error("Invalid token.");
            }

            return decoded ?? {};
          },
          (_) => new AuthError("Invalid token."),
        )();
      })
      .andThen((clientUser) => {
        if (!isClientUser(clientUser)) {
          return err(new AuthError("Invalid token format."));
        }

        return ok(clientUser);
      });
  }

  validateToken(token: string): ResultAsync<undefined, AuthError> {
    return okAsync({}).andThen(() => {
      return fromPromise(
        fetch(`${this.baseUrl}/auth`, {
          method: "GET",
          headers: { Authorization: token },
        }),
        (_) => new AuthError("Authentication request failure."),
      ).andThen((response) => {
        if (response.status === 200) {
          return ok(undefined);
        }

        return err(new AuthError("Unauthorized."));
      });
    });
  }

  validateAndDecodeToken(token: string): ResultAsync<ClientUser, AuthError> {
    return this.validateToken(token).andThen(() => this.decodeToken(token));
  }
}

export default DummyJsonClient;
