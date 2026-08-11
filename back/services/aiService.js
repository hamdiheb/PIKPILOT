import { OpenRouter } from '@openrouter/sdk'

const baseUrl = 'https://openrouter.ai/api/v1/chat/completions'

export async function aiSearcher(req, res) {
  const client = new OpenRouter({
    apiKey: process.env.OPEN_ROUTER_API_KEY,
    httpReferer: '<YOUR_SITE_URL>', // Optional. Site URL for rankings on openrouter.ai.
    appTitle: '<YOUR_SITE_NAME>', // Optional. Site title for rankings on openrouter.ai.
  })

  const completion = await client.chat.send({
    chatRequest: {
      model: 'tencent/hy3',
      messages: [
        {
          role: 'user',
          content: `Based on this request ${req.body.query} return the response as suggestion in array `,
        },
      ],
    },
  })

  res.status(201).json({ message: completion.choices[0].message.content })
}
