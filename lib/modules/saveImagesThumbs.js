import { put } from 'needle';
import { isObject, noop } from 'lodash';

export default function saveImagesThumbs (args, done = noop) {
	const { payload, pmpApiUrl, request } = args;

	const options = {
		headers: request.headers,
		json: true
	};

	const url = `${ pmpApiUrl }/images/batch`;

	put(url, payload, options, (err, res) => {
		if (err) {
			return done(err);
		}

		if (!isObject(res) || !res.body) {
			return done(new Error('res is invalid'));
		}

		done(null, res.body);
	});
}
