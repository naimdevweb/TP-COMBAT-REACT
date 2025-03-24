import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  players: [
    { name: "John", pv: 100, pvMax: 100, mana: 30, manaMax: 30, id: 1 },
    { name: "Jane", pv: 100, pvMax: 100, mana: 30, manaMax: 30, id: 2 },
    { name: "Joe", pv: 100, pvMax: 100, mana: 30, manaMax: 30, id: 3 },
  ],
  monster: {
    name: "Crypto",
    pv: 800,
    pvMax: 800
  },
  // Table des capacités avec leurs dégâts
  capacities: {
    strike: { name: "Frappe", damage: 5, manaCost: 0 },
    fireball: { name: "Boule de feu", damage: 15, manaCost: 10 },
    icespear: { name: "Lance de glace", damage: 10, manaCost: 5 },
    thunderbolt: { name: "Éclair", damage: 20, manaCost: 15 }
  }
};

export const fightSlice = createSlice({
  name: "fight",
  initialState,
  reducers: {
    hitMonster: (state, action) => {
      // Nouvelle approche: action.payload contient le type de capacité
      const capacityType = action.payload;
      const capacity = state.capacities[capacityType];
      
      if (capacity) {
        // Applique les dégâts correspondants
        state.monster.pv = Math.max(0, state.monster.pv - capacity.damage);
      }
    },

    hitBack: (state, action) => {
      const { playerId, damage } = action.payload;
      const targetPlayerIndex = state.players.findIndex(player => player.id === playerId);
      state.players[targetPlayerIndex].pv = Math.max(0, state.players[targetPlayerIndex].pv - damage);
    },
  },
});

export const { hitMonster, hitBack } = fightSlice.actions;
export default fightSlice.reducer;