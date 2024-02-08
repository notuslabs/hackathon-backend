import { GraphQLScalarType, Kind } from "graphql";
import { Exception } from "src/shared/Exception";

export const BigIntScalar = new GraphQLScalarType({
	name: "BigInt",
	description: "Numbers with no precision loss",
	serialize: (value) => {
		if (typeof value !== "bigint") {
			throw new Exception("Value must be a BigInt", "invalid_bigint");
		}

		return value.toString();
	},
	parseValue: (value) => {
		if (typeof value !== "string") {
			throw new Exception("Value must be a string", "invalid_bigint");
		}

		return BigInt(value);
	},
	parseLiteral: (ast) => {
		if (ast.kind !== Kind.STRING) {
			throw new Exception("Can only parse strings", "invalid_bigint");
		}

		return BigInt(ast.value);
	},
});
