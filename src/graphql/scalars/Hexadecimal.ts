import { GraphQLScalarType, Kind } from 'graphql';

export const HexadecimalScalar = new GraphQLScalarType({
  name: 'Hexadecimal',
  description: 'Any string that starts with 0x',
  serialize: (value) => {
    if (typeof value !== 'string') {
      throw new Error('Value must be a string');
    }

    if (!value.startsWith('0x')) {
      throw new Error('Value must start with 0x');
    }

    return value;
  },
  parseValue: (value) => {
    if (typeof value !== 'string') {
      throw new Error('Value must be a string');
    }

    if (!value.startsWith('0x')) {
      throw new Error('Value must start with 0x');
    }

    return value;
  },
  parseLiteral: (ast) => {
    if (ast.kind !== Kind.STRING) {
      throw new Error('Can only parse strings');
    }

    if (!ast.value.startsWith('0x')) {
      throw new Error('Value must start with 0x');
    }

    return ast.value;
  },
});
