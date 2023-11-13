import '@testing-library/jest-dom';
import {fireEvent, screen, waitFor} from '@testing-library/react';
import 'jest-localstorage-mock';
import {renderWithProviders} from '../../services/providerForTest/utils-for-tests';
// eslint-disable-next-line no-unused-vars
import React from 'react';
import {mockStore} from '../../store/mockStore';
import CardModal from './CardModal';

const initialMiliSeconds = 5000;

describe('CardModal component', () => {
	it('should show the image passed as props correctly', async () => {
		const initialState = {
			...mockStore,
			game: {
				...mockStore.game,
				cardModalIsOpen: true,
			},
		};

		renderWithProviders(
			<CardModal revealedcard={{id: '0', token: 'img22.jpg', type: 1}} />,
			{
				preloadedState: initialState,
			},
		);

		await waitFor(() => {
			const card = screen.getByTestId('card-image');
			expect(card).toHaveAttribute(
				'src',
				`http://localhost:5173/src/assets/cards/img22.jpg`,
			);
		});
	});

	it('should close the modal after the specified time', () => {
		const initialState = {
			...mockStore,
			game: {
				...mockStore.game,
				cardModalIsOpen: true,
			},
		};

		// eslint-disable-next-line no-unused-vars
		const {store, _rtl} = renderWithProviders(
			<CardModal revealedcard={{id: '0', token: 'img22.jpg', type: 1}} />,
			{
				preloadedState: initialState,
			},
		);

		expect(screen.getByTestId('card-modal')).toBeInTheDocument();

		setTimeout(() => {
			const state = store.getState();
			expect(screen.queryByTestId('card-modal')).toBeNull();
			expect(state.game.cardModalIsOpen).toBe(false);
		}, initialMiliSeconds + 1000);
	});

	it('should close the modal when the close button is clicked', async () => {
		const initialState = {
			...mockStore,
			game: {
				...mockStore.game,
				cardModalIsOpen: true,
			},
		};

		// eslint-disable-next-line no-unused-vars
		const {store, _rtl} = renderWithProviders(
			<CardModal revealedcard={{id: '0', token: 'img22.jpg', type: 1}} />,
			{
				preloadedState: initialState,
			},
		);

		expect(screen.getByTestId('card-modal')).toBeInTheDocument();
		const closeModalButton = screen.getByTestId('close-card-modal-button');

		fireEvent.click(closeModalButton);
		await waitFor(() => {
			const state = store.getState();
			expect(screen.queryByTestId('card-modal')).toBeNull();
			expect(state.game.cardModalIsOpen).toBe(false);
		});
	});
});
