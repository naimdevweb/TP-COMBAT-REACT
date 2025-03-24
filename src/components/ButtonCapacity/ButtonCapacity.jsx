import "./ButtonCapacity.css";
import { useDispatch } from "react-redux";
import { hitMonster } from "../../features/fight/fightSlice";
import { store } from "../../store/store.jsx"; // Utilisez l'import nommé { store }


function ButtonCapacity({ player, capacity }) {
  const dispatch = useDispatch();

  const activateCapacity = () => {
    console.log("État avant l'attaque:", player.id, "peut attaquer:", 
      !store.getState().fight.playersAttacked.includes(player.id));
      
    dispatch(hitMonster({
      playerId: player.id,
      damage: capacity.damage,
      manaCost: capacity.manaCost,
      effect: capacity.effect
    }));
    
    console.log("État après l'attaque:", 
      store.getState().fight.playersAttacked,
      "Tour actuel:", store.getState().fight.currentTurn);
  };

  return (
    <button
      type="button"
      onClick={activateCapacity}
      className={`btn btn-${capacity.color} material-tooltip-main`}
      disabled={player.mana < capacity.manaCost || store.getState().fight.playersAttacked.includes(player.id)}
    >
      {capacity.name}
      <i className={`fas ${capacity.icon}`}></i> {capacity.damage}
      <i className="fas fa-fire-alt"></i> - {capacity.manaCost}
    </button>
  );
}

export default ButtonCapacity;