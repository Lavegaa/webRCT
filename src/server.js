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

const publicRoom = () => {
  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = io;
  const publicRooms = [];

  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) {
      publicRooms.push(key);
    }
  });
  return publicRooms;
};

const countRoom = (roomName) => {
  return io.sockets.adapter.rooms.get(roomName)?.size;
};

io.on("connection", (socket) => {
  socket.on("enter_room", (roomName, done) => {
    socket.join(roomName);
    done();
    socket.to(roomName).emit("welcome");
    io.sockets.emit("room_change", publicRoom());
  });
  socket.on("disconnecting", () => {
    socket.rooms.forEach(
      (room) => socket.to(room).emit("bye"),
      countRoom(room) - 1
    );
  });
  socket.on("new_message", (msg, roomName, done) => {
    socket.to(roomName).emit("new_message", msg);
    done();
  });
});

// const sockets = [];

// wss.on("connection", (socket) => {
//   console.log("Connected to Browser ✅");
//   sockets.push(socket);
//   socket["nickname"] = "default";
//   socket.on("close", () => {
//     console.log("Disconnected to Browser ❌");
//   });
//   socket.on("message", (message) => {
//     const { type, payload } = JSON.parse(message.toString("utf8"));
//     console.log(type);
//     if (type === "message") {
//       sockets.forEach((aSocket) => {
//         aSocket.send(`${socket.nickname}: ${payload.toString("utf8")}`);
//       });
//     } else if (type === "nickname") {
//       socket["nickname"] = payload;
//     }
//   });
// });

server.listen(3000, handleListen);
