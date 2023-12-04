import type { IconizzaIcon } from '@iconizza/types';
import { mergeIconData } from '../lib/icon/merge';

describe('Testing merging icon data', () => {
	test('Nothing to merge', () => {
		const icon: IconizzaIcon = {
			body: '<g />',
		};
		const expected: IconizzaIcon = {
			body: '<g />',
		};
		// Check hint manually: supposed to be IconizzaIcon
		const result = mergeIconData(icon, {});
		expect(result).toEqual(expected);
	});

	test('Full icons', () => {
		const icon: Required<IconizzaIcon> = {
			body: '<g />',
			width: 24,
			height: 24,
			left: 0,
			top: 0,
			rotate: 0,
			hFlip: false,
			vFlip: false,
		};
		const expected: Required<IconizzaIcon> = {
			body: '<g />',
			width: 24,
			height: 24,
			left: 0,
			top: 0,
			rotate: 0,
			hFlip: false,
			vFlip: false,
		};
		// Check hint manually: supposed to be Required<IconizzaIcon>
		const result = mergeIconData(icon, {});
		expect(result).toEqual(expected);
	});

	test('Copy values', () => {
		// Copy values
		expect(
			mergeIconData(
				{
					body: '<g />',
					width: 24,
				},
				{
					height: 32,
				}
			)
		).toEqual({
			body: '<g />',
			width: 24,
			height: 32,
		});
	});

	test('Override values', () => {
		expect(
			mergeIconData(
				{
					body: '<g />',
					width: 24,
					height: 24,
				},
				{
					height: 32,
				}
			)
		).toEqual({
			body: '<g />',
			width: 24,
			height: 32,
		});
	});

	test('Override transformations', () => {
		expect(
			mergeIconData(
				{
					body: '<g />',
					width: 24,
					height: 24,
					hFlip: true,
					rotate: 3,
				},
				{
					height: 32,
					vFlip: true,
					rotate: 2,
				}
			)
		).toEqual({
			body: '<g />',
			width: 24,
			height: 32,
			hFlip: true,
			vFlip: true,
			rotate: 1,
		});
	});
});
