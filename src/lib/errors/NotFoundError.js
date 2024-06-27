/**
 * @file This file defines the NotFoundError class.
 * @module NotFoundError
 * @author Mats Loock <mats.loock@lnu.se>
 */

import { ApplicationError } from './ApplicationError.js'

/**
 * Represents a not found error.
 *
 * @class NotFoundError
 */
export class NotFoundError extends ApplicationError {
  /**
   * Creates an instance of NotFoundError.
   *
   * @param {object} options - An object that has the following properties:
   * @param {string} options.message - A human-readable description of the error.
   * @param {Error} options.cause - A value indicating the specific cause of the error.
   * @param {object} options.data - Custom debugging information.
   */
  constructor ({ message = 'The data could not be found.', ...options } = {}) {
    super({ message, ...options })
  }
}
