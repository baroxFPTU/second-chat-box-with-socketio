const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const port = process.env.PORT || 3000;
server.listen(port);

const onlineUsers = [];

// Socketio
io.on("connect", function (socket) {
  console.log("Connected - ", socket.id);

  socket.on("client-send-username", function (name) {
    const isExit = onlineUsers.find((username) => username === name) ?? false;

    if (isExit) {
      socket.emit(
        "server-send-failure-register",
        "Username has been registered."
      );
    } else {
      onlineUsers.push(name);
      socket.username = name;
      socket.emit("server-send-success-register", name);
      io.sockets.emit("server-update-online-users", onlineUsers);
    }
  });

  socket.on("client-send-message", function (message) {
    io.sockets.emit("server-send-message", {
      username: socket.username,
      message: message,
    });
  });

  socket.on("client-typing-message", function () {
    socket.broadcast.emit("server-update-typing-state", true);
  });

  socket.on("client-stop-typing-message", function () {
    socket.broadcast.emit("server-update-typing-state", false);
  });

  socket.on("client-logout", function () {
    onlineUsers.splice(onlineUsers.indexOf(socket.username), 1);
    console.log(onlineUsers);
    socket.username = null;
    socket.broadcast.emit("server-update-online-users", onlineUsers);
  });
});

app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");

app.get("/", (req, res) => {
  res.render("home");
});
