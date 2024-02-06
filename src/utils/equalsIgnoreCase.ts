export function equalsIgnoringCase(text: string | null, other: string) {
	return text?.localeCompare(other, undefined, { sensitivity: "base" }) === 0;
}
