const socket = io("http://localhost:3000");
const messageForm = document.getElementById("send-container");
const messageInput = document.getElementById("message-input");
const messageContainer = document.getElementById("message-container");
const disconnectButton = document.getElementById("disconnect-button");

const username = prompt("What is your name?");
if (username) {
  const notificationElement = document.createElement("div");
  notificationElement.classList.add("message-line", "keep-center");
  notificationElement.innerText = `You joined as ${username}`;
  messageContainer.append(notificationElement);
  socket.emit("new-user", username);
} else {
  window.location.reload();
}

socket.on("chat-message", (data) => {
  appendMessage(data.message, "keep-left", data.name);
});

socket.on("user-connected", (name) => {
  notifyConnections(`${name} connected`, "keep-center", "greenClass");
});

socket.on("user-disconnected", (name) => {
  if (name) {
    notifyConnections(`${name} disconnected`, "keep-center", "redClass");
  }
});

disconnectButton.addEventListener("click", () => {
  socket.disconnect();
  notifyConnections("You disconnected", "keep-center", "redClass");
  window.location.reload();
});

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value;
  socket.emit("send-chat-message", message);
  appendMessage(message, "keep-right", "You");
  disconnectButton.classList.add("show");
  messageInput.value = "";
  scrollToBottom();
});

function notifyConnections(message, alignmentClass, colorClass) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("message-line", alignmentClass, colorClass);
  const textElement = document.createElement("div");
  textElement.innerText = message;
  textElement.classList.add("message-text");
  messageElement.append(textElement);
  messageContainer.append(messageElement);
  scrollToBottom();
}

function appendMessage(message, alignmentClass, username) {
  const messageLine = document.createElement("div");
  messageLine.classList.add("message-line", alignmentClass);
  const textElement = document.createElement("div");
  textElement.innerText = message;
  const userNameElement = document.createElement("div");
  userNameElement.innerText = username;
  userNameElement.classList.add("message-username");
  textElement.classList.add("message-text");
  const messageElement = document.createElement("div");
  messageElement.append(textElement);
  messageElement.append(userNameElement);
  messageElement.classList.add("message-content");
  messageLine.append(messageElement);
  messageContainer.append(messageLine);
  scrollToBottom();
}

function scrollToBottom() {
  messageContainer.scrollTop = messageContainer.scrollHeight;
}
