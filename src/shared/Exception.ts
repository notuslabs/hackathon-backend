export class Exception extends Error {
	constructor(
		public message: string,
		public id: string,
	) {
		super(message);
	}
}
