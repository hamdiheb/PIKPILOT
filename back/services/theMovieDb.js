const baseUrl = process.env.TMDB_URL_BASE
const token = process.env.TMDB_TOKEN

export async function moviesDatabase(req, res) {
  try {
    const page = Math.min(Math.max(parseInt(req.query.page) || 1, 1), 500)

    const request = await fetch(`${baseUrl}/discover/movie?page=${page}`, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    if (!request.ok) {
      throw new Error(`TMDB responded ${request.status} ${request.statusText}`)
    }

    const response = await request.json()
    return res.status(200).json({ message: response })
  } catch (error) {
    console.error('TMDB request failed:', error.message)
    return res.status(500).json({ message: 'Could not fetch movies' })
  }
}

export async function genreList(req, res) {
  try {
    const request = await fetch(`${baseUrl}/genre/movie/list`, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    if (!request.ok) {
      throw new Error(`TMDB responded ${request.status} ${request.statusText}`)
    }
    const response = await request.json()
    return res.status(200).json({ message: response })
  } catch (error) {
    console.error('TMDB request failed:', error.message)
    return res.status(500).json({ message: 'Could not fetch list' })
  }
}
