import {createSlice} from '@reduxjs/toolkit';

const initialState = {
	card: null, // objeto de la forma {card, target}
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
	},
});

export const {addToPlayArea, cleanPlayArea} = playAreaSlice.actions;
export default playAreaSlice.reducer;
