async function Fetchdata(url, token) {
  const res = await fetch(url, {
    method: 'GET',
    headers: { accept: 'application/json', Authorization: `Bearer ${token}` },
  })

  const data = await res.json()
  return data
}

async function main() {
  const url = 'https://api.themoviedb.org/3/discover/movie'
  const token =
    'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhZmZhNWNhMTAxNzRmYjcwYWFhNjEwMTYxNDY2NzllOSIsIm5iZiI6MTc4NjAxOTQ5MS45NjEsInN1YiI6IjZhNzQ3ZWEzMzcyMzFmZWEwZThiMDk2MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.9x8zZ3qwCPzbBiGF54DPzzfrdoZv7v-svSvCTwEQXOs'

  const data = await Fetchdata(url, token)
  return data
}

export const imdbData = await main()

console.log(imdbData)
