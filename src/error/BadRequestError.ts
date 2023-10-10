import BaseError from "./BaseError";

class BadRequestError extends BaseError<"BadRequestError"> {
  readonly type = "BadRequestError";
}

export default BadRequestError;
