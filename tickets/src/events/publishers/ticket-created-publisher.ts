import { Publisher, Subjects, TicketCreatedEvent } from "@dynotec/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
	subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
