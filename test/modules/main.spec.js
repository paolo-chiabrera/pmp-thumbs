import { expect } from 'chai';

import main from '../../lib/modules/main';

describe('main', () => {
	it('should be an object', () => {
		expect(main).to.be.an('object');
	});

	it('should expose generateImagesThumbsByLimit', () => {
		expect(main.generateImagesThumbsByLimit).to.be.a('function');
	});

	it('should expose generateImageThumbs', () => {
		expect(main.generateImageThumbs).to.be.a('function');
	});

	it('should expose getImagesThumbs', () => {
		expect(main.getImagesThumbs).to.be.a('function');
	});

	it('should expose getImagesWithoutThumbs', () => {
		expect(main.getImagesWithoutThumbs).to.be.a('function');
	});

	it('should expose saveImagesThumbs', () => {
		expect(main.saveImagesThumbs).to.be.a('function');
	});
});
