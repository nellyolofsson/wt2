import mongoose from 'mongoose'

import { BASE_SCHEMA } from './baseSchema.js'

const NetflixSchema = new mongoose.Schema({
  show_id: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true,
    unique: true
  },
  director: {
    type: String
  },
  cast: {
    type: String
  },
  country: {
    type: String
  },
  date_added: {
    type: Date
  },
  releaseYear: {
    type: Number
  },
  rating: {
    type: String
  },
  duration: {
    type: String
  },
  listed_in: {
    type: String
  },
  description: {
    type: String
  }
})

NetflixSchema.add(BASE_SCHEMA)

export const NetflixModel = mongoose.model('Netflix', NetflixSchema)
