import "express-async-errors";
import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
	if (!process.env.JWT_KEY) {
		throw new Error("JWT key must be provided");
	}

	if (!process.env.MONGO_URI) {
		throw new Error("Mongo URI must be provided");
	}
	try {
		await mongoose.connect(process.env.MONGO_URI);
		console.log("Connected To MongoDB");
	} catch (err) {
		console.log(err);
	}

	app.listen(3000, () => {
		console.log("Listening on port 3000");
	});
};

start();
