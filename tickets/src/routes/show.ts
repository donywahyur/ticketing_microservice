import express, { Request, Response } from "express";
import { NotFoundError } from "@dynotec/common";
import { Ticket } from "../models/Ticket";

const router = express.Router();

router.get("/api/tickets/:id", async (req: Request, res: Response) => {
	const { id } = req.params;

	const ticket = await Ticket.findById(id);

	console.log(ticket);

	if (!ticket) {
		throw new NotFoundError();
	}

	res.status(201).send(ticket);
});

export { router as showTicketRouter };
