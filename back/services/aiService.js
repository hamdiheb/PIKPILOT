import { OpenRouter } from '@openrouter/sdk'
import { findMovieByTitle } from './theMovieDb.js'

// A movie request is a short phrase. Anything longer is either a mistake or an
// attempt to use the endpoint as a general-purpose LLM on our credits, so it is
// rejected before it reaches OpenRouter rather than billed and then discarded.
const MAX_QUERY_LENGTH = 300

// Each suggestion costs one TMDB lookup, so the model is told to stop at eight
// and the list is cut to eight again in case it does not listen.
const MAX_SUGGESTIONS = 8

// The model is asked for a title and a year and nothing else: the blurb it
// would happily write is not used, because every card is rendered from TMDB's
// own record once the title is resolved.
const prompt = (query) =>
  `Suggest up to ${MAX_SUGGESTIONS} films for this request: "${query}".\n` +
  `Reply with a JSON array only — no prose, no markdown fence. Each item must ` +
  `be {"title": string, "year": number}. Use the English title where a film has ` +
  `one — asking for the original title gets back scripts the catalogue search ` +
  `matches less reliably.`

// Asking for clean JSON is not the same as getting it: this model fences its
// answer in ```json more often than not, and sometimes adds a line of
// commentary. Slicing between the outer brackets survives both.
function parseSuggestions(text) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i)
  const body = (fenced ? fenced[1] : text).trim()

  const start = body.indexOf('[')
  const end = body.lastIndexOf(']')
  if (start === -1 || end <= start) return null

  try {
    const parsed = JSON.parse(body.slice(start, end + 1))
    return Array.isArray(parsed) ? parsed : null
  } catch {
    return null
  }
}

export async function aiSearcher(req, res) {
  const query = req.body?.query

  // express.json() leaves req.body as {} for a missing or non-JSON body, so an
  // absent query arrives as undefined and would otherwise be interpolated into
  // the prompt as the literal string "undefined".
  if (typeof query !== 'string' || !query.trim()) {
    return res.status(400).json({ message: 'query is required and must be a non-empty string' })
  }

  if (query.length > MAX_QUERY_LENGTH) {
    return res
      .status(400)
      .json({ message: `query must be ${MAX_QUERY_LENGTH} characters or fewer` })
  }

  try {
    const client = new OpenRouter({
      apiKey: process.env.OPEN_ROUTER_API_KEY,
      httpReferer: process.env.FRONTEND_URL, // Optional. Site URL for rankings on openrouter.ai.
      appTitle: 'PikPilot', // Optional. Site title for rankings on openrouter.ai.
    })

    const completion = await client.chat.send({
      chatRequest: {
        model: 'nvidia/nemotron-3-ultra-550b-a55b:free',
        messages: [
          {
            role: 'user',
            content: prompt(query.trim()),
          },
        ],
      },
    })

    // The free tier drops requests under load, which comes back as a well-formed
    // response with no choices rather than a thrown error.
    const suggestion = completion.choices?.[0]?.message?.content
    if (!suggestion) {
      throw new Error('OpenRouter returned no completion')
    }

    // If the model ignored the format, its own words are still worth showing —
    // better a paragraph than an empty panel.
    const parsed = parseSuggestions(suggestion)
    if (!parsed) {
      return res.status(201).json({ message: { movies: [], text: suggestion } })
    }

    const titles = parsed
      .filter((item) => typeof item?.title === 'string' && item.title.trim())
      .slice(0, MAX_SUGGESTIONS)

    const found = await Promise.all(
      titles.map((item) => findMovieByTitle(item.title.trim(), Number(item.year) || null)),
    )

    // A title the catalogue does not have drops out, and two suggestions can
    // resolve to the same film, which would otherwise repeat a card and break
    // the key on the grid.
    const seen = new Set()
    const movies = found.filter((movie) => movie && !seen.has(movie.id) && seen.add(movie.id))

    return res.status(201).json({ message: { movies, text: '' } })
  } catch (error) {
    // Express 5 forwards async throws to the default handler, which echoes the
    // stack trace unless NODE_ENV is production. Catching here keeps upstream
    // details in our logs instead of the response body either way.
    console.error('OpenRouter request failed:', error.message)
    return res.status(500).json({ message: 'Could not fetch a suggestion' })
  }
}
