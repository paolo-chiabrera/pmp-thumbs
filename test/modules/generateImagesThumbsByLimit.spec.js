import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);

import generateImagesThumbsByLimit from '../../lib/modules/generateImagesThumbsByLimit';

import main from '../../lib/modules/main';

import mocks from '../mocks';

describe('generateImagesThumbsByLimit', () => {
	it('should be a function', () => {
		expect(generateImagesThumbsByLimit).to.be.a('function');
	});

	describe('when called', () => {
		const callback = sinon.spy();
		const args = {
			folderPath: '',
			pmpApiUrl: '',
			request: mocks.request
		};

		const RESULTS = {
			getImagesWithoutThumbs: {
				images: []
			},
			getImagesThumbs: {},
			saveImagesThumbs: {}
		};

		beforeEach(() => {
			sinon.stub(main, 'getImagesThumbs', (args, callback) => {
				callback(null, RESULTS.getImagesThumbs);
			});
			sinon.stub(main, 'saveImagesThumbs', (args, callback) => {
				callback(null, RESULTS.saveImagesThumbs);
			});
			sinon.stub(main, 'getImagesWithoutThumbs', (args, callback) => {
				callback(null, RESULTS.getImagesWithoutThumbs);
			});
		});

		afterEach(() => {
			callback.reset();
			main.getImagesThumbs.restore();
			main.saveImagesThumbs.restore();
			main.getImagesWithoutThumbs.restore();
		});

		it('should return an error: getImagesWithoutThumbs', () => {
			const fakeError = new Error('fake');

			main.getImagesWithoutThumbs.restore();
			sinon.stub(main, 'getImagesWithoutThumbs', (args, callback) => {
				callback(fakeError);
			});

			generateImagesThumbsByLimit(args, callback);

			expect(callback).to.have.been.calledWith(fakeError);
		});

		it('should return the results', () => {
			generateImagesThumbsByLimit(args, callback);

			expect(callback).to.have.been.calledWith(null, RESULTS);
		});
	});
});
