const http = require("http");
const { Server } = require("socket.io");
const { exec } = require('child_process');
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

let onlineDoctors = new Set();

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

  socket.on("doctor-online", () => {
    onlineDoctors.add(socket.id);
    io.emit("update-doctor-count", onlineDoctors.size);
  });

  socket.on("call-doctor", ({ signal, patient }) => {
    // console.log("call", patient);

    socket.broadcast.emit("incoming-call", { signal, patient });
  });

  socket.on("accept-call", ({ signal, doctorId }) => {
    socket.broadcast.emit("doctor-accepted", { signal, doctorId });
  });

  socket.on("end-call", ({ patientId }) => {
    io.to(patientId).emit("call-ended");
  });

  socket.on("prescribe-medicines", (data) => {
    console.log("Received prescribed medicines:", data);

    // Forward the data to the vending machine
    socket.broadcast.emit("vending-machine-update", data); // Broadcast to all clients or target specific vending machine
  });

  socket.on("send-image", (data) => {
    console.log("Received Payment QR Image:", data);

    // Broadcast the image to the specific patient
    io.to(data.patientId).emit("receive-image", data);
  });

  socket.on("health-data", (data) => {
    console.log("Health data from patient to doctor:", data);
    io.emit("health-data", data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    if (onlineDoctors.has(socket.id)) {
      onlineDoctors.delete(socket.id);
      io.emit("update-doctor-count", onlineDoctors.size);
    }
  });

 
let sensorProcess = null; // 🆕 store the running process

let sensorData = {};

// API to receive sensor data from Raspberry Pi
app.post('/api/sensors', (req, res) => {
  sensorData = req.body;
  console.log('Received sensor data:', sensorData);
  res.json({ status: 'ok' });
});

// API to send latest sensor data to frontend
app.get('/api/sensors', (req, res) => {
  res.json(sensorData);
});

// 🆕 API to START the Python script
app.get('/api/start-script', (req, res) => {
  if (!sensorProcess) {
    sensorProcess = spawn('python', ['./sensors.py']); // Or 'python' if on Windows

    sensorProcess.stdout.on('data', (data) => {
      console.log(`Sensor Script stdout: ${data}`);
    });
   
    sensorProcess.stderr.on('data', (data) => {
      console.error(`Sensor Script stderr: ${data}`);
    }); 

    sensorProcess.on('close', (code) => {
      console.log(`Sensor script exited with code ${code}`);
      sensorProcess = null;
    });

    res.json({ success: true, message: "Sensor script started" });
  } else {
    res.json({ success: false, message: "Sensor script already running" });
  }
});

// 🆕 API to STOP the Python script
app.get('/api/stop-script', (req, res) => {
  if (sensorProcess) {
    sensorProcess.kill('SIGTERM'); // Kill the process
    sensorProcess = null;
    res.json({ success: true, message: "Sensor script stopped" });
  } else {
    res.json({ success: false, message: "No sensor script running" });
  }
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
