import type AuthError from "../error/AuthError";
import type BadRequestError from "../error/BadRequestError";
import type ServerError from "../error/ServerError";
import type ValidationError from "../error/ValidationError";
import type DummyJsonClientError from "../client/DummyJsonClient/errors/DummyJsonClientError";
import type NotFoundError from "../error/NotFoundError";

type SupportedError =
  | ServerError
  | ValidationError
  | BadRequestError
  | AuthError
  | DummyJsonClientError
  | NotFoundError;

class OutputService {
  protected logError(error: SupportedError) {
    console.error(JSON.stringify(error));
  }

  handleSuccess(result: object) {
    console.log(result);

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  }

  handleError(error: SupportedError) {
    this.logError(error);

    switch (error.type) {
      case "ServerError":
        return {
          statusCode: 500,
          body: "Something went wrong.",
        };
      case "ValidationError":
        return {
          statusCode: 400,
          body: JSON.stringify(error.zodError),
        };
      case "BadRequestError":
        return {
          statusCode: 400,
          body: error.message,
        };
      case "AuthError":
        return {
          statusCode: 401,
          body: error.message,
        };
      case "DummyJsonClientError":
        return {
          statusCode: 500,
          body: "Something went wrong.",
        };
      case "NotFoundError":
        return {
          statusCode: 404,
          body: error.message,
        };
    }
  }
}

export default OutputService;
