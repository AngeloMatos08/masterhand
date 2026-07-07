import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../App.css";

function Login() {
  const navigate = useNavigate();
  const { signInWithGoogle, signInWithEmail, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setError(null);
      await signInWithEmail(email, password);
      navigate("/");
    } catch (err) {
      setError("Não foi possível entrar. Verifique suas credenciais.");
    }
  };

  const handleGoogle = async () => {
    try {
      setError(null);
      await signInWithGoogle();
      navigate("/");
    } catch (err) {
      setError("Não foi possível entrar com Google.");
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1>Entrar</h1>
        <p>Use sua conta para acessar o catálogo.</p>
        <button className="auth-button auth-button--google" onClick={handleGoogle} disabled={loading}>
          Entrar com Google
        </button>
        <div className="auth-divider">ou</div>
        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label>
            Senha
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="auth-button" disabled={loading}>
            Entrar
          </button>
        </form>
        <div className="auth-cta">
          <span>Ainda não tem uma conta?</span>
          <Link to="/register">Registrar</Link>
        </div>
      </div>
    </main>
  );
}

export default Login;
