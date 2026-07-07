import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import type { RPG } from "../models/RPG";
import { getRPGs } from "../services/rpgService";
import Header from "../components/Header";
import Loading from "../components/Loading";
import RpgCard from "../components/RpgCard";
import RpgSheet from "../components/RpgSheet";
import "../App.css";

function Favorites() {
  const { user, toggleFavorite } = useAuth();
  const [rpgs, setRpgs] = useState<RPG[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRpg, setSelectedRpg] = useState<RPG | null>(null);

  useEffect(() => {
    async function carregarRPGs() {
      setIsLoading(true);
      const dados = await getRPGs();
      setRpgs(dados);
      setIsLoading(false);
    }

    carregarRPGs();
  }, []);

  const favoriteIds = useMemo(() => new Set(user?.favorites ?? []), [user]);
  const favoriteRpgs = useMemo(
    () => rpgs.filter((rpg) => favoriteIds.has(String(rpg.id))),
    [rpgs, favoriteIds],
  );

  const handleOpen = (rpg: RPG) => setSelectedRpg(rpg);
  const handleClose = () => setSelectedRpg(null);
  const handleToggleFavorite = () => {
    if (selectedRpg) toggleFavorite(selectedRpg.id);
  };

  return (
    <main className="home-container">
      <Header />
      <section className="category-section">
        <div className="favorites-top">
            <div>
              <h2>Favoritos</h2>
              <p>Seus RPGs favoritos ficam salvos aqui.</p>
            </div>
            <Link to="/" className="favorites-back-link">
              Voltar para Home
            </Link>
          </div>
        {isLoading ? (
          <Loading />
        ) : favoriteRpgs.length === 0 ? (
          <div className="empty-state">
            <p>Ainda não há favoritos. Abra um RPG e clique em favoritar.</p>
          </div>
        ) : (
          <div className="rpg-grid">
            {favoriteRpgs.map((rpg) => (
              <RpgCard key={rpg.id} rpg={rpg} onOpen={handleOpen} />
            ))}
          </div>
        )}
      </section>
      <RpgSheet
        rpg={selectedRpg}
        onClose={handleClose}
        isFavorite={selectedRpg ? favoriteIds.has(String(selectedRpg.id)) : false}
        onToggleFavorite={handleToggleFavorite}
      />
    </main>
  );
}

export default Favorites;
