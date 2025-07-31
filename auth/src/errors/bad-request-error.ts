import { CustomError } from "./custom-error";
export class BadRequestError extends CustomError {
	statusCode = 400;
	constructor(public message: string) {
		super("Bad Request");

		//mandatory because extending from Error
		Object.setPrototypeOf(this, BadRequestError.prototype);
	}

	serializeErrors() {
		return [
			{
				message: this.message,
			},
		];
	}
}
