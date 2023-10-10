import BaseError from "../../../error/BaseError";

class DummyJsonClientError extends BaseError<"DummyJsonClientError"> {
  readonly type = "DummyJsonClientError";
}

export default DummyJsonClientError;
