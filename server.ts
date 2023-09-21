import express, { Request, Response } from "express";
import mongoose from "mongoose";
import winston from "winston";
import { ROUTER } from "./src/routes";
import http from "http";
import errorHandler from "./src/middlewares/error";
import "./database"
import session from "express-session";

const app = express();


// to caught uncaught exception
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message, err);
  process.exit(1);
});
// unhandled promise rejection
process.on('unhandledRejection', (err) => {
  throw err;
});

const serverConfig = () => {
  console.log("Server configuration started");
  app.set("view engine", "pug");
  app.set("views", "./views");
  app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: false
  }))
  app.use((req, res, next) => {
    console.log(
      `Incoming -> Method: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] - Method: [${req.method}]`
    );
    res.on("finish", () => {
      console.log(
        `Outgoing -> Status: [${res.statusCode}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] - Method: [${req.method}]`
      );
    });
    next();
  });

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(errorHandler as any);
  app.use(express.static("public"));
  ROUTER.forEach((route) => {
    app.use(route.path, route.router);
  });



  const PORT = process.env.PORT || 3000;
  http
    .createServer(app)
    .listen(PORT, () =>
      console.log(
        `Express is listening at http://localhost:${PORT}`
      )
    );
};

serverConfig();