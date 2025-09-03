import { OrderCreatedEvent, Publisher, Subjects } from "@dynotec/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
	subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
