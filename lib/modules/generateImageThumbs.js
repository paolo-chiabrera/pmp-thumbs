import async from 'async';
import { noop } from 'lodash';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const DEFULAT_DIMENSIONS = [150, 300];

export default function generateImageThumbs (args, done = noop) {
	const {
		dimensions = DEFULAT_DIMENSIONS,
		filename,
		folderPath
	} = args;

	const filePath = path.resolve(folderPath, filename);

	const parsed = path.parse(filePath);

	const image = sharp(filePath);

	image.metadata((err, metadata) => {
		if (err) {
			return done(err);
		}

		const { format, height, width } = metadata;

		async.eachSeries(dimensions, (dim, next) => {
			const { ext, name } = parsed;

			const thumbFilename = `${ name }_${ dim }${ ext }`;

			const thumbFilePath = path.resolve(folderPath, thumbFilename);

			image
			.quality(90)
			.resize(dim)
			.toFile(thumbFilePath, next);
		}, err => {
			if (err) {
				return done(err);
			}

			const { size } = fs.statSync(filePath);

			done(null, {
				filename,
				meta: {
					format,
					height,
					size,
					width
				},
				dimensions
			})
		});
	});
}
