import { NavLink } from 'react-router-dom';
import { LayoutDashboard, UtensilsCrossed, Calculator, TrendingUp, User } from 'lucide-react';

export default function MobileNav() {
  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Home' },
    { path: '/food-log', icon: UtensilsCrossed, label: 'Log' },
    { path: '/calculator', icon: Calculator, label: 'Calc' },
    { path: '/progress', icon: TrendingUp, label: 'Stats' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="mobile-nav" id="mobile-nav">
      <div className="mobile-nav-links">
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
          >
            <item.icon size={22} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
