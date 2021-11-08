import http from "http";
import WebSocket from "ws";
import express from "express";
import SocketIO from "socket.io";
import { SIGUNUSED } from "constants";

const app = express();

console.log("hello");

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));

const handleListen = () => console.log(`listen on http://localhost:3000`);

const server = http.createServer(app);
const io = SocketIO(server);

server.listen(3000, handleListen);
