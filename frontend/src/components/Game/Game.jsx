import './Game.css';

import Deck from '../Deck/Deck.jsx';
import Hand from '../Hand/Hand.jsx';
import PlayArea from '../PlayArea/PlayArea';

const Game = () => {
	return (
		<>
			<div className='top-section'>
				<Deck /> <PlayArea />
			</div>

			<Hand />
		</>
	);
};

export default Game;
