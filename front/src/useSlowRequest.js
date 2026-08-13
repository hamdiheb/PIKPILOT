import { useEffect, useState } from 'react'

// Two things on this site are slow through no fault of the code: a sleeping
// free-tier API takes about thirty seconds to wake, and the free model behind
// the hero can spend another forty thinking. Both read as a broken page unless
// something on screen says otherwise.
//
// True once a request has been running long enough to be worth explaining, so
// the wait is only mentioned when there is actually something to explain — a
// warm server answers in a quarter of a second and the message never appears.
export function useSlowRequest(active, delay = 8000) {
  const [slow, setSlow] = useState(false)

  useEffect(() => {
    if (!active) {
      setSlow(false)
      return undefined
    }

    const timer = setTimeout(() => setSlow(true), delay)
    return () => clearTimeout(timer)
  }, [active, delay])

  return slow
}
