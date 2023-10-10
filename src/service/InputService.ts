import { type APIGatewayProxyEvent } from "aws-lambda";
import { combine, ok, err, fromThrowable, type Result } from "neverthrow";
import ValidationError from "../error/ValidationError";
import BadRequestError from "../error/BadRequestError";
import { type ZodType } from "zod";

class InputService {
  parseBody(event: APIGatewayProxyEvent): Result<any, BadRequestError> {
    return fromThrowable(
      () => {
        const bodyString = Buffer.from(event.body ?? "", "base64").toString("utf-8");
        const decoded = JSON.parse(bodyString !== '' ? bodyString : "{}");
        if (!(typeof decoded === "object" && decoded !== null)) {
          throw new Error("Invalid JSON");
        }
        return decoded;
      },
      (e) => new BadRequestError("Invalid JSON", e),
    )();
  }

  parseQuery(event: APIGatewayProxyEvent): Result<any, never> {
    return ok(event.pathParameters ?? {});
  }

  parseInput(event: APIGatewayProxyEvent): Result<any, BadRequestError> {
    return combine([
      this.parseBody(event),
      this.parseQuery(event),
    ] as const).map(([body, query]) => ({ ...body, ...query }));
  }

  validateInput<T>(
    event: APIGatewayProxyEvent,
    zObj: ZodType<T>,
  ): Result<T, BadRequestError | ValidationError> {
    return this.parseInput(event).andThen((input) => {
      const result = zObj.safeParse(input);
      return result.success
        ? ok(result.data)
        : err(new ValidationError(result.error));
    });
  }
}

export default InputService;
