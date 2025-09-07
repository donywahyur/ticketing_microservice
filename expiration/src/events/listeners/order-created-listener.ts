import {
	Listener,
	OrderCreatedEvent,
	OrderStatus,
	Subjects,
} from "@dynotec/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
	subject: Subjects.OrderCreated = Subjects.OrderCreated;
	queueGroupName = queueGroupName;

	async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
		const expiresAt = new Date(data.expiresAt);
		const delay = expiresAt.getTime() - Date.now();

		await expirationQueue.add(
			{
				orderId: data.id,
			},
			{
				delay: delay,
			}
		);

		msg.ack();
	}
}
