// User-land modules.
import express from 'express'

// Application modules.
import { container, NETFLIXTYPES } from '../../../config/inversify.config.js'

export const router = express.Router()

// Provide req.doc to the route if :id is present in the route path.
router.param('id', (req, res, next, id) =>
  container.get(NETFLIXTYPES.NetflixController).loadTaskDocument(req, res, next, id))

// GET/POST tasks
router.route('/country')
  .get((req, res, next) => container.get(NETFLIXTYPES.NetflixController).findAllCountry(req, res, next))

router.route('/rating/:country')
  .post((req, res, next) => container.get(NETFLIXTYPES.NetflixController).findAllRating(req, res, next))

router.route('/country/:country')
  .post((req, res, next) => container.get(NETFLIXTYPES.NetflixController).findCountryAndAllMoviesAndTvShow(req, res, next))

// GET/PUT/PATCH/DELETE tasks/:id
router.route('/:id')
  .get((req, res, next) => container.get(NETFLIXTYPES.NetflixController).find(req, res, next))
  .put((req, res, next) => container.get(NETFLIXTYPES.NetflixController).replace(req, res, next))
  .patch((req, res, next) => container.get(NETFLIXTYPES.NetflixController).update(req, res, next))
  .delete((req, res, next) => container.get(NETFLIXTYPES.NetflixController).delete(req, res, next))
