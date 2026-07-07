import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Logout from "./pages/Logout";
import Favorites from "./pages/Favorites";
import Navigation from "./components/Navigation";
import type { ReactNode } from "react";

function RequireAuth({ children }: { children: ReactNode }) {
  const auth = useAuth();
  if (auth.loading) return null;
  return auth.user ? <>{children}</> : <Navigate to="/login" replace />;
}

function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <Navigation />
      <div className="app-content">{children}</div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <RequireAuth>
                <AppLayout>
                  <Home />
                </AppLayout>
              </RequireAuth>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/logout" element={<Logout />} />
          <Route
            path="/favorites"
            element={
              <RequireAuth>
                <AppLayout>
                  <Favorites />
                </AppLayout>
              </RequireAuth>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
