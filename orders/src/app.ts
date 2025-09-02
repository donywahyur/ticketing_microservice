import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import { NotFoundError, errorHandler, currentUser } from "@dynotec/common";
import cookieSession from "cookie-session";
import { indexOrderRoute } from "./routes/index";
import { newOrderRoute } from "./routes/new";
import { showOrderRoute } from "./routes/show";
import { deleteOrderRoute } from "./routes/delete";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
	cookieSession({
		signed: false,
		secure: process.env.NODE_ENV !== "test",
	})
);
app.use(currentUser);
app.use(newOrderRoute);
app.use(showOrderRoute);
app.use(indexOrderRoute);
app.use(deleteOrderRoute);
app.all("*", async () => {
	throw new NotFoundError();
});

app.use(errorHandler);

export { app };
