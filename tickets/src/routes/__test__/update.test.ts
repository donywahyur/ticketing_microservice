import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { natsWrapper } from "../../nats-wrapper";
import { Ticket } from "../../models/Ticket";

it("return 404 if the provided id doesnot exist", async () => {
	const id = new mongoose.Types.ObjectId().toHexString();
	await request(app)
		.put(`/api/tickets/${id}`)
		.set("Cookie", global.signin())
		.send({
			title: "title",
			price: 20,
		})
		.expect(404);
});
it("return 401 if the user is not authenticated", async () => {
	const id = new mongoose.Types.ObjectId().toHexString();
	await request(app)
		.put(`/api/tickets/${id}`)
		.send({
			title: "title",
			price: 20,
		})
		.expect(401);
});
it("return 404 if the user doesnot own the ticket", async () => {
	const response = await request(app)
		.post("/api/tickets")
		.set("Cookie", global.signin())
		.send({
			title: "title",
			price: 20,
		});

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set("Cookie", global.signin())
		.send({
			title: "title",
			price: 20,
		})
		.expect(401);
});
it("return 404 if the user provides an invalid title or price", async () => {
	const cookie = await global.signin();
	const response = await request(app)
		.post("/api/tickets")
		.set("Cookie", cookie)
		.send({
			title: "title",
			price: 20,
		});

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set("Cookie", cookie)
		.send({
			title: "",
			price: 20,
		})
		.expect(400);
});
it("updates the ticket provided valid inputs", async () => {
	const cookie = await global.signin();
	const response = await request(app)
		.post("/api/tickets")
		.set("Cookie", cookie)
		.send({
			title: "title",
			price: 20,
		});

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set("Cookie", cookie)
		.send({
			title: "new title",
			price: 200,
		})
		.expect(201);

	const ticketResponse = await request(app)
		.get(`/api/tickets/${response.body.id}`)
		.send({})
		.expect(200);

	expect(ticketResponse.body.title).toEqual("new title");
	expect(ticketResponse.body.price).toEqual(200);
});

it("publishes an event", async () => {
	const cookie = await global.signin();
	const response = await request(app)
		.post("/api/tickets")
		.set("Cookie", cookie)
		.send({
			title: "title",
			price: 20,
		});

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set("Cookie", cookie)
		.send({
			title: "new title",
			price: 200,
		})
		.expect(201);

	const ticketResponse = await request(app)
		.get(`/api/tickets/${response.body.id}`)
		.send({})
		.expect(200);

	expect(ticketResponse.body.title).toEqual("new title");
	expect(ticketResponse.body.price).toEqual(200);

	expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it("rejects updates if the ticket is reserved", async () => {
	const cookie = await global.signin();
	const response = await request(app)
		.post("/api/tickets")
		.set("Cookie", cookie)
		.send({
			title: "title",
			price: 20,
		});

	const ticket = await Ticket.findById(response.body.id);
	ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
	await ticket!.save();

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set("Cookie", cookie)
		.send({
			title: "new title",
			price: 200,
		})
		.expect(400);
});
