const socket = io("https://chatbox-realtime-socketio.herokuapp.com/");

$(document).ready(function () {
  $("#chatbox").hide();

  $(".btn-start").click(function () {
    const username = $("#username").val();
    socket.emit("client-send-username", username);
  });

  $(".btn-logout").click(function () {
    socket.emit("client-logout");
    $("#chatbox").hide(1000);
    $(".login-form").show(2000);
    $("#username").val("");
  });

  $(".btn-send-message").click(function () {
    socket.emit("client-send-message", $(".chatbox__input").val());
    $(".chatbox__input").val("");
  });

  $(".chatbox__input").focus(function () {
    console.log("Typing...");
    socket.emit("client-typing-message");
  });

  $(".chatbox__input").blur(function () {
    console.log("Blur...");
    socket.emit("client-stop-typing-message");
  });
});

// Socket events
socket.on("server-send-failure-register", (failureMessage) => {
  alert(failureMessage);
});

socket.on("server-send-success-register", (username) => {
  alert("Successfully.");
  $(".current-user").html(username);
  $(".login-form").hide(1000);
  $("#chatbox").show(1000);
});

socket.on("server-update-online-users", function (data) {
  const listOnlineUsers = $(".list-users");

  listOnlineUsers.html("");
  $.each(data, function (index, username) {
    listOnlineUsers.append(
      `<li class="user" data-index="${index}">${username}</li>`
    );
  });
});

socket.on("server-send-message", function ({ username, message }) {
  $(".chatbox__messages").append(
    `<div class="chatbox__message"><span class="chatbox__message-username">${username}</span> ${message}</div>`
  );
});

socket.on("server-update-typing-state", function (isTyping) {
  if (!isTyping) {
    return $(".chatbox__typing").hide(1000);
  }

  return $(".chatbox__messages").append(
    `<div class="chatbox__typing">Someone is typing...</div>`
  );
});
// TODO
// CLIENT - emit send new username to server
// SERVER - catch the failure case
// SERVER - catch the success case
// SERVER - emit list of online user

//SOCKET map
// client-send-username
// server-send-failure-register
// server-send-success-register
// server-update-online-users
