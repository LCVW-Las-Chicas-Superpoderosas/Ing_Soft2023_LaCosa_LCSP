import PropTypes from 'prop-types';
import './Card.css';

const Card = ({onClick, token}) => {
	return (
		<button className='card-button'>
			<img
				className='card-image'
				src={`http://localhost:5173/src/assets/cards/${token}.jpg`}
				alt='card'
				onClick={onClick}
			/>
		</button>
	);
};

Card.propTypes = {
	token: PropTypes.string.isRequired,
	onClick: PropTypes.func,
};

export default Card;
