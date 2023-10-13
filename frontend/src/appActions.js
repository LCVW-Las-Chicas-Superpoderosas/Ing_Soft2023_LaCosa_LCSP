import {createAction} from '@reduxjs/toolkit';

// Player actions
export const setPlayerName = createAction('player/setName');
export const setPlayerId = createAction('player/setId');
export const setPlayerLogedIn = createAction('player/setLogedIn');
// Hand actions
export const setHand = createAction('hand/setHand');
export const appendToHand = createAction('hand/appendToHand');
export const removeFromHand = createAction('hand/removeFromHand');
// Play Area actions
export const addToPlayArea = createAction('playArea/addToPlayArea');
export const cleanPlayArea = createAction('playArea/cleanPlayArea');
// Loby actions
export const setLobby = createAction('lobby/setLobby');
export const appendToLobby = createAction('lobby/appendToLobby');
export const setCanStart = createAction('lobby/setCanStart');
// In game actions
export const setPlayerInGame = createAction('game/setPlayers');
export const setPositionInGame = createAction('game/setPosition');
export const setRolInGame = createAction('game/setRol');
