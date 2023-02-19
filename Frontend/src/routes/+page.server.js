import fs, { readdirSync } from 'fs';

export async function load({ params }) {
	let images = [];

	fs,
		readdirSync('../images').forEach((file) => {
			if (file.endsWith('.png')) images.push(file);
		});
	return {
		images
	};
}
