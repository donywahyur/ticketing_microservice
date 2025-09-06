import { TicketCreatedEvent } from "@dynotec/common";
import { Ticket } from "../../../models/Ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketCreatedListener } from "../ticket-created-listener";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

const setup = async () => {
	const listener = new TicketCreatedListener(natsWrapper.client);

	const ticket: TicketCreatedEvent["data"] = {
		id: new mongoose.Types.ObjectId().toHexString(),
		title: "concert",
		price: 20,
		userId: new mongoose.Types.ObjectId().toHexString(),
		version: 0,
	};

	// @ts-ignore
	const message: Message = {
		ack: jest.fn(),
	};

	return { listener, ticket, message };
};

it("creates and saves a ticket", async () => {
	const { listener, ticket, message } = await setup();

	await listener.onMessage(ticket, message);

	const createdTicket = await Ticket.findById(ticket.id);

	expect(createdTicket).toBeDefined();
	expect(createdTicket!.title).toEqual(ticket.title);
	expect(createdTicket!.price).toEqual(ticket.price);
});

it("acs the message", async () => {
	const { listener, ticket, message } = await setup();

	await listener.onMessage(ticket, message);

	expect(message.ack).toHaveBeenCalled();
});
