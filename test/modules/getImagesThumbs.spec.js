import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);

import main from '../../lib/modules/main';

import getImagesThumbs from '../../lib/modules/getImagesThumbs';

import mocks from '../mocks';

describe('getImagesThumbs', () => {
	it('should be a function', () => {
		expect(getImagesThumbs).to.be.a('function');
	});

	describe('when called', () => {
		const callback = sinon.spy();
		const args = {
			folderPath: '',
			images: mocks.images
		};

		afterEach(() => {
			callback.reset();
		});

		it('should return an error: generic', () => {
			const fakeError = new Error('fake');

			const generateImageThumbsStub = sinon.stub(main, 'generateImageThumbs', (args, next) => {
				next(fakeError.message);
			});

			const EXPECTED = {
				fail: [
					{
						filename: mocks.images[0].filename,
						error: fakeError.message
					}
				],
				success: []
			};

			getImagesThumbs(args, callback);

			expect(callback).to.have.been.calledWith(null, EXPECTED);

			generateImageThumbsStub.restore();
		});

		it('should return the images palette', () => {
			const response = {
				filename: mocks.images[0].filename,
				meta: mocks.metadata,
				dimensions: mocks.dimensions
			};

			const generateImageThumbsStub = sinon.stub(main, 'generateImageThumbs', (args, next) => {
				next(null, response);
			});

			const EXPECTED = {
				fail: [],
				success: [{
					data: {
						meta: response.meta,
						thumbs: response.dimensions
					},
					filename: response.filename
				}]
			};

			getImagesThumbs(args, callback);

			expect(generateImageThumbsStub).to.have.been.calledOnce;
			expect(callback).to.have.been.calledWith(null, EXPECTED);
		});
	});
});
