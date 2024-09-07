const express = require("express");
const fs = require("fs");
const app = express();
require("dotenv").config(); // Load environment variables from .env

// Force the server to run on port 3000
const port = 3000;

// Middleware to parse JSON data
app.use(express.json());

// In-memory storage for rooms and bookings
let rooms = [];
let bookings = [];

// Load initial data (if exists)
try {
  const dataPath = "data/data.json";
  if (fs.existsSync(dataPath)) {
    const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
    rooms = data.rooms || [];
    bookings = data.bookings || [];
  } else {
    console.warn("Data file not found. Using empty initial data.");
  }
} catch (error) {
  console.error("Error loading initial data:", error);
}

// Root endpoint with welcome message and navigation links
app.get("/", (req, res) => {
  res.send(`
    <h1>Welcome to the Hall Booking System</h1>
    <p>Welcome to our Hall Booking System! Here you can manage rooms and bookings.</p>
    <p>Use the following links to navigate:</p>
    <ul>
      <li><a href="/rooms">View All Rooms</a></li>
      <li><a href="/customers">View All Customers</a></li>
    </ul>
  `);
});

// Endpoint to create a room
app.post("/rooms", (req, res) => {
  const { name, seatsAvailable, amenities, pricePerHour } = req.body;

  // Check if all required fields are provided
  if (!name || !seatsAvailable || !amenities || !pricePerHour) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields." });
  }

  // Create a new room object
  const room = {
    id: rooms.length + 1,
    name,
    seatsAvailable,
    amenities,
    pricePerHour,
    isBooked: false, // Initially, the room is not booked
  };

  // Store the new room in the rooms array
  rooms.push(room);
  res.status(201).json({ message: "Room created successfully!", room });
});

// Endpoint to book a room
app.post("/bookings", (req, res) => {
  const { customerName, date, startTime, endTime, roomId } = req.body;

  // Check if all required fields are provided
  if (!customerName || !date || !startTime || !endTime || !roomId) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields." });
  }

  // Find the room by ID
  const room = rooms.find((r) => r.id === roomId);
  if (!room) {
    return res.status(404).json({ message: "Room not found." });
  }

  // Check if the room is already booked for the given date and time
  const existingBooking = bookings.find(
    (booking) =>
      booking.roomId === roomId &&
      booking.date === date &&
      ((startTime >= booking.startTime && startTime < booking.endTime) ||
        (endTime > booking.startTime && endTime <= booking.endTime))
  );

  if (existingBooking) {
    return res
      .status(400)
      .json({ message: "Room is already booked for the selected time." });
  }

  // Create a new booking object
  const booking = {
    id: bookings.length + 1,
    customerName,
    date,
    startTime,
    endTime,
    roomId,
  };

  // Store the new booking in the bookings array
  bookings.push(booking);
  room.isBooked = true; // Update room's booking status

  res.status(201).json({ message: "Room booked successfully!", booking });
});

// Endpoint to list all rooms with booking data
app.get("/rooms", (req, res) => {
  const roomData = rooms.map((room) => {
    // Find the booking for the room (if any)
    const booking = bookings.find((b) => b.roomId === room.id);

    // Return room details with booking information if booked
    return {
      ...room,
      isBooked: !!booking, // Boolean for booking status
      customerName: booking ? booking.customerName : null,
      date: booking ? booking.date : null,
      startTime: booking ? booking.startTime : null,
      endTime: booking ? booking.endTime : null,
    };
  });

  res.json(roomData);
});

// Endpoint to list all customers with booking data
app.get("/customers", (req, res) => {
  const customerData = bookings.map((booking) => {
    // Find the room details for the booking
    const room = rooms.find((r) => r.id === booking.roomId);

    return {
      customerName: booking.customerName,
      roomName: room.name,
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime,
    };
  });

  res.json(customerData);
});

// Endpoint to list a customer's booking history
app.get("/customers/:customerName/bookings", (req, res) => {
  const { customerName } = req.params;

  // Find all bookings for the given customer name
  const customerBookings = bookings
    .filter((b) => b.customerName === customerName)
    .map((booking) => {
      // Find the room details for each booking
      const room = rooms.find((r) => r.id === booking.roomId);
      return {
        customerName: booking.customerName,
        roomName: room.name,
        date: booking.date,
        startTime: booking.startTime,
        endTime: booking.endTime,
        bookingId: booking.id,
        bookingStatus: "Booked", // Fixed booking status
      };
    });

  if (customerBookings.length === 0) {
    return res
      .status(404)
      .json({ message: "No bookings found for this customer." });
  }

  res.json(customerBookings);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
