// Application modules.
import { MongooseServiceBase } from './MongooseServiceBase.js'

/**
 * Encapsulates a task service.
 */
export class NetflixService extends MongooseServiceBase {
  /**
   * Gets all documents for a specific country and rating.
   *
   * @param {string} country - The country of the document to get.
   * @returns {Promise<object>} Promise resolved with all documents.
   */
  async getAllRating (country) {
    try {
      const repositories = this.getRepository()
      return await repositories.getAllDocumentsForCountryAndRating(country)
    } catch (error) {
      this.getHandleError(error, 'Failed to get documents.')
    }
  }

  /**
   * Gets all documents for a specific country.
   *
   * @param {string} country - The country of the document to get.
   * @returns {Promise<object>} Promise resolved with all documents.
   */
  async getCountryAndAllMoviesAndTvShow (country) {
    try {
      const repositories = this.getRepository()
      return await repositories.getCountryAndAllMoviesAndTvShow(country)
    } catch (error) {
      this.getHandleError(error, 'Failed to get documents.')
    }
  }

  /**
   * Gets all unique countries.
   *
   * @returns {Promise<object>} Promise resolved with all unique countries.
   */
  async getCountry () {
    try {
      const repositories = this.getRepository()
      return await repositories.getCountry()
    } catch (error) {
      this.getHandleError(error, 'Failed to get documents.')
    }
  }
}
