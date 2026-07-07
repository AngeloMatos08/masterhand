import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import "./RadialMenu.css";

export default function RadialMenu(): React.ReactElement {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    try {
      await logout();
    } finally {
      navigate("/login", { replace: true });
    }
  };

  const closeMenu = () => {
    const cb = document.getElementById("menu-toggle-checkbox") as HTMLInputElement | null;
    if (cb) cb.checked = false;
  };

  return (
    <div className="radial-menu">
      <input type="checkbox" id="menu-toggle-checkbox" />
      <label htmlFor="menu-toggle-checkbox" className="menu-toggle-label">
        <svg className="icon-open" viewBox="0 0 24 24">
          <path fill="currentColor" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
        </svg>
        <svg className="icon-close" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
          />
        </svg>
      </label>

      <ul className="menu-items">
        {/* 1 - Profile photo (shows user photo if available) */}
        <li className="menu-item">
          <Link to="/" aria-label="Profile" onClick={closeMenu}>
            {user && user.photoURL ? (
              // eslint-disable-next-line jsx-a11y/alt-text
              <img src={user.photoURL} alt={user.name ?? "Profile"} className="radial-avatar" />
            ) : (
              <svg viewBox="0 0 24 24">
                <path fill="currentColor" d="M12,12A5,5 0 0,0 17,7A5,5 0 0,0 12,2A5,5 0 0,0 7,7A5,5 0 0,0 12,12M12,14C9.33,14 4,15.33 4,18V20H20V18C20,15.33 14.67,14 12,14Z" />
              </svg>
            )}
          </Link>
        </li>

        {/* 2 - Favorites */}
        <li className="menu-item">
          <Link to="/favorites" aria-label="Favorites" onClick={closeMenu}>
            <svg viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 21s-7-4.6-9-7.1C0.7 10.2 3 7 6 7c1.9 0 3.3 1.2 3.9 2 .6-.8 2-2 3.9-2 3 0 5.3 3.2 3 6.9-2 2.5-9 7.1-9 7.1z" />
            </svg>
          </Link>
        </li>

        {/* 3 - Home: d20 from public folder */}
        <li className="menu-item">
          <Link to="/" aria-label="Home" onClick={closeMenu}>
            <img src="/d20.svg" alt="d20" className="d20-icon" />
          </Link>
        </li>

        {/* 4 - Logout (call logout and navigate client-side) */}
        <li className="menu-item">
          <button
            className="radial-logout"
            onClick={async (e) => {
              closeMenu();
              await handleLogout(e);
            }}
            aria-label="Logout"
          >
            <svg viewBox="0 0 24 24">
              <path fill="currentColor" d="M16 13v-2H7V8l-5 4 5 4v-3zM20 3h-8v2h8v14h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
            </svg>
          </button>
        </li>
      </ul>
    </div>
  );
}
