export abstract class ApplicationError extends Error {
  constructor(public readonly message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class NotFoundError extends ApplicationError {
  constructor(message: string = 'Resource not found') {
    super(message);
  }
}

export class ConflictError extends ApplicationError {
  constructor(message: string = 'Conflict occurred') {
    super(message);
  }
}

export class UnauthorizedError extends ApplicationError {
  constructor(message: string = 'Unauthorized access') {
    super(message);
  }
}

export class ForbiddenError extends ApplicationError {
  constructor(message: string = 'Forbidden access') {
    super(message);
  }
}

export class BadRequestError extends ApplicationError {
  constructor(message: string = 'Bad request') {
    super(message);
  }
}
