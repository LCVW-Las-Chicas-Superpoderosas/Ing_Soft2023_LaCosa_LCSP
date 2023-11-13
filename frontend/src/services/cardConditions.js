/* returns true if card can be played */
const isValidCard = (cardToken) => {
	const cardName = getCardName(cardToken);
	return cardName !== 'infectado' && cardName !== 'la cosa';
};

export default isValidCard;

/* returns true if card requires a target to be selected in order to be played */
export const requiresTarget = (cardToken) => {
	const cardName = getCardName(cardToken);
	return cardName === 'lanzallamas' || cardName === 'cambio de lugar';
};

/* Get a card's name from a token
   ! Van solo listadas las cartas implementadas y las de infección
*/
const getCardName = (cardToken) => {
	const cardID = parseInt(String(cardToken).match(/\d+/));

	switch (true) {
		case cardID === 1:
			return 'la cosa';

		case cardID >= 2 && cardID <= 21:
			return 'infectado';

		case cardID >= 22 && cardID <= 26:
			return 'lanzallamas';

		case cardID >= 27 && cardID <= 29:
			return 'analisis';

		case cardID >= 30 && cardID <= 31:
			return 'hacha';

		case cardID >= 32 && cardID <= 39:
			return 'sospecha';

		case cardID >= 40 && cardID <= 42:
			return 'whisky';

		case cardID >= 43 && cardID <= 47:
			return 'determinacion';

		case cardID >= 48 && cardID <= 49:
			return 'vigila tus espaldas';

		case cardID >= 50 && cardID <= 54:
			return 'cambio de lugar';

		case cardID >= 55 && cardID <= 59:
			return 'mas vale que corras';

		case cardID >= 60 && cardID <= 66:
			return 'seduccion';

		case cardID >= 67 && cardID <= 70:
			return 'aterrador';

		case cardID >= 71 && cardID <= 73:
			return 'aqui estoy bien';

		case cardID >= 74 && cardID <= 77:
			return 'no, gracias';

		case cardID >= 78 && cardID <= 80:
			return 'fallaste';

		case cardID >= 81 && cardID <= 83:
			return 'nada de barbacoas';

		case cardID >= 84 && cardID <= 85:
			return 'cuarentena';

		case cardID >= 86 && cardID <= 88:
			return 'puerta atrancada';

		default:
			return null;
	}
};
