import {createSlice} from '@reduxjs/toolkit';

const initialState = {
	card: null, // objeto de la forma {card, target}
	response: 'initial state', // JSON que guarda la respuesta del back parseada
};

const playAreaSlice = createSlice({
	name: 'playArea',
	initialState,
	reducers: {
		addToPlayArea: (state, action) => {
			state.card = action.payload;
		},
		cleanPlayArea: (state) => {
			state.card = null;
		},
		saveResponse: (state, action) => {
			state.response = action.payload;
		},
	},
});

export const {addToPlayArea, cleanPlayArea, saveResponse} =
	playAreaSlice.actions;
export default playAreaSlice.reducer;
