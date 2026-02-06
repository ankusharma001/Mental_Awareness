import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import DarkModeToggle from './DarkModeToggle';

export default function Navbar() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${isActive
      ? 'text-indigo-600 dark:text-indigo-400 font-bold border-b-2 border-indigo-500 pb-1'
      : 'text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400'
    }`;

  return (
    <nav className="bg-white/80 dark:bg-[#0b141a]/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Link className="font-black text-2xl tracking-tighter text-indigo-600 dark:text-indigo-400" to="/">
          MIND<span className="text-gray-900 dark:text-white">SPACE</span>
        </Link>

        {token && (
          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/articles" className={navLinkClass}>Feed</NavLink>
            <NavLink to="/groups" className={navLinkClass}>Explore Groups</NavLink>
            <NavLink to="/my-groups" className={navLinkClass}>My Communities</NavLink>
          </div>
        )}
      </div>

      <div className="flex items-center gap-6">
        {!token ? (
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Login</Link>
            <Link to="/register" className="px-5 py-2 bg-indigo-600 text-white rounded-full text-sm font-bold shadow-md hover:bg-indigo-700 transition-all">Join Now</Link>
          </div>
        ) : (
          <div className="flex items-center gap-6">
            <Link to="/create-article" className="hidden sm:flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-indigo-100 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
              Share Story
            </Link>
            <Link to="/profile" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </Link>
            <button onClick={handleLogout} className="text-sm font-medium text-red-500 hover:text-red-600 transition-colors">Logout</button>
          </div>
        )}
        <DarkModeToggle />
      </div>
    </nav>
  );
}
