import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Header() {
  const { user } = useAuth();

  return (
    <header className="home-header">
      <div>
        <h1 className="home-header__title">Navegue em um mar de Sistemas Brasileiros </h1>
        <p className="home-header__intro">
          Busque por título e explore capas, nomes e preços de cada sistema.
        </p>
      </div>
      {user && (
        <div className="home-header__actions">
          <span>Boas vindas, {user.name || user.email}</span>
          {/* <Link to="/favorites" className="home-header__logout">
            Favoritos
          </Link> */}
          {/* <Link to="/logout" className="home-header__logout">
            Sair
          </Link> */}
        </div>
      )}
    </header>
  );
}

export default Header;
