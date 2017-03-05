import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);

import needle from 'needle';

import getImagesWithoutThumbs from '../../lib/modules/getImagesWithoutThumbs';

import mocks from '../mocks';

function mockNeedleGet (err, res) {
	sinon.stub(needle, 'get', (url, options, callback) => {
		callback(err, res);
	});
}

describe('getImagesWithoutThumbs', () => {
	it('should be a function', () => {
		expect(getImagesWithoutThumbs).to.be.a('function');
	});

	describe('when called', () => {
		const callback = sinon.spy();
		const args = {
			limit: 0,
			pmpApiUrl: '',
			request: mocks.request
		};

		afterEach(() => {
			callback.reset();
			needle.get.restore();
		});

		it('should return an error: generic', () => {
			const fakeError = new Error('fake');

			mockNeedleGet(fakeError);

			getImagesWithoutThumbs(args, callback);

			expect(callback).to.have.been.calledWith(fakeError);
		});

		it('should return an error: invalid response', () => {
			const responseError = new Error('response is invalid');

			mockNeedleGet(null, {});

			getImagesWithoutThumbs(args, callback);

			expect(callback).to.have.been.calledWith(responseError);
		});

		it('should return an error: no more images without palette', () => {
			const noImagesError = new Error('no more images without thumbs');

			mockNeedleGet(null, {
				body: []
			});

			getImagesWithoutThumbs(args, callback);

			expect(callback).to.have.been.calledWith(noImagesError);
		});

		it('should return the response body', () => {
			mockNeedleGet(null, {
				body: ['test']
			});

			getImagesWithoutThumbs(args, callback);

			expect(callback).to.have.been.calledWith(null, {
				images: ['test']
			});
		});
	});
});
