import './Monster.css';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import image from '../../assets/dg.webp';

function Monster() {
  const monster = useSelector((state) => state.fight.monster);
  const [damaged, setDamaged] = useState(false);
  const [prevHp, setPrevHp] = useState(monster.pv);

  // Détecte quand le monstre subit des dégâts
  useEffect(() => {
    if (prevHp > monster.pv) {
      setDamaged(true);
      setTimeout(() => setDamaged(false), 600);
    }
    setPrevHp(monster.pv);
  }, [monster.pv, prevHp]);

  const hpPercentage = (monster.pv / monster.pvMax) * 100;

  return (
    <section>
      <div className="container">
        <div className="row">
          <div className="card-monstre col-sm-12">
            <div id="monsterCard" className={damaged ? 'monster-damaged' : ''}>
              <div className="text-center">
                <h2 className="monster-name">{monster.name}</h2>
                
                <div className="strength-indicator">
                  <i className="fas fa-fist-raised"></i>
                  <span>Force: {monster.strength}</span>
                </div>
                
                <div className="monster-image-container">
  <img
    className="monster-image"
    src={image}
    alt="monster"
    style={{ objectFit: 'contain', width: '100%', height: '100%' }}
  />
  <div className="monster-aura"></div>
</div>
                
                <span
                  className={`damage-badge ${damaged ? 'show' : ''}`}
                  id="degatSpanMonster"
                >
                  {prevHp - monster.pv}
                </span>
              </div>
              
              <div className="monster-progress-container">
                <div 
                  className="monster-progress-bar"
                  style={{ width: `${hpPercentage}%` }}
                ></div>
                <div className="monster-hp-text">
                  <i className="fas fa-heart"></i> {monster.pv}/{monster.pvMax}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Monster;