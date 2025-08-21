import express, { Request, Response } from "express";
import { requireAuth, ValidateRequest } from "@dynotec/common";
import { body } from "express-validator";
import { Ticket } from "../models/Ticket";

const router = express.Router();

router.post(
	"/api/tickets",
	requireAuth,
	[
		body("title").not().isEmpty().withMessage("Title is required"),
		body("price")
			.isFloat({ gt: 0 })
			.withMessage("Price must be greater than 0"),
	],
	ValidateRequest,
	async (req: Request, res: Response) => {
		const { title, price } = req.body;

		const ticket = await Ticket.build({
			title,
			price,
			userId: req.currentUser!.id,
		});
		ticket.save();

		res.status(201).send(ticket);
	}
);

export { router as newTicketRouter };
