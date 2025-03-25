import "./ButtonCapacity.css";
import { useDispatch, useSelector } from "react-redux";
import { hitMonster } from "../../features/fight/fightSlice";
import { store } from "../../store/store.jsx";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

function ButtonCapacity({ player, capacity }) {
  const dispatch = useDispatch();
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [showHealTargets, setShowHealTargets] = useState(false);
  const buttonRef = useRef(null);
  
  // Récupérer la liste des joueurs pour le choix de cible de soin
  const players = useSelector(state => state.fight.players);

  // Fonction pour générer la description du tooltip
  const getTooltipContent = () => {
    let desc = capacity.name;
    
    if (capacity.damage > 0) {
      desc += `\nDégâts: ${capacity.damage}`;
    }
    
    if (capacity.effect === 'heal') {
      desc += `\nSoigne ${capacity.damage || 10} PV (cliquez pour choisir la cible)`;
    } else if (capacity.effect === 'mana') {
      desc += "\nRégénère 10 points de mana";
    } else if (capacity.effect === 'protect') {
      desc += "\nRend intouchable pour ce tour";
    } else if (capacity.effect === 'lifesteal') {
      desc += "\nVol de vie: absorbe 50% des dégâts";
    }
    
    desc += `\nCoût: ${capacity.manaCost} mana`;
    
    return desc;
  };

  // Mise à jour de la position du tooltip
  useEffect(() => {
    if (showTooltip && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setTooltipPosition({
        top: rect.top - 10, // Positionné au-dessus du bouton
        left: rect.left + rect.width / 2 // Centré horizontalement
      });
    }
  }, [showTooltip]);

  // Fonction pour gérer le clic sur une capacité de soin
  const handleHealClick = () => {
    if (capacity.effect === 'heal') {
      setShowHealTargets(true);
    } else {
      activateCapacity();
    }
  };

  // Fonction pour soigner un joueur spécifique
  const healPlayer = (targetId) => {
    setShowHealTargets(false);
    
    console.log("État avant le soin:", player.id, "peut attaquer:", 
      !store.getState().fight.playersAttacked.includes(player.id));
    
    dispatch(hitMonster({
      playerId: player.id,
      targetId: targetId,
      damage: capacity.damage || 10,
      manaCost: capacity.manaCost,
      effect: 'heal'
    }));
    
    console.log("État après le soin:", 
      store.getState().fight.playersAttacked,
      "Tour actuel:", store.getState().fight.currentTurn);
  };

  const activateCapacity = () => {
    console.log("État avant l'attaque:", player.id, "peut attaquer:", 
      !store.getState().fight.playersAttacked.includes(player.id));
      
    // 15% de chance de coup critique
    const isCritical = Math.random() < 0.15;
    const criticalMultiplier = isCritical ? 1.5 : 1;
    const finalDamage = Math.floor(capacity.damage * criticalMultiplier);
    
    dispatch(hitMonster({
      playerId: player.id,
      damage: finalDamage,
      manaCost: capacity.manaCost,
      effect: capacity.effect,
      isCritical
    }));
    
    // Afficher une animation de coup critique
    if (isCritical) {
      const critText = document.createElement('span');
      critText.className = 'critical-hit';
      critText.textContent = 'CRITIQUE!';
      document.querySelector(`#joueur${player.id}`).appendChild(critText);
      setTimeout(() => critText.remove(), 1000);
    }
    
    console.log("État après l'attaque:", 
      store.getState().fight.playersAttacked,
      "Tour actuel:", store.getState().fight.currentTurn);
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={capacity.effect === 'heal' ? handleHealClick : activateCapacity}
        className={`btn btn-${capacity.color} material-tooltip-main`}
        disabled={player.mana < capacity.manaCost || store.getState().fight.playersAttacked.includes(player.id)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {capacity.name}
        <i className={`fas ${capacity.icon}`}></i> {capacity.damage}
        <i className="fas fa-fire-alt"></i> - {capacity.manaCost}
      </button>
      
      {/* Menu de choix pour les cibles de soin */}
      {showHealTargets && (
        <div className="heal-targets-menu">
          <div className="heal-targets-title">Choisir un joueur à soigner:</div>
          <div className="heal-targets-list">
            {players.map(target => (
              <button 
                key={target.id}
                onClick={() => healPlayer(target.id)}
                className={`heal-target-btn ${target.pv <= 0 ? 'disabled' : ''}`}
                disabled={target.pv <= 0 || target.pv >= target.pvMax}
              >
                <span className="target-name">{target.name}</span>
                <span className="target-health">{target.pv}/{target.pvMax} PV</span>
                <div className="health-bar">
                  <div 
                    className="health-fill"
                    style={{ width: `${(target.pv / target.pvMax) * 100}%` }}
                  ></div>
                </div>
              </button>
            ))}
            <button 
              onClick={() => setShowHealTargets(false)}
              className="cancel-btn"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
      
      {showTooltip && createPortal(
        <div 
          className={`floating-tooltip tooltip-${capacity.color}`}
          style={{ 
            top: `${tooltipPosition.top}px`, 
            left: `${tooltipPosition.left}px` 
          }}
        >
          <div className="tooltip-content">
            {getTooltipContent().split('\n').map((line, index) => (
              <div key={index} className="tooltip-line">{line}</div>
            ))}
          </div>
          <div className="tooltip-arrow"></div>
        </div>,
        document.body
      )}
    </>
  );
}

export default ButtonCapacity;