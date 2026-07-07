import { useCallback, useRef, useState } from "react";
import type { RPG } from "../models/RPG";
import "./RpgCard.css";

interface RpgCardProps {
  rpg: RPG;
  onOpen?: (rpg: RPG) => void;
}

function RpgCard({ rpg, onOpen }: RpgCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  const coverSrc = `/capas/${rpg.id}.webp`;
  const priceText = rpg.price > 0
    ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(rpg.price)
    : "Gratuito";

  // Atualiza a posição do cursor (em %) e o ângulo de tilt em CSS custom
  // properties. O CSS lê essas variáveis pra desenhar o "afundamento" e o
  // brilho exatamente onde o mouse está.
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = cardRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    const rotateY = 0; // sem tilt 3D
    const rotateX = 0; // sem tilt 3D

    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
    el.style.setProperty("--rx", `${rotateX}deg`);
    el.style.setProperty("--ry", `${rotateY}deg`);
  }, []);

  const handleMouseEnter = useCallback(() => setIsHovering(true), []);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    const el = cardRef.current;
    if (!el) return;
    // volta suavemente pro estado neutro (a transição mais longa do
    // .rpg-card cuida do "suave" aqui, veja o CSS)
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--mx", "50%");
    el.style.setProperty("--my", "50%");
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (typeof onOpen === "function") {
      e.preventDefault();
      onOpen(rpg);
      return;
    }
  };

  return (
    <a
      ref={cardRef}
      className={`rpg-card${isHovering ? " rpg-card--hovering" : ""}`}
      href={rpg.storeLink || "#"}
      target="_blank"
      rel="noreferrer"
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <img
        className="rpg-card__image"
        src={coverSrc}
        alt={`Capa de ${rpg.title}`}
      />
      <div className="rpg-card__content">
        <h2 className="rpg-card__title">{rpg.title}</h2>
        <span className="rpg-card__price">{priceText}</span>
      </div>

      {/* camadas do efeito — não interagem com clique/toque */}
      <span className="rpg-card__sink-shadow" aria-hidden="true" />
      <span className="rpg-card__sink-highlight" aria-hidden="true" />
      <span className="rpg-card__spotlight" aria-hidden="true" />
      <span className="rpg-card__shimmer" aria-hidden="true" />
    </a>
  );
}

export default RpgCard;