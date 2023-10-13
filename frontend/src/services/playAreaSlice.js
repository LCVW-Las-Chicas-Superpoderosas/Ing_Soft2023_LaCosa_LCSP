import {createSlice} from '@reduxjs/toolkit';

const initialState = {
	card: '',
};

const playAreaSlice = createSlice({
	name: 'playArea',
	initialState,
	reducers: {
		addToPlayArea: (state, action) => {
			state.card = action.payload;
		},
		cleanPlayArea: (state) => {
			state.card = '';
		},
	},
});

export const {addToPlayArea, cleanPlayArea} = playAreaSlice.actions;
export default playAreaSlice.reducer;
