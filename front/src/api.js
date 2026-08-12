// Vite picks the .env file from the mode: .env.development for `npm run dev`,
// .env.production for `npm run build`. Only VITE_-prefixed keys are exposed to
// client code, and they are substituted at build time rather than read at
// runtime — so this is a public value, never a place for secrets.
export const API_URL = import.meta.env.VITE_API_URL

// Without this, a missing key silently produces requests to "undefined/movies"
// that only fail once the app is running in the browser.
if (!API_URL) {
  throw new Error('VITE_API_URL is not set — check .env.development / .env.production')
}
