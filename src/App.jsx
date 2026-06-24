import { Routes, Route } from 'react-router-dom';
import Navbar       from './components/Navbar';
import ScoresTicker from './components/ScoresTicker';
import Footer       from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home         from './pages/Home';
import TeamBuilder  from './pages/TeamBuilder';
import MyTeam       from './pages/MyTeam';
import Transfers    from './pages/Transfers';
import Points       from './pages/Points';
import Players      from './pages/Players';
import PlayerDetail from './pages/PlayerDetail';
import Leagues      from './pages/Leagues';
import Fixtures     from './pages/Fixtures';
import Chat         from './pages/Chat';
import Search       from './pages/Search';
import Login        from './pages/auth/Login';
import Signup       from './pages/auth/Signup';

// withFooter=true → public/info pages; false → focused game pages
function Layout({ children, withFooter = false }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#050d05' }}>
      <Navbar />
      <ScoresTicker />
      <main className="flex-1">{children}</main>
      {withFooter && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Auth — no navbar/footer */}
      <Route path="/auth/login"  element={<Login />} />
      <Route path="/auth/signup" element={<Signup />} />

      {/* Public info pages — with footer */}
      <Route path="/"            element={<Layout withFooter><Home /></Layout>} />
      <Route path="/players"     element={<Layout withFooter><Players /></Layout>} />
      <Route path="/players/:id" element={<Layout withFooter><PlayerDetail /></Layout>} />
      <Route path="/fixtures"    element={<Layout withFooter><Fixtures /></Layout>} />
      <Route path="/leagues"     element={<Layout withFooter><Leagues /></Layout>} />
      <Route path="/search"      element={<Layout withFooter><Search /></Layout>} />

      {/* Focused game / chat pages — no footer */}
      <Route path="/chat"        element={<Layout><Chat /></Layout>} />
      <Route path="/build"       element={<Layout><ProtectedRoute><TeamBuilder /></ProtectedRoute></Layout>} />
      <Route path="/my-team"     element={<Layout><ProtectedRoute><MyTeam /></ProtectedRoute></Layout>} />
      <Route path="/transfers"   element={<Layout><ProtectedRoute><Transfers /></ProtectedRoute></Layout>} />
      <Route path="/points"      element={<Layout><ProtectedRoute><Points /></ProtectedRoute></Layout>} />
    </Routes>
  );
}
