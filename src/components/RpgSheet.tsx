import type { RPG } from "../models/RPG";
import { useAuth } from "../contexts/AuthContext";
import "../App.css";

interface RpgSheetProps {
  rpg: RPG | null;
  onClose: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export default function RpgSheet({ rpg, onClose, isFavorite = false, onToggleFavorite }: RpgSheetProps) {
  const { user } = useAuth();

  if (!rpg) return null;

  const coverSrc = `/capas/${rpg.id}.webp`;

  return (
    <div className="rpg-sheet-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="rpg-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="rpg-sheet__top">
          <button className="rpg-sheet__close" onClick={onClose} aria-label="Fechar">
            ✕
          </button>
          {user && (
            <button
              type="button"
              className={`rpg-sheet__fav${isFavorite ? " rpg-sheet__fav--active" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite?.();
              }}
              aria-pressed={isFavorite}
              aria-label={isFavorite ? "Remover favorito" : "Adicionar favorito"}
            >
              {isFavorite ? "❤️" : "♡"}
            </button>
          )}
        </div>

        <div className="rpg-sheet__body">
          <img
            className="rpg-sheet__cover"
            src={coverSrc}
            alt={rpg.title}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = rpg.cover || "";
            }}
          />

          <div className="rpg-sheet__meta">
            <h3 className="rpg-sheet__title">{rpg.title}</h3>
            <div className="rpg-sheet__cats">
              {rpg.categoryShow1 && <span className="rpg-sheet__cat">{rpg.categoryShow1}</span>}
              {rpg.categoryShow2 && <span className="rpg-sheet__cat">{rpg.categoryShow2}</span>}
            </div>
            <p className="rpg-sheet__description">{rpg.description}</p>
          </div>
        </div>

        <div className="rpg-sheet__footer">
          <a className="rpg-sheet__buy" href={rpg.storeLink || "#"} target="_blank" rel="noreferrer">
            Disponível em {rpg.storeName || "loja"}
          </a>
        </div>
      </div>
    </div>
  );
}
