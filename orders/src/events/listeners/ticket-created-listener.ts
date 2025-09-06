import { Listener, Subjects, TicketCreatedEvent } from "@dynotec/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/Ticket";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
	subject: Subjects.TicketCreated = Subjects.TicketCreated;
	queueGroupName = queueGroupName;
	async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
		console.log("Event data", data);
		const ticket = Ticket.build({
			id: data.id,
			title: data.title,
			price: data.price,
		});

		await ticket.save();

		msg.ack();
	}
}
