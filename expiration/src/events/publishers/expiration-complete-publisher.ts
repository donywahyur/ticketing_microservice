import { ExpirationCompleteEvent, Publisher, Subjects } from "@dynotec/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
	subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
