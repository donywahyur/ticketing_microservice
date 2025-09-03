import { OrderCancelledEvent, Publisher, Subjects } from "@dynotec/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
	subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
