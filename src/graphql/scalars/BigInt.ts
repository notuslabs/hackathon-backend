import { GraphQLScalarType, Kind } from 'graphql';

export const BigIntScalar = new GraphQLScalarType({
  name: 'BigInt',
  description: 'Numbers with no precision loss',
  serialize: (value) => {
    if (typeof value !== 'bigint') {
      throw new Error('Value must be a BigInt');
    }

    return value.toString();
  },
  parseValue: (value) => {
    if (typeof value !== 'string') {
      throw new Error('Value must be a string');
    }

    return BigInt(value);
  },
  parseLiteral: (ast) => {
    if (ast.kind !== Kind.STRING) {
      throw new Error('Can only parse strings');
    }

    return BigInt(ast.value);
  },
});
