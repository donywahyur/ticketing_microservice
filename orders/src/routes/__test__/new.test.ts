import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Ticket } from "../../models/Ticket";
import { Order } from "../../models/Order";
import { OrderStatus } from "@dynotec/common";

it("returns an error if the ticket doesn't exist", async () => {
	const ticket = new mongoose.Types.ObjectId().toHexString();

	await request(app)
		.post("/api/orders")
		.set("Cookie", global.signin())
		.send({
			ticketId: ticket,
		})
		.expect(404);
});

it("returns an error if the ticket is reserved", async () => {
	const ticket = Ticket.build({
		title: "concert",
		price: 20,
	});
	await ticket.save();

	const order = Order.build({
		userId: "asdf",
		status: OrderStatus.Created,
		expiresAt: new Date(),
		ticket,
	});
	await order.save();

	await request(app)
		.post("/api/orders")
		.set("Cookie", global.signin())
		.send({
			ticketId: ticket.id,
		})
		.expect(400);
});

it("reserve a ticket", async () => {
	const ticket = Ticket.build({
		title: "concert",
		price: 20,
	});
	await ticket.save();

	await request(app)
		.post("/api/orders")
		.set("Cookie", global.signin())
		.send({
			ticketId: ticket.id,
		})
		.expect(201);
});

it.todo("emits an order created event");
