import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Home from '../pages/Home'
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Navbar />
        <Route element="/" path={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}
