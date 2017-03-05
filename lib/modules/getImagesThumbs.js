import async from 'async';
import { noop } from 'lodash';

import main from './main';

const DEFAULT_CONCURRENCY = 2;

export default function getImagesThumbs (args, done = noop) {
	const {
		concurrency = DEFAULT_CONCURRENCY,
		dimensions,
		folderPath,
		images
	} = args;

	const results = {
		fail: [],
		success: []
	};

	async.eachLimit(images, concurrency, (image, next) => {
		const { filename } = image;

		main.generateImageThumbs({
			dimensions,
			folderPath,
			filename
		}, (error, res) => {
			if (error) {
				results.fail.push({
					filename,
					error
				})
			} else {
				const { dimensions, meta } = res;

				results.success.push({
					data: {
						meta,
						thumbs: dimensions
					},
					filename
				});
			}

			next(null);
		});
	}, () => done(null, results));
}
