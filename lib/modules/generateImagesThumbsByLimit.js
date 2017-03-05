import { auto } from 'async';
import { noop } from 'lodash';

import main from './main';

const IMAGES_NUMBER_LIMIT = 20;

const THUMBS_DIMENSIONS = [150, 300];

export default function generateImagesThumbsByLimit (args, done = noop) {
	const {
		dimensions = THUMBS_DIMENSIONS,
		folderPath,
		limit = IMAGES_NUMBER_LIMIT,
		pmpApiUrl,
		request
	} = args;

	auto({
		getImagesWithoutThumbs: next => {
			main.getImagesWithoutThumbs({
				limit,
				pmpApiUrl,
				request
			}, next);
		},
		getImagesThumbs: ['getImagesWithoutThumbs', (results, next) => {
			const { images } = results.getImagesWithoutThumbs;

			main.getImagesThumbs({
				dimensions,
				folderPath,
				images
			}, next);
		}],
		saveImagesThumbs: ['getImagesThumbs', (results, next) => {
			const { success } = results.getImagesThumbs;

			main.saveImagesThumbs({
				payload: success,
				pmpApiUrl,
				request
			}, next);
		}]
	}, done);
}
