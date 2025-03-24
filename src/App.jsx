import './App.css'
import Monster from './components/Monster/Monster'
import PlayerList from './components/PlayerList'
import BattleLog from './components/BattleLog/BattleLog'
import GameOver from './components/GameOver/GameOver'
import CombatEffects from './components/CombatEffects/CombatEffects' 

function App() {
  return (
    <div className="App">
        <Monster />
        <br></br>
        <BattleLog />
        <section className="container-fluid">
          <PlayerList />
        </section>
        <CombatEffects /> 
        <GameOver />
    </div>
  )
}

export default App