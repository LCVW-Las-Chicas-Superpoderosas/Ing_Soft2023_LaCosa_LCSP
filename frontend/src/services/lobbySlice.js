import {createSlice} from '@reduxjs/toolkit';

// Estado inicial para player
const initialState = {
	players: [],
	canStart: false,
};
// { players: [user_name: str, id_player: int is_host:bool], can_start : bool } }
// Cambios de estado para player
const lobbySlice = createSlice({
	name: 'game',
	initialState,
	reducers: {
		setLobby: (state, action) => {
			state.players = action.payload;
		},
		appendToLobby: (state, action) => {
			// Append the new card to the existing array of cards
			state.players = [...state.players, ...action.payload];
		},
		setCanStart: (state, action) => {
			state.canStart = action.payload;
		},
	},
});

// Action creators are generated for each case reducer funcion
export const {setLobby, appendToLobby, setCanStart} = lobbySlice.actions;
// return de reducer for game
export default lobbySlice.reducer;
