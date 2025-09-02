import { OrderStatus } from "@dynotec/common";
import mongoose from "mongoose";

interface TicketAttrs {
	title: string;
	price: number;
}

interface TicketDoc extends mongoose.Document {
	title: string;
	price: number;
	isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
	build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
});

ticketSchema.set("toJSON", {
	transform: (doc, ret: any) => {
		ret.id = ret._id;
		delete ret._id;
		delete ret.password;
	},
});

ticketSchema.statics.build = (attrs: TicketAttrs) => {
	return new Ticket(attrs);
};
ticketSchema.methods.isReserved = async function () {
	const existingOrder = await this.model("Order").findOne({
		ticket: this.id,
		status: {
			$in: [
				OrderStatus.Created,
				OrderStatus.AwaitingPayment,
				OrderStatus.Complete,
			],
		},
	});
	return !!existingOrder;
};

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket, TicketDoc };
