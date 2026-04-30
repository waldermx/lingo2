/**
 * @file src/shared/Result.ts
 * @description Functional Result<T, E> type for explicit error handling without exceptions.
 *
 * Pattern: Railway-oriented programming.
 * Instead of throwing errors across layers, use cases return Result<T, DomainError>
 * and the HTTP layer translates them to proper HTTP status codes.
 *
 * @example
 * ```ts
 * function divide(a: number, b: number): Result<number, DomainError> {
 *   if (b === 0) return Result.fail(new DomainError('DIVISION_BY_ZERO', 'Cannot divide by zero'));
 *   return Result.ok(a / b);
 * }
 *
 * const result = divide(10, 2);
 * if (result.isOk()) {
 *   console.log(result.value); // 5
 * }
 * ```
 */
export class Result<T, E extends Error = Error> {
  private constructor(
    private readonly _isOk: boolean,
    private readonly _value?: T,
    private readonly _error?: E,
  ) {}

  /** Create a successful result carrying a value. */
  static ok<T>(value: T): Result<T, never> {
    return new Result<T, never>(true, value);
  }

  /** Create a failed result carrying an error. */
  static fail<E extends Error>(error: E): Result<never, E> {
    return new Result<never, E>(false, undefined, error);
  }

  get isOk(): boolean {
    return this._isOk;
  }

  get isFail(): boolean {
    return !this._isOk;
  }

  /** The success value. Throws if the result is a failure. */
  get value(): T {
    if (!this._isOk || this._value === undefined) {
      throw new Error('Cannot access value of a failed Result. Check isOk first.');
    }
    return this._value;
  }

  /** The error. Throws if the result is a success. */
  get error(): E {
    if (this._isOk || this._error === undefined) {
      throw new Error('Cannot access error of a successful Result. Check isFail first.');
    }
    return this._error;
  }

  /**
   * Transform the value if successful, propagating failure unchanged.
   * @example result.map(n => n * 2)
   */
  map<U>(fn: (value: T) => U): Result<U, E> {
    if (this._isOk && this._value !== undefined) {
      return Result.ok(fn(this._value));
    }
    return Result.fail(this._error as E);
  }
}
