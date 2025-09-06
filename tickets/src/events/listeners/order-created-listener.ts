import { Listener, OrderCreatedEvent, Subjects } from "@dynotec/common";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/Ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";
import { natsWrapper } from "../../nats-wrapper";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
	subject: Subjects.OrderCreated = Subjects.OrderCreated;
	queueGroupName = queueGroupName;

	async onMessage(data: OrderCreatedEvent["data"], msg: any) {
		const ticket = await Ticket.findById(data.ticket.id);

		if (!ticket) {
			throw new Error("Ticket not found");
		}

		ticket.set({
			orderId: data.id,
		});

		await ticket.save();

		msg.ack();
	}
}
