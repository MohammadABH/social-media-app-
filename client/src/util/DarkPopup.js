import React from 'react';
import { Popup } from 'semantic-ui-react';

function DarkPopup({ content, children, ...rest }) {
	return (
		<Popup inverted content={content} trigger={children} {...rest} />
	);
}

export default DarkPopup;