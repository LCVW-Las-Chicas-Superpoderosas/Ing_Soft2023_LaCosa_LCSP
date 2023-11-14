import {createAction} from '@reduxjs/toolkit';

// Hand actions
export const setHand = createAction('hand/setHand');
export const appendToHand = createAction('hand/appendToHand');
export const removeFromHand = createAction('hand/removeFromHand');
export const selectCard = createAction('hand/selectCard');
export const cleanSelectedCard = createAction('hand/cleanSelectedCard');
export const setInfectionCardUUID = createAction('hand/setInfectionCardUUID');
// Turn actions
export const setAlreadyPlayed = createAction('hand/setAlreadyPlayed');
export const setAlreadyPicked = createAction('hand/setAlreadyPicked');
export const restoreTurnConditions = createAction('hand/restoreTurnConditions');
// Play Area actions
export const addToPlayArea = createAction('playArea/addToPlayArea');
export const cleanPlayArea = createAction('playArea/cleanPlayArea');
export const saveResponse = createAction('playArea/saveResponse');
// Discard Pile actions
export const addToDiscardPile = createAction('discardPile/addToDiscardPile');
export const cleanDiscardPile = createAction('discardPile/cleanDiscardPile');
// Loby actions
export const setLobby = createAction('lobby/setLobby');
export const appendToLobby = createAction('lobby/appendToLobby');
export const setCanStart = createAction('lobby/setCanStart');
// In game actions
export const setPlayerInGame = createAction('game/setPlayers');
export const setPositionInGame = createAction('game/setPosition');
export const setIsFinish = createAction('game/setIsFinish');
export const setCurrentPlayerInGame = createAction('game/setCurrentPlayer');
export const setFirstDeckCardBack = createAction('game/setFirstDeckCardBack');
export const setUnderAttack = createAction('game/setUnderAttack');
export const setNextPlayerId = createAction('game/setNextPlayerId');
