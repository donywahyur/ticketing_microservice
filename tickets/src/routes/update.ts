import express, { Request, Response } from "express";
import {
	NotAuthorized,
	NotFoundError,
	requireAuth,
	ValidateRequest,
} from "@dynotec/common";
import { body } from "express-validator";
import { Ticket } from "../models/Ticket";

const router = express.Router();

router.put(
	"/api/tickets/:id",
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
		const { id } = req.params;

		const ticket = await Ticket.findById(id);

		if (!ticket) {
			throw new NotFoundError();
		}

		if (ticket.userId !== req.currentUser!.id) {
			throw new NotAuthorized();
		}

		ticket.set({
			title,
			price,
		});
		await ticket.save();

		res.send(ticket);
	}
);

export { router as updateTicketRouter };
