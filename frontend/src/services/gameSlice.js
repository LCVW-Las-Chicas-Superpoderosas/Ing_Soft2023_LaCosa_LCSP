import {createSlice} from '@reduxjs/toolkit';

const initialState = {
	players: [],
	position: 0,
	isFinish: 1,
	currentPlayer: 0,
	nextPlayerId: 0,
	underAttack: false,
};

const gameSlice = createSlice({
	name: 'game',
	initialState,
	reducers: {
		setPlayers: (state, action) => {
			state.players = action.payload;
		},
		setPosition: (state, action) => {
			state.position = action.payload;
		},
		setIsFinish: (state, action) => {
			state.isFinish = action.payload;
		},
		setCurrentPlayer: (state, action) => {
			state.currentPlayer = action.payload;
		},
		setNextPlayerId: (state, action) => {
			state.nextPlayerId = action.payload;
		},
		setUnderAttack: (state, action) => {
			state.underAttack = action.payload;
		},
	},
});

export const {
	setPlayers,
	setPosition,
	setIsFinish,
	setCurrentPlayer,
	setFirstDeckCardBack,
	setNextPlayerId,
	setUnderAttack,
} = gameSlice.actions;
export default gameSlice.reducer;
