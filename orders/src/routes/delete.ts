import {
	NotAuthorized,
	NotFoundError,
	OrderStatus,
	requireAuth,
} from "@dynotec/common";
import express, { Request, Response } from "express";
import { Order } from "../models/Order";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.delete(
	"/api/orders/:orderId",
	requireAuth,
	async (req: Request, res: Response) => {
		const orderId = req.params.orderId;

		const order = await Order.findById(orderId).populate("ticket");

		if (!order) {
			throw new NotFoundError();
		}

		if (order.userId !== req.currentUser!.id) {
			throw new NotAuthorized();
		}

		order.status = OrderStatus.Cancelled;
		await order.save();

		new OrderCancelledPublisher(natsWrapper.client).publish({
			id: order.id,
			ticket: {
				id: order.ticket.id,
			},
		});

		res.status(204).send(order);
	}
);

export { router as deleteOrderRoute };
