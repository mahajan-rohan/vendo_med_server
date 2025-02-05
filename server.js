const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const app = require("./app");
const { default: Stripe } = require("stripe");

require("dotenv").config();
// connectDB();

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error(
    "STRIPE_SECRET_KEY is not defined in the environment variables."
  );
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PORT = process.env.PORT || 4000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
    credentials: true, // Allow credentials if needed
  },  
});

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("call-doctor", ({ signal, patient }) => {
    console.log("call", patient);

    socket.broadcast.emit("incoming-call", { signal, patient });
  });

  socket.on("accept-call", ({ signal }) => {
    socket.broadcast.emit("doctor-accepted", { signal });
  });

  socket.on("end-call", ({ patientId }) => {
    io.to(patientId).emit("call-ended");
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

app.post("/api/generatePayment", async (req, res) => {
  const { amount, patientId } = req.body;

  try {
    // Create a PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: "usd",
      metadata: { patientId },
    });

    // Generate a payment QR code with Stripe payment URL
    const paymentUrl = `https://pay.stripe.com/${paymentIntent.id}`;

    res.json({ paymentUrl });
  } catch (error) {
    console.error("Error generating payment:", error);
    res.status(500).json({ error: "Failed to generate payment" });
  }
});

server.listen(4000, () => {
  console.log("Socket.IO server running on port 4000");
});
