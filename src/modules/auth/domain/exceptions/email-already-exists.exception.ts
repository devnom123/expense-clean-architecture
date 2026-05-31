export class EmailAlreadyExistsException extends Error {
  constructor() {
    super('Email with this address is already registered');
    this.name = 'EmailAlreadyExistsException';
  }
}
