import express, { json } from "express";
import logger from "./middlewares/error/logger";
import responder from "./middlewares/error/responder";
import notFound from "./middlewares/not-found";
import authRouter from "./routers/auth.router";
import usersRouter from "./routers/users.router";
import toursRouter from "./routers/tours.router";
import bookingsRouter from "./routers/bookings.router";
import likesRouter from "./routers/likes.router";
import exportRouter from "./routers/export.router";
import config from "config";
import sequelize from "./db/sequelize";
import enforceAuth from "./middlewares/enforce-auth";
import cors from "cors";

const app = express();

const port = config.get<number>("app.port");
const appName = config.get<string>("app.name");
const secret = config.get<string>("app.secret");

console.log(`app secret is ${secret}`);

app.use(cors());

// post decypher middlewares
app.use(json());

// load routers
app.use("/auth", authRouter);
app.use("/tours", toursRouter); // Tours router handles its own auth (GET is public, POST/PUT/DELETE require auth)
app.use(enforceAuth); // All routes below require authentication
app.use("/users", usersRouter);
app.use("/bookings", bookingsRouter);
app.use("/likes", likesRouter);
app.use("/export", exportRouter);

// not found
app.use(notFound);

// error middlewares
app.use(logger);
app.use(responder);

// synchronize database schema (not data) changes to the database
// i.e syncs our TypeScript models folder into the actual SQL Schema
// sequelize.sync({ force: true })
sequelize.sync({ force: process.argv[2] === "sync" });

console.log(process.argv);

app.listen(port, () => console.log(`${appName} started on port ${port}`));
