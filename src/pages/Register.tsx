import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../App.css";

function Register() {
  const navigate = useNavigate();
  const { registerWithEmail, loading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setError(null);
      await registerWithEmail(name, email, password);
      navigate("/");
    } catch (err) {
      setError("Não foi possível criar sua conta. Verifique os dados.");
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1>Registrar</h1>
        <p>Crie sua conta para acessar o catálogo.</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Nome
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label>
            Senha
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          </label>
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="auth-button" disabled={loading}>
            Registrar
          </button>
        </form>
        <div className="auth-cta">
          <span>Já tem conta?</span>
          <Link to="/login">Entrar</Link>
        </div>
      </div>
    </main>
  );
}

export default Register;
