import BaseError from "./BaseError";

class AuthError extends BaseError<"AuthError"> {
  readonly type = "AuthError";
}

export default AuthError;
