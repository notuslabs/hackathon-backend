import { GraphQLScalarType, Kind } from "graphql";
import { Exception } from "src/shared/Exception";

export const HexadecimalScalar = new GraphQLScalarType({
	name: "Hexadecimal",
	description: "Any string that starts with 0x",
	serialize: (value) => {
		if (typeof value !== "string") {
			throw new Exception("Value must be a string", "invalid_hexadecimal");
		}

		if (!value.startsWith("0x")) {
			throw new Exception("Value must start with 0x", "invalid_hexadecimal");
		}

		return value;
	},
	parseValue: (value) => {
		if (typeof value !== "string") {
			throw new Exception("Value must be a string", "invalid_hexadecimal");
		}

		if (!value.startsWith("0x")) {
			throw new Exception("Value must start with 0x", "invalid_hexadecimal");
		}

		return value;
	},
	parseLiteral: (ast) => {
		if (ast.kind !== Kind.STRING) {
			throw new Exception("Can only parse strings", "invalid_hexadecimal");
		}

		if (!ast.value.startsWith("0x")) {
			throw new Exception("Value must start with 0x", "invalid_hexadecimal");
		}

		return ast.value;
	},
});
