// Example using Jest and React Testing Library
// eslint-disable-next-line no-unused-vars
import React from 'react';
import {render} from '@testing-library/react';
import Card from './Card';

describe('Card component', () => {
	it('should render image with correct source', () => {
		const {getByAltText} = render(<Card token={'img22'} />);

		// Assert that the image source is correct
		expect(getByAltText('card').src).toContain(`/src/assets/cards/img22.jpg`);
	});
});
