import {createSlice} from '@reduxjs/toolkit';

// Estado inicial para player
const initialState = {
	name: '',
	id: 0,
	loged: false,
};

// Cambios de estado para player
const playerSlice = createSlice({
	name: 'player',
	initialState,
	reducers: {
		setName: (state, action) => {
			state.name = action.payload;
		},
		setId: (state, action) => {
			state.id = action.payload;
		},
		setLogedIn: (state, action) => {
			state.loged = action.payload;
		},
	},
});

export const {setName, setId, setLogedIn} = playerSlice.actions;
export default playerSlice.reducer;
