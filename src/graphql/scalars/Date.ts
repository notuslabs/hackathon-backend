import { GraphQLScalarType, Kind } from "graphql";

export const DateScalar = new GraphQLScalarType({
	name: "Date",
	description: "Date custom scalar type",
	serialize: (value) => {
		if (!(value instanceof Date)) {
			throw new Error("Value must be a Date");
		}

		return value.toUTCString();
	},
	parseValue: (value) => {
		if (typeof value !== "string") {
			throw new Error("Value must be a string");
		}

		return new Date(value);
	},
	parseLiteral: (ast) => {
		if (ast.kind !== Kind.STRING) {
			throw new Error("Can only parse strings");
		}

		return new Date(ast.value);
	},
});
