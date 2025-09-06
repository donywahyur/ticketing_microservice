import { OrderCreatedEvent, OrderStatus } from "@dynotec/common";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";
import { Ticket } from "../../../models/Ticket";
import mongoose from "mongoose";

const setup = () => {
	const listener = new OrderCreatedListener(natsWrapper.client);

	const ticket = Ticket.build({
		title: "concert",
		price: 20,
		userId: new mongoose.Types.ObjectId().toHexString(),
	});
	ticket.save();

	const data: OrderCreatedEvent["data"] = {
		id: new mongoose.Types.ObjectId().toHexString(),
		version: 0,
		status: OrderStatus.Created,
		userId: new mongoose.Types.ObjectId().toHexString(),
		expiresAt: "123",
		ticket: {
			id: ticket.id,
			price: 10,
		},
	};

	// @ts-ignore
	const msg: Message = {
		ack: jest.fn(),
	};

	return { listener, ticket, data, msg };
};
it("sets the orderId of the ticket", async () => {
	const { listener, ticket, data, msg } = await setup();

	await listener.onMessage(data, msg);

	const updatedTicket = await Ticket.findById(ticket.id);

	expect(updatedTicket!.orderId).toEqual(data.id);
});
it("acks the message", async () => {
	const { listener, ticket, data, msg } = await setup();

	console.log(ticket, data);

	await listener.onMessage(data, msg);

	expect(msg.ack).toHaveBeenCalled();
});
