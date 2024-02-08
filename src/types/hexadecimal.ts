import { z } from "zod";

export type Hexadecimal = `0x${string}`;
export const zEthereumAddress = z.string().regex(/^0x[a-fA-F0-9]{40}$/);
export const zKeccak256Hash = z.string().regex(/^0x[a-fA-F0-9]{64}$/);
