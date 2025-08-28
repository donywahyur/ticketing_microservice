import { Publisher, Subjects, TicketUpdatedEvent } from "@dynotec/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
	subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
