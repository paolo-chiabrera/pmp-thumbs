import { get } from 'needle';
import { isArray, isEmpty, isObject, noop } from 'lodash';

export default function getImagesWithoutThumbs (args, done = noop) {
	const { limit, pmpApiUrl, request } = args;

	const options = {
		headers: request.headers
	};

	const url = `${ pmpApiUrl }/images/without/thumbs/${ limit }`;

	get(url, options, (err, res) => {
		if (err) {
			return done(err);
		}

		if (!isObject(res) || !isArray(res.body)) {
			return done(new Error('response is invalid'));
		}

		const images = res.body;

		if (isEmpty(images)) {
			return done(new Error('no more images without thumbs'));
		}

		done(null, {
			images
		});
	});
}
