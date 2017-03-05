import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);

import pmpThumbs, { generateImagesThumbs } from '../lib/index';

import main from '../lib/modules/main';

import mocks from './mocks';

function mockGenerateImagesThumbsByLimit (err, res) {
	sinon.stub(main, 'generateImagesThumbsByLimit')
	.onFirstCall().callsArgWithAsync(1, err, res)
	.onSecondCall().callsArgWithAsync(1, true);
}

describe('pmpThumbs', () => {
	it('should be an object', () => {
		expect(pmpThumbs).to.be.an('object');
	});

	describe('generateImagesThumbs', () => {
		it('should be a function', () => {
			expect(generateImagesThumbs).to.be.a('function');
		});

		describe('when called', () => {
			const onProgress = sinon.spy();
			const args = {
				folderPath: '',
				limit: 10,
				onProgress,
				pmpApiUrl: '',
				request: mocks.request
			};

			afterEach(() => {
				onProgress.reset();
				main.generateImagesThumbsByLimit.restore();
			});

			it('should return an error: generic', sinon.test((done) => {
				const fakeError = new Error('fake');

				mockGenerateImagesThumbsByLimit(fakeError);

				generateImagesThumbs(args, err => {
					expect(err).to.equal(fakeError);
					done();
				});
			}));

			it('should stop when there are no more images without palette', sinon.test((done) => {
				const fakeError = new Error('no more images without thumbs');

				mockGenerateImagesThumbsByLimit(fakeError);

				generateImagesThumbs(args, (err, report) => {
					expect(err).to.be.null;
					expect(report).to.deep.equal({
						fail: 0,
						success: 0
					});
					done();
				});
			}));

			it('should call onProgress', sinon.test((done) => {
				const results = {
					saveImagesThumbs: {
						fail: [0, 1],
						success: [0, 1, 2]
					}
				};

				mockGenerateImagesThumbsByLimit(null, results);

				generateImagesThumbs(args, () => {
					expect(onProgress).to.have.been.calledWith({
						fail: 2,
						success: 3
					});

					done();
				});
			}));
		});
	});
});
