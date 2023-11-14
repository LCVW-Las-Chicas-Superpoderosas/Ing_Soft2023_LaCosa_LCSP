const WebSocket = require("ws");
const http = require("http");

const server = http.createServer();
const wss = new WebSocket.Server({ noServer: true });
const clients = new Set(); // Set to store connected clients

const gameStatusResponse = {
  type: "game_status_response",
  data: {
    my_position: 0,
    game_status: 2,
    current_player: 9,
    players: [
      { name: "tomas", id: 9, position: 0, is_alive: true },
      { name: "juan", id: 2, position: 1, is_alive: true },
      { name: "pedro", id: 3, position: 2, is_alive: true },
      { name: "pepe", id: 4, position: 3, is_alive: true },
    ],
  },
};
wss.on("connection", (ws) => {
  console.log("WebSocket connection established");
  // Handle incoming messages
  clients.add(ws);

  ws.on("message", (message) => {
    console.log(`Received message: ${message}`);
    const response = handleIncomingMessage(message);
    ws.send(JSON.stringify(response));
    // Broadcast the response to all connected clients

    clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(response));
      }
    });
    ws.on("close", () => {
      console.log("WebSocket connection closed");

      // Remove the WebSocket instance from the set of clients
      clients.delete(ws);
    });
    ws.send(JSON.stringify(gameStatusResponse));
  });
});

// Function to handle incoming messages and simulate a response
function handleIncomingMessage(message) {
  const parsedMessage = JSON.parse(message);

  // Example: Check the type of message and respond accordingly
  if (parsedMessage.type === "chat_message") {
    return {
      type: "chat_message",
      content: `Received: ${parsedMessage.content}`,
    };
  } else if (parsedMessage.type === "getGameStatus") {
    // Simulate a response based on the received message
    const response = {
      type: "game_status_response",
      data: {
        my_position: 0,
        game_status: 2,
        current_player: 1,
        players: [
          { name: "tomas", id: 1, position: 0, is_alive: true },
          { name: "juan", id: 2, position: 1, is_alive: true },
          { name: "pedro", id: 3, position: 2, is_alive: true },
          { name: "pepe", id: 4, position: 3, is_alive: true },
          { name: "mili", id: 5, position: 4, is_alive: true },
          { name: "lara", id: 6, position: 5, is_alive: true },
          { name: "lauti", id: 7, position: 6, is_alive: true },
          { name: "nico", id: 8, position: 7, is_alive: true },
          { name: "diego", id: 9, position: 8, is_alive: true },
          { name: "laura", id: 10, position: 9, is_alive: true },
          { name: "santi", id: 11, position: 10, is_alive: true },
          { name: "chun", id: 12, position: 11, is_alive: false },
        ],
      },
    };
    return response;
  }
  return { type: "error", data: "get to the default case of the mockServer" };
}

// Attach the WebSocket server to the HTTP server
server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});

// Start the HTTP server on port 8000
server.listen(8000, () => {
  console.log("WebSocket server listening on port 8000");
});
