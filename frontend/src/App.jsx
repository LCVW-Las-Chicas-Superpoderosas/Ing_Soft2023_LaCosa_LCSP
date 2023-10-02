// import {useState} from 'react';
// import reactLogo from './assets/react.svg';
// import viteLogo from '../../../../../../../vite.svg';
import {useSelector} from 'react-redux';
import './App.css';
import UserForm from './components/UserForm/UserForm.jsx';
import {BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import CreateGameForm from './components/CreateGameForm/CreateGameForm.jsx';
import ListarPartidas from './components/ListarPartidas/ListarPartidas';
import Game from './components/Game/Game.jsx';
import Lobby from './components/Lobby/Lobby';

function App() {
	return (
		<BrowserRouter>
			<div>
				<Link to='/'></Link>
			</div>

			<Routes>
				<Route path='/' element={<UserForm />} />
				<Route path='/CreateGame' element={<CreateGameForm />} />
				<Route path='/Games' element={<ListarPartidas />} />
				<Route path='/Games/Partida-Inicial' element={<Lobby />} />
				<Route path='/Games/Partida-Inicial/play' element={<Game />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
