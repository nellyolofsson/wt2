// User-land modules.
import express from 'express'
import { container, CHARTTYPES } from '../../../config/inversify.config.js'

export const router = express.Router()

// Map HTTP verbs and route paths to controller action methods.
router.route('/')
  .get((req, res, next) => container.get(CHARTTYPES.ChartController).index(req, res, next))
