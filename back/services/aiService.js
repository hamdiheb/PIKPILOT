import { OpenRouter } from '@openrouter/sdk'

// A movie request is a short phrase. Anything longer is either a mistake or an
// attempt to use the endpoint as a general-purpose LLM on our credits, so it is
// rejected before it reaches OpenRouter rather than billed and then discarded.
const MAX_QUERY_LENGTH = 300

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
            content: `Based on this request ${query.trim()} return the response as suggestion in array `,
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

    return res.status(201).json({ message: suggestion })
  } catch (error) {
    // Express 5 forwards async throws to the default handler, which echoes the
    // stack trace unless NODE_ENV is production. Catching here keeps upstream
    // details in our logs instead of the response body either way.
    console.error('OpenRouter request failed:', error.message)
    return res.status(500).json({ message: 'Could not fetch a suggestion' })
  }
}
