import { useSelector } from 'react-redux';
import './CombatEffects.css';
import { useEffect, useState } from 'react';

function CombatEffects() {
  const lastAttackMissed = useSelector(state => state.fight.lastAttackMissed);
  const [showMissed, setShowMissed] = useState(false);
  
  // Afficher l'effet "RATÉ" pendant 2 secondes quand une attaque est ratée
  useEffect(() => {
    if (lastAttackMissed) {
      setShowMissed(true);
      const timer = setTimeout(() => {
        setShowMissed(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [lastAttackMissed]);
  
  return (
    <div className="combat-effects-container">
      {showMissed && (
        <div className="missed-attack-effect">
          <span>RATÉ!</span>
        </div>
      )}
    </div>
  );
}

export default CombatEffects;