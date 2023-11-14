import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import {Provider} from 'react-redux';
import store from './store/store.js';

import {ChakraProvider, extendTheme} from '@chakra-ui/react';

// import {worker} from './mocks/worker.js';
// worker.start();

const theme = extendTheme({
	styles: {
		global: {
			body: {
				bgGradient: 'linear(to-r, whatsapp.800,black,whatsapp.800)',
			},
		},
	},
});

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<Provider store={store}>
			<ChakraProvider theme={theme}>
				<App />
			</ChakraProvider>
		</Provider>
	</React.StrictMode>,
);
