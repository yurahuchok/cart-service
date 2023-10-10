import { type ZodError } from "zod";
import BaseError from "./BaseError";

class ValidationError extends BaseError<"ValidationError"> {
  readonly type = "ValidationError";

  constructor(readonly zodError: ZodError) {
    super(zodError.message);
  }
}

export default ValidationError;
