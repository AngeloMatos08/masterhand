import { useRef, type CSSProperties } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Navigation() {
  const { user } = useAuth();
  const menuToggleRef = useRef<HTMLInputElement>(null);

  const closeMobileMenu = () => {
    if (menuToggleRef.current) {
      menuToggleRef.current.checked = false;
    }
  };

  const userName = user?.name || user?.email || "MasterHand";
  const initials = userName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

  const accentHue = Array.from(userName).reduce((sum, char) => sum + char.charCodeAt(0), 0) % 360;
  const accentColor = `hsl(${accentHue}, 78%, 61%)`;
  const accentSoft = `hsla(${accentHue}, 78%, 65%, 0.16)`;
  const accentBorder = `hsla(${accentHue}, 78%, 65%, 0.24)`;

  const sidebarStyle: CSSProperties = {
    "--sidebar-accent": accentColor,
    "--sidebar-soft": accentSoft,
    "--sidebar-border": accentBorder,
  } as CSSProperties;

  return (
    <>
      <aside className="app-sidebar" style={sidebarStyle}>
        <div className="app-sidebar__profile">
          <div className="app-sidebar__avatar">
            {user?.photoURL ? (
              <img src={user.photoURL} alt={userName} />
            ) : (
              <span>{initials}</span>
            )}
          </div>
          <div className="app-sidebar__profile-info">
            <strong>{user?.name || "MasterHand"}</strong>
            <p>{user?.email || "Convidado do canal"}</p>
          </div>
        </div>

        <nav className="app-sidebar__nav" aria-label="Navegação principal">
          <NavLink to="/" end className={({ isActive }) => `nav-item${isActive ? " nav-item--active" : ""}`}>
            <span className="nav-item__icon">
              <img src="/dice-d20-svgrepo-com(1).svg" alt="Home" className="nav-item__icon-image" />
            </span>
            <span>Home</span>
          </NavLink>
          <NavLink to="/favorites" className={({ isActive }) => `nav-item${isActive ? " nav-item--active" : ""}`}>
            <span className="nav-item__icon nav-item__icon--accent nav-item__icon--svg" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </span>
            <span>Favoritos</span>
          </NavLink>
          <NavLink to="/logout" className={({ isActive }) => `nav-item${isActive ? " nav-item--active" : ""}`}>
            <span className="nav-item__icon nav-item__icon--accent nav-item__icon--svg" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </span>
            <span>Sair</span>
          </NavLink>
        </nav>
      </aside>

      <div className="radial-menu">
        <input ref={menuToggleRef} id="mobile-nav-toggle-checkbox" type="checkbox" />
        <label htmlFor="mobile-nav-toggle-checkbox" className="menu-toggle-label" aria-label="Abrir menu">
          <svg className="icon-open" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="currentColor" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
          </svg>
          <svg className="icon-close" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
          </svg>
        </label>

        <ul className="menu-items">
          <li className="menu-item">
            <NavLink
              to="/"
              end
              className="menu-action"
              onClick={closeMobileMenu}
              aria-label="Home"
            >
              <img src="/dice-d20-svgrepo-com(1).svg" alt="Home" />
            </NavLink>
          </li>
          <li className="menu-item">
            <NavLink
              to="/favorites"
              className="menu-action"
              onClick={closeMobileMenu}
              aria-label="Favoritos"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </NavLink>
          </li>
          <li className="menu-item">
            <NavLink
              to="/logout"
              className="menu-action"
              onClick={closeMobileMenu}
              aria-label="Sair"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20" aria-hidden="true">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </NavLink>
          </li>
        </ul>
      </div>
    </>
  );
}

export default Navigation;
