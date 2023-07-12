export class AppError extends Error {
  constructor(message = '', ...args: any) {
    super(message, ...args)
  }
}
