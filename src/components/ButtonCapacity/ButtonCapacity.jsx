import "./ButtonCapacity.css";
import { useDispatch, useSelector } from 'react-redux';
import { hitMonster, hitBack } from "../../Features/Fight/fightSlice";

function ButtonCapacity() {
  const dispatch = useDispatch();
  const capacities = useSelector(state => state.fight.capacities);

  const fight = (capacityType) => {
    // Utilise le type de capacité pour l'attaque
    dispatch(hitMonster(capacityType));
    console.log(`🗡️ ${capacities[capacityType].name} lancée !`);
    
    // Le monstre contre-attaque immédiatement
    dispatch(hitBack({ playerId: 1, damage: 10 }));
  };

  return (
    <div className="d-flex flex-wrap">
      <button
        type="button"
        onClick={() => fight("strike")}
        className="btn btn-success m-1"
      >
        Frappe
        <i className="fas fa-fist-raised mx-1"></i> {capacities.strike.damage}
      </button>
      
      <button
        type="button"
        onClick={() => fight("fireball")}
        className="btn btn-danger m-1"
      >
        Boule de feu
        <i className="fas fa-fire mx-1"></i> {capacities.fireball.damage}
      </button>
      
      <button
        type="button"
        onClick={() => fight("icespear")}
        className="btn btn-info m-1"
      >
        Lance de glace
        <i className="fas fa-icicles mx-1"></i> {capacities.icespear.damage}
      </button>
      
      <button
        type="button"
        onClick={() => fight("thunderbolt")}
        className="btn btn-warning m-1"
      >
        Éclair
        <i className="fas fa-bolt mx-1"></i> {capacities.thunderbolt.damage}
      </button>
    </div>
  );
}

export default ButtonCapacity;