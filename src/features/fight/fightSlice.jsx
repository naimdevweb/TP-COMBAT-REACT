import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  players: [
    { 
      name: "Ezio", 
      pv: 100, 
      pvMax: 100, 
      mana: 30, 
      manaMax: 30, 
      id: 1,
      capacities: [
        { name: "Coup Puissant", damage: 5, manaCost: 5, icon: "fa-hammer", color: "success" },
        { name: "Attaque Basique", damage: 3, manaCost: 0, icon: "fa-fist-raised", color: "secondary", isBasic: true },
        { name: "Méditation", damage: 0, manaCost: 0, icon: "fa-brain", color: "info", effect: "mana" },
        { name: "Explosion", damage: 15, manaCost: 15, icon: "fa-bomb", color: "danger" }
      ]
    },
    { 
      name: "Kratos", 
      pv: 100, 
      pvMax: 100, 
      mana: 30, 
      manaMax: 30, 
      id: 2,
      capacities: [
        { name: "Flèche Rapide", damage: 6, manaCost: 4, icon: "fa-bullseye-arrow", color: "success" },
        { name: "Soin Divin", damage: 0, manaCost: 8, icon: "fa-hand-holding-heart", color: "danger", effect: "heal" },
        { name: "Attaque Basique", damage: 3, manaCost: 0, icon: "fa-fist-raised", color: "secondary", isBasic: true },
        { name: "Pluie de Flèches", damage: 12, manaCost: 12, icon: "fa-arrows", color: "primary" }
      ]
    },
    { 
      name: "Gandalf", 
      pv: 100, 
      pvMax: 100, 
      mana: 30, 
      manaMax: 30, 
      id: 3,
      capacities: [
        { name: "Éclair Foudroyant", damage: 7, manaCost: 6, icon: "fa-bolt", color: "warning" },
        { name: "Boule de Feu", damage: 10, manaCost: 10, icon: "fa-fire", color: "danger" },
        { name: "Attaque Basique", damage: 3, manaCost: 0, icon: "fa-fist-raised", color: "secondary", isBasic: true },
        { name: "Météore Dévastateur", damage: 20, manaCost: 20, icon: "fa-meteor", color: "dark" }
      ]
    },
    { 
      name: "JuL", 
      pv: 100, 
      pvMax: 100, 
      mana: 30, 
      manaMax: 30, 
      id: 4,
      capacities: [
        { name: "Attaque Basique", damage: 3, manaCost: 0, icon: "fa-fist-raised", color: "secondary", isBasic: true },
        { name: "Vol de Vie", damage: 8, manaCost: 8, icon: "fa-heartbeat", color: "danger", effect: "lifesteal" },
        { name: "Protection Divine", damage: 0, manaCost: 5, icon: "fa-shield-virus", color: "info", effect: "protect" },
        { name: "Folie Furieuse", damage: 18, manaCost: 18, icon: "fa-skull", color: "dark" }
      ]
    }
  ],
  monster: {
    name: "Dragon", pv: 200, pvMax: 200, strength: 15
  },
  lastAttackMissed: false,
  gameState: "playing", // "playing", "victory", "defeat"
  gameOver: false, // Nouvelle propriété pour indiquer la fin de partie
  battleLog: ["La partie commence !"],
  currentTurn: 1, // Numéro du tour actuel
  playersAttacked: [], // Liste des joueurs ayant attaqué durant ce tour
  
  // États pour gérer les effets spéciaux
  poisonEffect: 0, // Nombre de tours restants avec poison
  poisonDamage: 4, // Dégâts par tour de poison
  shieldedPlayer: null, // ID du joueur avec un bouclier actif
  protectedPlayer: null, // ID du joueur protégé
};

// Fonction utilitaire pour vérifier l'état du jeu
const checkGameState = (state) => {
  if (state.monster.pv <= 0) {
    state.gameState = "victory";
    state.gameOver = true; // Partie terminée
    state.battleLog.push(`Victoire ! Le ${state.monster.name} a été vaincu !`);
    state.battleLog.push(`🏆 VOUS AVEZ GAGNÉ ! 🏆`);
    state.battleLog.push(`Appuyez sur le bouton "Recommencer" pour jouer à nouveau.`);
    return true; // Partie terminée
  }
  
  const allPlayersDead = state.players.every(player => player.pv <= 0);
  if (allPlayersDead) {
    state.gameState = "defeat";
    state.gameOver = true; // Partie terminée
    state.battleLog.push(`Défaite ! Tous les joueurs ont été vaincus...`);
    state.battleLog.push(`☠️ VOUS AVEZ PERDU ! ☠️`);
    state.battleLog.push(`Appuyez sur le bouton "Recommencer" pour réessayer.`);
    return true; // Partie terminée
  }
  
  return false; // Partie en cours
};

// Fonction pour vérifier si tous les joueurs vivants ont joué
const allLivingPlayersHaveAttacked = (state) => {
  const livingPlayers = state.players.filter(p => p.pv > 0);
  return livingPlayers.every(player => 
    state.playersAttacked.includes(player.id)
  );
};

// Fonction pour que le monstre contre-attaque un joueur spécifique
const monsterCounterAttack = (state, targetPlayer) => {
  if (state.gameState !== "playing" || state.monster.pv <= 0 || !targetPlayer || targetPlayer.pv <= 0) {
    return;
  }
  
  // Vérifie si le joueur est protégé
  if (state.protectedPlayer === targetPlayer.id) {
    state.battleLog.push(`La protection divine empêche le ${state.monster.name} d'attaquer ${targetPlayer.name} !`);
    return;
  }
  
  // 20% de chance de rater l'attaque
  const monsterMiss = Math.random() < 0.2;
  
  if (monsterMiss) {
    state.battleLog.push(`Le ${state.monster.name} rate son attaque contre ${targetPlayer.name} !`);
    state.lastAttackMissed = true;
  } else {
    // Dégâts entre 70% et 130% de la force du monstre
    let damage = Math.floor(state.monster.strength * (Math.random() * 0.6 + 0.7));
    
    // Si le joueur a un bouclier actif, réduit les dégâts de 50%
    if (state.shieldedPlayer === targetPlayer.id) {
      const originalDamage = damage;
      damage = Math.floor(damage * 0.5);
      state.battleLog.push(`Le bouclier magique de ${targetPlayer.name} absorbe ${originalDamage - damage} points de dégâts !`);
    }
    
    targetPlayer.pv = Math.max(0, targetPlayer.pv - damage);
    state.lastAttackMissed = false;
    state.battleLog.push(`Le ${state.monster.name} inflige ${damage} dégâts à ${targetPlayer.name} !`);
    
    if (targetPlayer.pv <= 0) {
      state.battleLog.push(`${targetPlayer.name} est KO !`);
    }
  }
};

// Fonction pour que le monstre attaque un joueur aléatoire (fin de tour)
const monsterAttackRandom = (state) => {
  if (state.gameState !== "playing" || state.monster.pv <= 0) return;
  
  const livingPlayers = state.players.filter(p => p.pv > 0);
  if (livingPlayers.length === 0) return;
  
  // Filtre les joueurs protégés
  const targetablePlayers = state.protectedPlayer 
    ? livingPlayers.filter(p => p.id !== state.protectedPlayer)
    : livingPlayers;
  
  // Si tous les joueurs sont protégés, le monstre ne peut pas attaquer
  if (targetablePlayers.length === 0) {
    state.battleLog.push(`Le ${state.monster.name} ne trouve aucune cible valide à attaquer !`);
    state.lastAttackMissed = true;
    return;
  }
  
  // Choisit un joueur aléatoire pour l'attaque
  const randomIndex = Math.floor(Math.random() * targetablePlayers.length);
  const targetPlayer = targetablePlayers[randomIndex];
  
  monsterCounterAttack(state, targetPlayer);
};

// Appliquer l'effet de poison
const applyPoisonEffect = (state) => {
  if (state.poisonEffect > 0) {
    const poisonDamage = state.poisonDamage;
    state.monster.pv = Math.max(0, state.monster.pv - poisonDamage);
    state.battleLog.push(`Le poison inflige ${poisonDamage} dégâts au ${state.monster.name} !`);
    
    state.poisonEffect--;
    
    if (state.poisonEffect === 0) {
      state.battleLog.push(`L'effet de poison s'est dissipé.`);
    } else {
      state.battleLog.push(`Il reste ${state.poisonEffect} tour(s) de poison.`);
    }
    
    return checkGameState(state); // Vérifie si le poison a tué le monstre
  }
  return false;
};

// Fonction pour commencer un nouveau tour
const startNewTurn = (state) => {
  state.currentTurn++;
  state.playersAttacked = [];
  state.battleLog.push(`--- Tour ${state.currentTurn} ---`);
  
  // Réinitialiser les effets à durée limitée au début d'un nouveau tour
  state.shieldedPlayer = null;
  state.protectedPlayer = null;
  
  // Régénération de mana au début du tour
  state.players.forEach(player => {
    if (player.pv > 0) {
      const manaRegen = 2; // Régénération de base
      player.mana = Math.min(player.manaMax, player.mana + manaRegen);
      state.battleLog.push(`${player.name} récupère ${manaRegen} points de mana.`);
    }
  });
};

export const fightSlice = createSlice({
  name: "fight",
  initialState,
  reducers: {
    // Attaque normale - limitée à une fois par tour
    hitMonster: (state, action) => {
      const { playerId, damage, manaCost, effect } = action.payload;

      // Vérification si la partie est terminée
      if (state.gameState !== "playing" || state.gameOver) return;

      // Trouve le joueur par son ID
      const player = state.players.find(p => p.id === playerId);

      // Vérifie si le joueur est mort
      if (!player || player.pv <= 0) {
        state.battleLog.push(`${player?.name || "Le joueur"} ne peut plus combattre !`);
        return;
      }

      // Vérifie si le joueur a déjà attaqué ce tour
      if (state.playersAttacked.includes(playerId)) {
        state.battleLog.push(`${player.name} a déjà attaqué ce tour !`);
        return;
      }

      // Vérifie si le joueur a assez de mana
      if (player.mana < manaCost) {
        state.battleLog.push(`${player.name} n'a pas assez de mana !`);
        return;
      }

      // Consomme le mana
      player.mana -= manaCost;

      // Traitement des effets spéciaux
      if (effect === "heal") {
        // Capacité de soin
        const healAmount = damage || 10;
        player.pv = Math.min(player.pvMax, player.pv + healAmount);
        state.battleLog.push(`${player.name} se soigne de ${healAmount} PV.`);
      } 
      else if (effect === "mana") {
        // Régénération de mana
        const manaRegen = 10;
        player.mana = Math.min(player.manaMax, player.mana + manaRegen);
        state.battleLog.push(`${player.name} récupère ${manaRegen} points de mana.`);
      }
      else if (effect === "shield") {
        // Bouclier magique
        state.shieldedPlayer = playerId;
        state.battleLog.push(`${player.name} active un bouclier magique qui réduira les dégâts de 50% !`);
      }
      else if (effect === "protect") {
        // Protection divine
        state.protectedPlayer = playerId;
        state.battleLog.push(`${player.name} active une protection divine qui le rend intouchable !`);
      }
      else if (effect === "poison") {
        // Effet poison + dégâts normaux
        state.poisonEffect = 3; // Dure 3 tours
        const actualDamage = damage || 0;
        state.monster.pv = Math.max(0, state.monster.pv - actualDamage);
        state.battleLog.push(`${player.name} inflige ${actualDamage} dégâts au ${state.monster.name} et l'empoisonne pour ${state.poisonEffect} tours !`);
      }
      else if (effect === "lifesteal") {
        // Vol de vie
        const actualDamage = damage || 0;
        state.monster.pv = Math.max(0, state.monster.pv - actualDamage);
        
        const healAmount = Math.floor(actualDamage / 2);
        player.pv = Math.min(player.pvMax, player.pv + healAmount);
        
        state.battleLog.push(`${player.name} inflige ${actualDamage} dégâts au ${state.monster.name} et absorbe ${healAmount} PV !`);
      }
      else {
        // Attaque standard sans effet spécial
        const actualDamage = damage || 0;
        state.monster.pv = Math.max(0, state.monster.pv - actualDamage);
        state.battleLog.push(`${player.name} inflige ${actualDamage} dégâts au ${state.monster.name} !`);
      }

      // Ajoute le joueur à la liste des attaquants de ce tour
      state.playersAttacked.push(playerId);
      
      // Vérifie si la partie est terminée après l'attaque du joueur
      if (checkGameState(state)) return;
      
      // NOUVEAU: Contre-attaque immédiate du monstre
      state.battleLog.push(`Le ${state.monster.name} riposte immédiatement !`);
      
      // Applique d'abord l'effet poison avant la riposte
      if (applyPoisonEffect(state)) return; // Vérifie si le poison a tué le monstre
      
      // Monstre riposte contre le joueur qui vient d'attaquer
      monsterCounterAttack(state, player);
      
      // Vérifie si la partie est terminée après la riposte
      if (checkGameState(state)) return;
      
      // Si tous les joueurs vivants ont attaqué et la partie continue, passe au tour suivant
      if (allLivingPlayersHaveAttacked(state) && state.gameState === "playing") {
        startNewTurn(state);
      }
    },
    
    // Attaque de base - utilisable autant de fois que souhaité
    basicAttack: (state, action) => {
      const { playerId, damage } = action.payload;
      
      // Vérification si la partie est terminée
      if (state.gameState !== "playing" || state.gameOver) return;
      
      // Trouve le joueur par son ID
      const player = state.players.find(p => p.id === playerId);
      
      // Vérifie si le joueur est mort
      if (!player || player.pv <= 0) {
        state.battleLog.push(`${player?.name || "Le joueur"} ne peut plus combattre !`);
        return;
      }
      
      // Exécute l'attaque basique
      const actualDamage = damage || 3; // Dégâts par défaut
      state.monster.pv = Math.max(0, state.monster.pv - actualDamage);
      state.battleLog.push(`${player.name} utilise une attaque basique et inflige ${actualDamage} dégâts au ${state.monster.name} !`);
      
      // Vérifie si la partie est terminée après l'attaque
      if (checkGameState(state)) return;
      
      // Contre-attaque immédiate du monstre
      state.battleLog.push(`Le ${state.monster.name} riposte immédiatement !`);
      
      // Applique d'abord l'effet poison avant la riposte
      if (applyPoisonEffect(state)) return; // Vérifie si le poison a tué le monstre
      
      // Monstre riposte contre le joueur qui vient d'attaquer
      monsterCounterAttack(state, player);
      
      // Vérifie si la partie est terminée après la riposte
      checkGameState(state);
    },
    
    skipTurn: (state, action) => {
      const { playerId } = action.payload;
      
      if (state.gameState !== "playing" || state.gameOver) return;
      
      const player = state.players.find(p => p.id === playerId);
      
      if (!player || player.pv <= 0) {
        state.battleLog.push(`${player?.name || "Le joueur"} ne peut plus combattre !`);
        return;
      }
      
      if (state.playersAttacked.includes(playerId)) {
        state.battleLog.push(`${player.name} a déjà joué ce tour !`);
        return;
      }
      
      state.playersAttacked.push(playerId);
      state.battleLog.push(`${player.name} passe son tour.`);
      
      // Si tous les joueurs vivants ont joué
      if (allLivingPlayersHaveAttacked(state) && state.gameState === "playing") {
        startNewTurn(state);
      }
    },
    
    resetGame: (state) => {
      // Réinitialise les joueurs
      state.players.forEach(player => {
        player.pv = player.pvMax;
        player.mana = player.manaMax;
      });
      
      // Réinitialise le monstre
      state.monster.pv = state.monster.pvMax;
      
      // Réinitialise l'état du jeu
      state.gameState = "playing";
      state.gameOver = false; 
      state.lastAttackMissed = false;
      state.currentTurn = 1;
      state.playersAttacked = [];
      state.poisonEffect = 0;
      state.shieldedPlayer = null;
      state.protectedPlayer = null;
      state.battleLog = ["--- Tour 1 ---", "La partie commence !"];
    }
  }
});

export const { hitMonster, skipTurn, resetGame, basicAttack } = fightSlice.actions;

export default fightSlice.reducer;