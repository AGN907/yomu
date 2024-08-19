export class PublicError extends Error {}

export class AuthenticationError extends PublicError {
  constructor() {
    super('You must be logged in to view this content')
    this.name = 'AuthenticationError'
  }
}

export class AuthorizationError extends PublicError {
  constructor() {
    super("You don't have permission to perform this action")
    this.name = 'AuthorizationError'
  }
}
