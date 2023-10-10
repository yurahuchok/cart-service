import BaseError from "./BaseError";

class ServerError extends BaseError<"ServerError"> {
  readonly type = "ServerError";
}

export default ServerError;
