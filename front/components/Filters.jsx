import { useEffect, useState } from 'react'

export default function Filters() {
  const [list, setList] = useState([])
  useEffect(() => {
    async function fetchList() {
      const request = await fetch('http://localhost:3000/list')
      const data = await request.json()
      setList(data.message.genres)
    }
    fetchList()
  }, [])
  return (
    <section>
      <select>
        <option value="">All genres</option>
        {list.map((element) => {
          return (
            <option value={element.id} key={element.id}>
              {element.name}
            </option>
          )
        })}
      </select>
    </section>
  )
}
