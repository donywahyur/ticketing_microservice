import express, { Request, Response } from "express";
import { body } from "express-validator";
import { User } from "../models/User";
import { Password } from "../services/password";
import jwt from "jsonwebtoken";

import { ValidateRequest, BadRequestError } from "@dynotec/common";

const router = express.Router();

router.post(
	"/api/users/signin",
	[
		body("email").isEmail().withMessage("Email must be valid"),
		body("password")
			.trim()
			.isLength({ min: 4, max: 20 })
			.withMessage("Password must be between 4 and 20 characters"),
	],
	ValidateRequest,
	async (req: Request, res: Response) => {
		const { email, password } = req.body;

		const existingUser = await User.findOne({ email });
		if (!existingUser) {
			throw new BadRequestError("Invalid Credentials");
		}

		const isPasswordMatch = await Password.compare(
			existingUser.password!,
			password
		);

		if (!isPasswordMatch) {
			throw new BadRequestError("Invalid Credentials");
		}

		const userJWT = jwt.sign(
			{
				id: existingUser.id,
				email: existingUser.email,
			},
			process.env.JWT_KEY!
		);

		req.session = {
			jwt: userJWT,
		};

		res.send({
			email: existingUser.email,
			id: existingUser.id,
		});
	}
);

export { router as signinRouter };
