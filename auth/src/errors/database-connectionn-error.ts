import { CustomError } from "./custom-error";

export class DatabaseConnectionError extends CustomError {
	statusCode = 500;
	reason = "Error connection from database";

	constructor() {
		super("Error Connecting to DB");

		Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
	}

	serializeErrors() {
		return [
			{
				message: this.reason,
			},
		];
	}
}
