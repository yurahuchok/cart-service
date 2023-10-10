import BaseError from "./BaseError";

class NotFoundError extends BaseError<"NotFoundError"> {
  readonly type = "NotFoundError";
}

export default NotFoundError;
