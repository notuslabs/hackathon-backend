import { Exception } from "src/shared/Exception";

/**
 * Returns the max bigint in a list of bigints
 *
 * @param args a list of bigints to get the max of
 * @returns the max bigint in the list
 */
export const bigIntMax = (...args: bigint[]) => {
	if (!args.length) {
		throw new Exception(
			"bigIntMax requires at least one argument",
			"invalid_bigint_max",
		);
	}

	return args.reduce((m, c) => (m > c ? m : c));
};

/**
 * Useful if you want to increment a bigint by N% or decrement by N%
 *
 * example:
 * ```
 * const tenPercentIncrease = bigIntPercent(100n, 110n);
 * const tenPercentDecrease = bigIntPercent(100n, 90n);
 * ```
 *
 * @param base -- the base bigint that we want to apply a percent to
 * @param percent -- the percent to apply to the base
 * @returns the base multiplied by the percent and divided by 100
 */
export const bigIntPercent = (base: bigint, percent: bigint) => {
	return (BigInt(base) * percent) / 100n;
};
