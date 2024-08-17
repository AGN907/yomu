export class PublicError extends Error {}

export class AuthenticationError extends PublicError {
  constructor() {
    super('You must be logged in to view this action')
    this.name = 'AuthenticationError'
  }
}
