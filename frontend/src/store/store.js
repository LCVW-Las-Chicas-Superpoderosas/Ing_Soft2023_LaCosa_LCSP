import {configureStore} from '@reduxjs/toolkit';
import playerReducer from '../playerSlice.js';
import handReducer from '../services/handSlice.js';

// configuracion de los estados y sus reducers
const store = configureStore({
	reducer: {
		player: playerReducer,
		hand: handReducer,
	},
	devTools: true,
});

export default store;
