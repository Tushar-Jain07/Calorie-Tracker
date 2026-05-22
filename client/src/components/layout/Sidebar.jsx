import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, UtensilsCrossed, Calculator, TrendingUp, User, LogOut } from 'lucide-react';
import useAuthStore from '../../store/authStore';

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/food-log', icon: UtensilsCrossed, label: 'Food Log' },
    { path: '/calculator', icon: Calculator, label: 'Calculator' },
    { path: '/progress', icon: TrendingUp, label: 'Progress' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  const initial = user?.username?.charAt(0)?.toUpperCase() || 'U';

  return (
    <aside className="sidebar" id="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">M</div>
        <h2 className="text-gradient">MacroSnap</h2>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-title">Menu</div>
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <item.icon size={20} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user" onClick={handleLogout} title="Logout" role="button" tabIndex={0}>
          <div className="sidebar-user-avatar">{initial}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user?.username || 'User'}</div>
            <div className="sidebar-user-label">Click to logout</div>
          </div>
          <LogOut size={16} style={{ color: 'var(--text-tertiary)' }} />
        </div>
      </div>
    </aside>
  );
}
