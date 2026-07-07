import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../App.css";

function Logout() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    logout().finally(() => navigate("/login", { replace: true }));
  }, [logout, navigate]);

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1>Saindo...</h1>
        <p>Aguarde um momento enquanto desconectamos sua conta.</p>
      </div>
    </main>
  );
}

export default Logout;
