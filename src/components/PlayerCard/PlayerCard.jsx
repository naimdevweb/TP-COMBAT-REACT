import ButtonCapacity from "../ButtonCapacity/ButtonCapacity";
import ProgressBar from "../ProgressBar/ProgressBar";
import "./PlayerCard.css";
import { useEffect, useState } from "react";

// Import des images de héros
import warrior from "../../assets/ezio2.webp";
import archer from "../../assets/kratos.jpg";
import mage from "../../assets/witcher2.jpeg";
import paladin from "../../assets/julll.avif";

function PlayerCard({ player }) {
  const [heroImage, setHeroImage] = useState("");

  // Sélectionne l'image appropriée selon l'ID du joueur
  useEffect(() => {
    switch (player.id) {
      case 1:
        setHeroImage(warrior);
        break;
      case 2:
        setHeroImage(archer);
        break;
      case 3:
        setHeroImage(mage);
        break;
      case 4:
        setHeroImage(paladin);
        break;
      default:
        setHeroImage(warrior);
    }
  }, [player.id]);

  return (
    <div
      key={player.id}
      className={`card ${player.pv <= 0 ? 'hero-ko' : ''}`}
      id={`joueur${player.id}`}
    >
      <div className="card-header">
        <h5 className="card-title">{player.name}</h5>
      </div>
      <div className="card-body">
        {/* Image du héros */}
        <div className="hero-image-container">
          <img
            className="hero-image"
            src={heroImage}
            alt={`${player.name}`}
            style={player.id === 1 ? {
              objectFit: 'cover',
              objectPosition: 'center 30%',
              transform: 'scale(1.3)'
            } : {}}
          />
          {player.pv <= 0 && <div className="ko-overlay">KO</div>}
        </div>

        {/* Indicateur de dégâts */}
        <span className="damage-badge" id={`degatSpanJ${player.id}`}></span>
        
        {/* Statistiques */}
        <div className="stat-container">
          <div className="stat-label">
            <i className="fas fa-heart"></i>
            Points de vie
            <span className="stat-value">{player.pv}/{player.pvMax}</span>
          </div>
          <div className="progress-container">
            <div 
              className="progress-bar hp-bar" 
              style={{width: `${(player.pv/player.pvMax) * 100}%`}}
            ></div>
          </div>
        </div>
        
        <div className="stat-container">
          <div className="stat-label">
            <i className="fas fa-fire-alt"></i>
            Mana
            <span className="stat-value-mana">{player.mana}/{player.manaMax}</span>
          </div>
          <div className="progress-container">
            <div 
              className="progress-bar mana-bar" 
              style={{width: `${(player.mana/player.manaMax) * 100}%`}}
            ></div>
          </div>
        </div>
        
        {/* Section des capacités */}
        <div className="abilities-section">
          <h6 className="abilities-title">Capacités</h6>
          <div className="abilities-container">
            {player.capacities.map((capacity, index) => (
              <ButtonCapacity key={index} player={player} capacity={capacity} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlayerCard;