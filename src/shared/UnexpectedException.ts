import { Exception } from "./Exception";

export class UnexpectedException extends Exception {
	constructor(
		public message: string,
		public id: string,
		private sensitiveData?: unknown,
	) {
		super(message, id);
	}

	public getSensitiveData() {
		return this.sensitiveData;
	}
}
