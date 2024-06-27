// Application modules.
import { MongooseRepositoryBase } from './MongooseRepositoryBase.js'
import { RepositoryError } from '../lib/errors/RepositoryError.js'

/**
 * Encapsulates a task repository.
 */
export class NetflixRepository extends MongooseRepositoryBase {
  /**
   * Gets all unique countries.
   *
   * @returns {Promise<object>} Promise resolved with all unique countries.
   */
  async getCountry () {
    try {
      const uniqueCountries = await this.model.distinct('country').exec()
      return uniqueCountries
    } catch (error) {
      throw new RepositoryError({ message: 'Failed to get documents.', cause: error })
    }
  }

  /**
   * Gets documents for a specific country and all tvshows and all moives.
   *
   * @param {string} country - The country of the documents to get.
   * @returns {Promise<object>} Promise resolved with all documents.
   */
  async getCountryAndAllMoviesAndTvShow (country) {
    try {
      const pipeline = []
      // Dela upp strängen i country-fältet och skapa ett dokument för varje individuellt land
      pipeline.push(
        { $match: { country: { $regex: new RegExp(`\\b${country}\\b`, 'i') } } }, // Match documents with the queried country
        { $addFields: { countries: { $split: ['$country', ', '] } } }, // Split the countries field
        { $unwind: '$countries' }, // Unwind the array of countries
        { $match: { countries: country } } // Match documents with the queried country
      )
      // Gruppera medie efter typ (title och type) och räkna antalet filmer och tv-program av varje typ
      pipeline.push({
        $group: {
          _id: { country: '$countries', type: '$type' },
          mediaCount: { $sum: 1 }
        }
      })

      // Gruppera resultaten efter land och skapa en lista över medie av varje typ
      pipeline.push({
        $group: {
          _id: '$_id.country',
          mediaTypes: {
            $push: {
              type: '$_id.type',
              count: '$mediaCount',
              media: '$media'
            }
          }
        }
      })
      const documents = await this.model.collection.aggregate(pipeline).toArray()
      return documents
    } catch (error) {
      throw new RepositoryError({ message: 'Failed to get documents.', cause: error })
    }
  }

  // $addFields: Detta steg delar upp strängen i country-fältet i enskilda länder och lägger till detta som ett nytt fält countries i dokumenten.

  // $unwind: Detta steg "vecklar ut" det nya countries-fältet så att varje dokument representerar ett enskilt land. Detta gör det möjligt att matcha varje land separat i nästa steg.

  // $match: Här matchas varje dokument baserat på det specifika landet som du söker efter.

  // $group: Slutligen grupperas dokumenten baserat på land och för varje grupp skapas en lista med titlar för media som tillhör det landet.

  /**
   * Gets all documents for a specific country and rating type (TV Show or Movie).
   *
   * @param {string} country - The country of the documents to get ratings for.
   * @returns {Promise<object>} Promise resolved with all documents.
   */
  async getAllDocumentsForCountryAndRating (country) {
    try {
      const pipeline = []
      // Split the countries into separate documents
      pipeline.push(
        { $match: { country: { $regex: new RegExp(`\\b${country}\\b`, 'i') } } }, // Match documents with the queried country
        { $addFields: { countries: { $split: ['$country', ', '] } } }, // Split the countries field
        { $unwind: '$countries' }, // Unwind the array of countries
        { $match: { countries: country } } // Match documents with the queried country
      )
      // Group the ratings data by type and rating
      pipeline.push(
        { $group: { _id: { type: '$type', rating: '$rating' }, count: { $sum: 1 } } },
        { $sort: { '_id.type': 1, '_id.rating': 1 } }
      )
      const documents = await this.model.collection.aggregate(pipeline).toArray()
      return documents
    } catch (error) {
      throw new RepositoryError({ message: 'Failed to get documents.', cause: error })
    }
  }
}
