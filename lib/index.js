import { forever } from 'async';
import { noop } from 'lodash';

import main from './modules/main';

function generateImagesThumbs (args, done = noop) {
	const {
		dimensions,
		folderPath,
		limit,
		onProgress = noop,
		pmpApiUrl,
		request
	} = args;

	const report = {
		fail: 0,
		success: 0
	};

	forever(next => {
		main.generateImagesThumbsByLimit({
			dimensions,
			folderPath,
			limit,
			pmpApiUrl,
			request
		}, (err, results) => {
			if (err) {
				return next(err);
			}

			const { fail, success } = results.saveImagesThumbs;

			report.fail += fail.length;
			report.success += success.length;

			onProgress(report);

			next(null);
		});
	}, err => {
		if (!err || err.message === 'no more images without thumbs') {
			return done(null, report);
		}

		done(err);
	});
}

export default {
	generateImagesThumbs
};
