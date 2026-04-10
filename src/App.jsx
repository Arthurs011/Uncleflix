import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Movies from './pages/Movies';
import TV from './pages/TV';
import Search from './pages/Search';
import Watch from './pages/Watch';
import MyList from './pages/MyList';
import Genre from './pages/Genre';

function App() {
  return (
    <Router>
      <div className="bg-primary min-h-screen text-white overflow-x-hidden">
        <Navbar />
        {/* pt accounts for top nav; pb-16 md:pb-0 accounts for mobile bottom nav */}
        <main className="pt-14 md:pt-16 pb-16 md:pb-0">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/tv" element={<TV />} />
            <Route path="/search" element={<Search />} />
            <Route path="/watch/:type/:id" element={<Watch />} />
            <Route path="/my-list" element={<MyList />} />
            <Route path="/genre/:type/:id" element={<Genre />} />
            <Route path="*" element={<div className="p-8 text-center text-gray-500">404 — Page Not Found</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
