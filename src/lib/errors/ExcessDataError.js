/**
 * @file This file defines the ExcessDataError class.
 * @module ExcessDataError
 * @author Mats Loock <mats.loock@lnu.se>
 */

import { ApplicationError } from './ApplicationError.js'

/**
 * Represents an excess data error.
 *
 * @class ExcessDataError
 */
export class ExcessDataError extends ApplicationError {
  /**
   * Creates an instance of ExcessDataError.
   *
   * @param {object} options - An object that has the following properties:
   * @param {string} options.message - A human-readable description of the error.
   * @param {Error} options.cause - A value indicating the specific cause of the error.
   * @param {object} options.data - Custom debugging information.
   */
  constructor ({ message = 'Too much data provided.', ...options } = {}) {
    super({ message, ...options })
  }
}
