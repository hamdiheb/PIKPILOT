import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import { aiSearcher } from './services/aiService.js'
import { moviesDatabase, movieDetails, genreList } from './services/theMovieDb.js'
// Resolved against this file, not the working directory, so the server picks up
// back/.env whether it is started from the repo root or from back/.
dotenv.config({ path: join(dirname(fileURLToPath(import.meta.url)), '.env') })

const app = express()

// Render terminates TLS at its own proxy, so every request arrives from the
// proxy's IP. Without this, express-rate-limit keys all traffic to that single
// address and the limits below become one shared budget for the whole internet,
// which one caller can exhaust for everybody. 1 = trust exactly Render's hop,
// so req.ip is the real client and X-Forwarded-For cannot be spoofed past it.
app.set('trust proxy', 1)

// Without an explicit origin, cors() reflects every requester, which would let
// any site on the internet spend our OpenRouter credits through /suggestion.
const allowedOrigins = process.env.FRONTEND_URL
if (!allowedOrigins) {
  throw new Error('FRONTEND_URL is not set — refusing to start with an open CORS policy')
}

// /suggestion costs money per call, so it gets a tighter budget than the
// TMDB proxy routes, which are cached upstream and free.
const suggestionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { message: 'Too many suggestion requests, please try again later' },
})

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later' },
})

app.use(cors({ origin: allowedOrigins.split(',') }))
app.use(express.json({ limit: '10kb' }))
app.use(generalLimiter)

app.post('/suggestion', suggestionLimiter, aiSearcher)
app.get('/movies', moviesDatabase)
app.get('/movies/:id', movieDetails)
app.get('/list', genreList)

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Server is running on PORT ${port}`)
})
