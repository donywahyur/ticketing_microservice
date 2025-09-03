import { OrderStatus } from "@dynotec/common";
import mongoose from "mongoose";

interface TicketAttrs {
	id: string;
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
	},
});

ticketSchema.statics.build = (attrs: TicketAttrs) => {
	return new Ticket({
		_id: attrs.id,
		title: attrs.title,
		price: attrs.price,
	});
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
