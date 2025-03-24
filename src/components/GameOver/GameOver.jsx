import { useSelector, useDispatch } from 'react-redux';
import { resetGame } from '../../features/fight/fightSlice';
import './GameOver.css';

function GameOver() {
  const gameState = useSelector(state => state.fight.gameState);
  const gameOver = useSelector(state => state.fight.gameOver);
  const dispatch = useDispatch();

  // Ne rien afficher si la partie n'est pas terminée
  if (!gameOver) return null;

  const handleRestart = () => {
    dispatch(resetGame());
  };

  return (
    <div className="game-over-overlay">
      <div className="game-over-modal">
        {gameState === "victory" ? (
          <>
            <h2 className="victory-title">VICTOIRE!</h2>
            <p>Félicitations ! Vous avez vaincu le Dragon !</p>
            <div className="trophy">🏆</div>
          </>
        ) : (
          <>
            <h2 className="defeat-title">DÉFAITE!</h2>
            <p>Tous les héros ont été vaincus...</p>
            <div className="skull">☠️</div>
          </>
        )}
        <button 
          className="btn btn-primary restart-button"
          onClick={handleRestart}
        >
          Recommencer
        </button>
      </div>
    </div>
  );
}

export default GameOver;