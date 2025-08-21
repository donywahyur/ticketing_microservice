import express, { Request, Response } from "express";
import { requireAuth } from "@dynotec/common";
import { Ticket } from "../models/Ticket";

const router = express.Router();

router.get("/api/tickets", async (req: Request, res: Response) => {
	const tickets = await Ticket.find({});

	res.status(201).send(tickets);
});

export { router as indexTicketRouter };
