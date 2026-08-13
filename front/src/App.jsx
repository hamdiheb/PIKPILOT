import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Home from '../pages/Home'
import Moviedetails from '../pages/Moviedetails'
import Notfound from '../pages/Notfound'
import Footer from '../components/Footer'
export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<Moviedetails />} />
        <Route path="*" element={<Notfound />} />
      </Routes>
      {/* Outside Routes so every page ends the same way, the 404 included. */}
      <Footer />
    </BrowserRouter>
  )
}
