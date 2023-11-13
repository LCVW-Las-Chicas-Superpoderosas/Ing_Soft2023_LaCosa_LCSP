import {createSlice} from '@reduxjs/toolkit';

const initialState = {
	players: [],
	position: 0,
	isFinish: 1,
	currentPlayer: 0,
	firstDeckCardBack: -1,
	nextPlayerId: 0,
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
		setFirstDeckCardBack: (state, action) => {
			state.firstDeckCardBack = action.payload;
		},
		setNextPlayerId: (state, action) => {
			state.nextPlayerId = action.payload;
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
} = gameSlice.actions;
export default gameSlice.reducer;
