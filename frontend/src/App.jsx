import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateArticle from './pages/CreateArticle';
import Groups from './pages/Groups';
import Profile from './pages/Profile';
import ArticleFeed from './pages/ArticleFeed';
import GroupsList from './pages/GroupsList';
import GroupDetail from './pages/GroupDetail';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import MyGroups from './pages/MyGroups';

function App() {
  const { token } = useAuth();
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={token ? <Navigate to="/articles" replace /> : <Home />} />
        <Route path="/login" element={token ? <Navigate to="/articles" replace /> : <Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/articles" element={<ProtectedRoute><ArticleFeed /></ProtectedRoute>} />
        <Route path="/create-article" element={<ProtectedRoute><CreateArticle /></ProtectedRoute>} />
        <Route path="/groups" element={<ProtectedRoute><GroupsList /></ProtectedRoute>} />
        <Route path="/my-groups" element={<ProtectedRoute><MyGroups /></ProtectedRoute>} />
        <Route path="/groups/:groupId" element={<ProtectedRoute><GroupDetail /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
