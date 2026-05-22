import useAuthStore from '../../store/authStore';

export default function Navbar() {
  const { user } = useAuthStore();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <header className="navbar" id="top-navbar">
      <div className="navbar-greeting">
        {getGreeting()}, <strong>{user?.username || 'there'}</strong> 👋
      </div>
      <div className="navbar-actions">
        <div className="badge badge-emerald">
          <span>v3.0</span>
        </div>
      </div>
    </header>
  );
}
