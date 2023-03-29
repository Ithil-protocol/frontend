export class ErrorCause {
  constructor(public readonly message: string, public readonly code?: number, public readonly data?: unknown) {}

  static isErrorCause(obj: unknown): obj is ErrorCause {
    return obj instanceof ErrorCause
  }
}
