import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { WebSocketServer } from "ws";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws) => {
    console.log("WebSocket connection established");

    ws.on("message", (message) => {
      console.log("Received message:", message);
      // Handle incoming messages here
    });

    ws.on("close", () => {
      console.log("WebSocket connection closed");
    });
  });

  server.listen(3000, () => {
    console.log("> Ready on http://localhost:3000");
  });
});
