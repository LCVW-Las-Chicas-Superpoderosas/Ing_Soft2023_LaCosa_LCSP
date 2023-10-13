// eslint-disable-next-line no-unused-vars
import React from 'react';
import {render} from '@testing-library/react';
import {configureStore} from '@reduxjs/toolkit';
import {Provider} from 'react-redux';
// As a basic setup, import your same slice reducers
import gameReducer from '../gameSlice';
import handReducer from '../handSlice';
import lobbyReducer from '../lobbySlice';
import playerReducer from '../../playerSlice';
import {BrowserRouter} from 'react-router-dom';
import PropTypes from 'prop-types';

export function renderWithProviders(
	ui,
	{
		preloadedState = {},
		// Automatically create a store instance if no store was passed in

		store = configureStore({
			reducer: {
				player: playerReducer,
				hand: handReducer,
				lobby: lobbyReducer,
				game: gameReducer,
			},
			preloadedState,
			// devTools: true,
		}),
		...renderOptions
	} = {},
) {
	function Wrapper({children}) {
		Wrapper.propTypes = {
			children: PropTypes.element.isRequired,
		};

		return (
			<BrowserRouter>
				<Provider store={store}>{children}</Provider>
			</BrowserRouter>
		);
	}

	// Return an object with the store and all of RTL's query functions
	// return {store, ...render(ui, {wrapper: Wrapper, ...renderOptions})};
	return {...render(ui, {wrapper: Wrapper, ...renderOptions})};
}

// here i want to add the propType for the children
