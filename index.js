const express = require("express");
const app = express();
require("dotenv").config();

// Middleware to parse JSON data
app.use(express.json());

// In-memory storage for rooms and bookings (Initialized directly)
let rooms = [
  { id: 1, name: "Conference Room A", seatsAvailable: 20, amenities: "Projector, Whiteboard", pricePerHour: 100, isBooked: false },
  { id: 2, name: "Meeting Room B", seatsAvailable: 10, amenities: "Teleconference System", pricePerHour: 50, isBooked: false },
  { id: 3, name: "Event Hall C", seatsAvailable: 100, amenities: "Stage, Microphones", pricePerHour: 500, isBooked: false }
];

let bookings = [
  { id: 1, customerName: "Alice Johnson", date: "2024-09-10", startTime: "09:00", endTime: "12:00", roomId: 1 },
  { id: 2, customerName: "Bob Smith", date: "2024-09-11", startTime: "14:00", endTime: "16:00", roomId: 2 },
  { id: 3, customerName: "Carol Brown", date: "2024-09-12", startTime: "10:00", endTime: "13:00", roomId: 3 }
];

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
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

