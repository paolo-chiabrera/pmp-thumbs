import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);

import async from 'async';
import fs from 'fs';
import sharp from 'sharp';

import generateImageThumbs from '../../lib/modules/generateImageThumbs';

import mocks from '../mocks';

describe('generateImageThumbs', () => {
	it('should be a function', () => {
		expect(generateImageThumbs).to.be.a('function');
	});

	describe('when called', () => {
		const fakeError = new Error('fakeError');
		const { dimensions, filename, folderPath, metadata } = mocks;

		it('should return an error: sharp.metadata', sinon.test(function (done) {
			const metadataStub = this.stub(sharp.prototype, 'metadata', (callback) => {
				callback(fakeError);
			});

			const cb = this.spy(err => {
				expect(err).to.eql(fakeError);
				expect(metadataStub).to.have.been.calledOnce;

				metadataStub.restore();
				done();
			});

			generateImageThumbs({
				filename,
				folderPath
			}, cb);
		}));

		it('should return an error: async.eachSeries', sinon.test(function (done) {
			const metadataStub = this.stub(sharp.prototype, 'metadata', (callback) => {
				callback(null, metadata);
			});
			const eachSeries = this.stub(async, 'eachSeries', (list, worker, callback) => {
				callback(fakeError);
			});

			const cb = this.spy(err => {
				expect(err).to.eql(fakeError);
				expect(metadataStub).to.have.been.calledOnce;
				expect(eachSeries).to.have.been.calledOnce;

				metadataStub.restore();
				eachSeries.restore();
				done();
			});

			generateImageThumbs({
				filename,
				folderPath
			}, cb);
		}));

		it('should return an error: sharp.toFile', sinon.test(function (done) {
			const metadataStub = this.stub(sharp.prototype, 'metadata', (callback) => {
				callback(null, metadata);
			});
			const qualityStub = this.stub(sharp.prototype, 'quality', () => {
				return {
					resize: resizeStub
				};
			});
			const resizeStub = sinon.spy(() => {
				return {
					toFile: toFileStub
				};
			});
			const toFileStub = sinon.spy((path, next) => next(fakeError));

			const cb = this.spy(err => {
				expect(err).to.eql(fakeError);
				expect(metadataStub).to.have.been.calledOnce;
				expect(qualityStub).to.have.been.calledOnce;
				expect(resizeStub).to.have.been.calledOnce;
				expect(toFileStub).to.have.been.calledOnce;

				metadataStub.restore();
				qualityStub.restore();

				done();
			});

			generateImageThumbs({
				filename,
				folderPath
			}, cb);
		}));

		it('should return filename, meta and dimensions', sinon.test(function (done) {
			const metadataStub = this.stub(sharp.prototype, 'metadata', (callback) => {
				callback(null, metadata);
			});
			const eachSeries = this.stub(async, 'eachSeries', (list, worker, callback) => {
				callback(null);
			});
			const statSync = this.stub(fs, 'statSync', () => {
				return metadata;
			});

			const cb = this.spy((err, results) => {
				expect(err).to.be.null;
				expect(metadataStub).to.have.been.calledOnce;
				expect(eachSeries).to.have.been.calledOnce;
				expect(statSync).to.have.been.calledOnce;
				expect(results).deep.equal({
					filename,
					meta: metadata,
					dimensions
				});

				metadataStub.restore();
				eachSeries.restore();
				done();
			});

			generateImageThumbs({
				filename,
				folderPath
			}, cb);
		}));
	});
});
