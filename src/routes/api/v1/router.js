// User-land modules.
import express from 'express'

// Application modules.
import { router as netflixRouter } from './netflixRouter.js'
import { router as chartRouter } from './chartRouter.js'
export const router = express.Router()

router.get('/', (req, res) => res.json({ message: 'Hooray! Welcome to version 1 of this very simple RESTful API!' }))
router.use('/netflix', netflixRouter)
router.use('/wt2', chartRouter)
