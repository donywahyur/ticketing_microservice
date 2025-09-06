import mongoose from "mongoose";
import { TicketDoc } from "./Ticket";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface OrderAttrs {
	userId: string;
	status: string;
	expiresAt: Date;
	ticket: TicketDoc;
}

interface OrderDoc extends mongoose.Document {
	userId: string;
	status: string;
	expiresAt: Date;
	ticket: TicketDoc;
	version: number;
	createdAt: string;
	updatedAt: string;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
	build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema({
	userId: {
		type: String,
		required: true,
	},
	status: {
		type: String,
		required: true,
	},
	expiresAt: {
		type: mongoose.Schema.Types.Date,
		required: true,
	},
	ticket: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Ticket",
		required: true,
	},
});

orderSchema.set("toJSON", {
	transform: (doc, ret: any) => {
		ret.id = ret._id;
		delete ret._id;
	},
});

orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAttrs) => {
	return new Order(attrs);
};

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order };
