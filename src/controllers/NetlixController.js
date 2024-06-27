// Application modules.
import { NotModifiedError } from '../lib/errors/NotModifiedError.js'
import { convertToHttpError } from '../lib/util.js'
import { NetflixService } from '../services/NetflixService.js'
import { logger } from '../config/winston.js'

/**
 * Encapsulates a controller.
 */
export class NetflixController {
  /**
   * The service.
   *
   * @type {NetflixService}
   */
  #netflixService

  /**
   * Initializes a new instance.
   *
   * @param {NetflixService} neflixService - A Netflix service.
   */
  constructor (neflixService) {
    logger.silly('NetflixController constructor')
    this.#netflixService = neflixService
  }

  /**
   * Provide req.doc to the route if :id is present.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @param {string} id - The value of the id for the task to load.
   */
  async loadTaskDocument (req, res, next, id) {
    try {
      req.doc = await this.#netflixService.getById(id)
      next()
    } catch (error) {
      next(convertToHttpError(error))
    }
  }

  /**
   * Sends a JSON response containing a Country and all movies and tvshows.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async findCountryAndAllMoviesAndTvShow (req, res, next) {
    try {
      const allData = await this.#netflixService.getCountryAndAllMoviesAndTvShow(req.params.country)
      // Send the response.
      if (allData.length > 0) {
        res.json(allData)
      } else {
        res.status(204).end() // No Content
      }
    } catch (error) {
      next(convertToHttpError(error))
    }
  }

  /**
   * Sends a JSON response containing a task.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async find (req, res, next) {
    try {
      res.json(req.doc)
    } catch (error) {
      next(convertToHttpError(error))
    }
  }

  /**
   * Sends a JSON response containing all ratings.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async findAllRating (req, res, next) {
    try {
      const allData = await this.#netflixService.getAllRating(req.params.country)
      // Send the response.
      if (allData.length > 0) {
        res.json(allData)
      } else {
        res.status(204).end() // No Content
      }
    } catch (error) {
      next(convertToHttpError(error))
    }
  }

  /**
   * Sends a JSON response containing all countrys.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async findAllCountry (req, res, next) {
    try {
      const allData = await this.#netflixService.getCountry()
       // Konvertera data till en array av unika länder.
      const uniqueCountries = Array.from(
        new Set(
          allData
            .map(countryString => countryString.split(',')) // Dela upp landsträngarna vid kommatecken.
            .flat() // Platta ut inre arrayer till en enda array.
            .map(country => country.trim()) // Ta bort eventuella mellanslag runt varje landsträng.
        )
      ).filter(country => country !== '') // Filtrera bort tomma landsträngar.

      // Sortera de unika länderna i alfabetisk ordning.
      uniqueCountries.sort((a, b) => a.localeCompare(b))
      // Send the response.
      if (uniqueCountries.length > 0) {
        res.json(uniqueCountries)
      } else {
        res.status(204).end() // No Content
      }
    } catch (error) {
      next(convertToHttpError(error))
    }
  }

  /**
   * Creates a new task.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async create (req, res, next) {
    try {
      const taskDocument = await this.#netflixService.insert(req.body)

      const location = new URL(
        `${req.protocol}://${req.get('host')}${req.baseUrl}/${taskDocument.id}`
      )

      res
        .location(location.href)
        .status(201) // Created
        .json(taskDocument)
    } catch (error) {
      next(convertToHttpError(error))
    }
  }

  /**
   * Replaces a specific task.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async replace (req, res, next) {
    this.#updateOrReplace(req, res, next, true)
  }

  /**
   * Updates a specific task.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async update (req, res, next) {
    this.#updateOrReplace(req, res, next, false)
  }

  /**
   * Deletes the specified task.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async delete (req, res, next) {
    try {
      await this.#netflixService.delete(req.doc, req.body)

      res
        .status(204) // No Content
        .end()
    } catch (error) {
      next(convertToHttpError(error))
    }
  }

  /**
   * Sets the pagination headers.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {object} pagination - The pagination data.
   * @param {number} pagination.totalCount - The total number of documents.
   * @param {number} pagination.page - The current page.
   * @param {number} pagination.perPage - The number of documents per page.
   * @param {number} pagination.totalPages - The total number of pages.
   */
  #setPaginationHeaders (req, res, { totalCount, page, perPage, totalPages }) {
    // Set pagination headers.
    res.set('X-Total-Count', totalCount)
    res.set('X-Page', page)
    res.set('X-Per-Page', perPage)
    res.set('X-Total-Pages', totalPages)

    // Generate and set link header.
    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`
    let linkHeader = ''

    // Next page.
    if (page < totalPages) {
      linkHeader += `<${baseUrl}?page=${page + 1}&per_page=${perPage}>; rel="next", `
    }

    // Previous page.
    if (page > 1) {
      linkHeader += `<${baseUrl}?page=${page - 1}&per_page=${perPage}>; rel="prev", `
    }

    // First and last page.
    linkHeader += `<${baseUrl}?page=1&per_page=${perPage}>; rel="first", `
    linkHeader += `<${baseUrl}?page=${totalPages}&per_page=${perPage}>; rel="last"`

    res.set('Link', linkHeader)
  }

  /**
   * Updates, or replaces, a specific task.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @param {boolean} replace - If true, the document will be replaced, otherwise it will be partially updated.
   */
  async #updateOrReplace (req, res, next, replace) {
    try {
      // Update, or replace, the document.
      const savedDoc = await this.#netflixService.updateOrReplace(
        req.doc,
        req.body,
        replace
      )

      res.json(savedDoc)
    } catch (error) {
      if (error instanceof NotModifiedError) {
        // Not an actual error, just signal the resource was not modified.
        res
          .status(304) // Not Modified
          .end()
      } else {
        next(convertToHttpError(error))
      }
    }
  }
}
