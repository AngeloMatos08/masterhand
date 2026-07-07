import { useEffect, useMemo, useState } from "react";
import type { RPG } from "../models/RPG";
import { getRPGs } from "../services/rpgService";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";
import RpgCard from "../components/RpgCard";
import RpgSheet from "../components/RpgSheet";
import "../App.css";

function Home() {
  const [rpgs, setRpgs] = useState<RPG[]>([]);
  const [search, setSearch] = useState("");
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

  const filteredRpgs = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return rpgs;
    return rpgs.filter((rpg) => rpg.title.toLowerCase().includes(query));
  }, [rpgs, search]);

  const categoryMap: Record<string, Array<number | string>> = {
    sugeridos: [17,1,3, "Good Morning Milky Way!"], // Adicione ids ou títulos manualmente aqui
    fantasia: [2,16,18, "Breu"],
    sobrevivencia: [15,19,10, "Brutal"],
    faroeste: [9,14,5, 21],
  };

  const categoryItems = useMemo(() => {
    return Object.fromEntries(
      Object.entries(categoryMap).map(([category, keys]) => [
        category,
        filteredRpgs.filter(
          (rpg) => keys.includes(rpg.id) || keys.includes(rpg.title),
        ),
      ]),
    ) as Record<keyof typeof categoryMap, RPG[]>;
  }, [filteredRpgs]);

  const sortedCatalog = useMemo(
    () => [...filteredRpgs].sort((a, b) => a.id - b.id),
    [filteredRpgs],
  );

  const searchActive = search.trim().length > 0;
  const showEmptyState = searchActive && !isLoading && filteredRpgs.length === 0;

  const handleOpen = (rpg: RPG) => setSelectedRpg(rpg);
  const handleClose = () => setSelectedRpg(null);

  return (
    <main className="home-container">
      <Header />
      <SearchBar value={search} onChange={setSearch} />

      {isLoading ? (
        <Loading />
      ) : searchActive ? (
        <section className="search-results">
          {showEmptyState ? (
            <EmptyState />
          ) : (
            <ul className="search-results__list">
              {filteredRpgs.map((rpg) => (
                  <li key={rpg.id} className="search-results__item">
                    <img
                      className="search-results__cover"
                      src={`/capas/${rpg.id}.webp`}
                      alt={rpg.title}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = rpg.cover || '';
                      }}
                    />
                    <div className="search-results__content">
                      <strong>{rpg.title}</strong>
                    </div>
                  </li>
                ))}
            </ul>
          )}
        </section>
      ) : (
        <>
          <section className="category-section">
            <h2>Sugeridos</h2>
            <div className="rpg-grid">
                {categoryItems.sugeridos.map((rpg) => (
                <RpgCard key={rpg.id} rpg={rpg} onOpen={handleOpen} />
              ))}
            </div>
          </section>

          <section className="category-section">
            <h2>Fantasia</h2>
            <div className="rpg-grid">
              {categoryItems.fantasia.map((rpg) => (
                <RpgCard key={rpg.id} rpg={rpg} onOpen={handleOpen} />
              ))}
            </div>
          </section>

          <section className="category-section">
            <h2>Sobrevivência</h2>
            <div className="rpg-grid">
              {categoryItems.sobrevivencia.map((rpg) => (
                <RpgCard key={rpg.id} rpg={rpg} onOpen={handleOpen} />
              ))}
            </div>
          </section>

          <section className="category-section">
            <h2>Faroeste</h2>
            <div className="rpg-grid">
              {categoryItems.faroeste.map((rpg) => (
                <RpgCard key={rpg.id} rpg={rpg} onOpen={handleOpen} />
              ))}
            </div>
          </section>

          <section className="catalog-section">
            <h2>Catálogo</h2>
            <div className="rpg-grid">
              {sortedCatalog.map((rpg) => (
                <RpgCard key={rpg.id} rpg={rpg} onOpen={handleOpen} />
              ))}
            </div>
          </section>
          <RpgSheet rpg={selectedRpg} onClose={handleClose} />
        </>
      )}
    </main>
  );
}

export default Home;
