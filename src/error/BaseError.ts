abstract class BaseError<T> {
  abstract readonly type: T;

  constructor(
    readonly message: string,
    readonly internal?: unknown | undefined,
  ) {}
}

export default BaseError;
