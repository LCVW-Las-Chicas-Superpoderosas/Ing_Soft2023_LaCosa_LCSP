import React from 'react';
import ReactDOM from 'react-dom/client';
import {Provider} from 'react-redux';
import store from './store/store.js';

import Deck from './components/Deck/Deck.jsx';
import Hand from './components/Hand/Hand.jsx';

import {worker} from './mocks/worker.js';
import PlayArea from './components/PlayArea/PlayArea.jsx';
worker.start();

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<Provider store={store}>
			<div className='top-section'>
				<Deck />
				<PlayArea />
			</div>
			<Hand />
		</Provider>
	</React.StrictMode>,
);
