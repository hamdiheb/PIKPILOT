import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { aiSearcher } from './services/aiService.js'
import { moviesDatabase } from './services/theMovieDb.js'
const app = express()

app.use(cors())
app.use(express.json())

app.post('/suggestion', aiSearcher)
app.get('/movies', moviesDatabase)
app.listen(3000, () => {
  console.log('Server is running on PORT 3000')
})
