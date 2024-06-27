/**
 * @file Defines the main router.
 * @module router
 * @author Mats Loock
 */

// User-land modules.
import express from 'express'

// Application modules.
import { HttpError } from '../lib/errors/HttpError.js'
import { router as v1Router } from './api/v1/router.js'

export const router = express.Router()

router.use('/api/v1', v1Router)

// Catch 404 (ALWAYS keep this as the last route).
router.use('*', (req, res, next) => {
  next(new HttpError({
    message: 'The requested resource was not found.',
    status: 404,
    data: { url: req.originalUrl }
  }))
})
