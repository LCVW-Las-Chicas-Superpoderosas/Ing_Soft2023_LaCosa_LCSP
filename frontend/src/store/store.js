import {configureStore} from '@reduxjs/toolkit';
import playerReducer from '../playerSlice.js';
import handReducer from '../services/handSlice.js';
import playAreaReducer from '../services/playAreaSlice.js';
import gameReducer from '../services/gameSlice.js';
import lobbyReducer from '../services/lobbySlice.js';

// configuracion de los estados y sus reducers
const store = configureStore({
	reducer: {
		player: playerReducer,
		hand: handReducer,
		playArea: playAreaReducer,
		lobby: lobbyReducer,
		game: gameReducer,
	},
	devTools: true,
});

export default store;
