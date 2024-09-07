const fs = require('fs');
const path = require('path');

// In-memory storage for rooms and bookings
let rooms = [];
let bookings = [];

// Example data for rooms
rooms = [
  { id: 1, name: "Conference Room A", seatsAvailable: 20, amenities: "Projector, Whiteboard", pricePerHour: 100, isBooked: false },
  { id: 2, name: "Meeting Room B", seatsAvailable: 10, amenities: "Teleconference System", pricePerHour: 50, isBooked: false },
  { id: 3, name: "Event Hall C", seatsAvailable: 100, amenities: "Stage, Microphones", pricePerHour: 500, isBooked: false },
];

// Example data for bookings
bookings = [
  { id: 1, customerName: "Alice Johnson", date: "2024-09-10", startTime: "09:00", endTime: "12:00", roomId: 1 },
  { id: 2, customerName: "Bob Smith", date: "2024-09-11", startTime: "14:00", endTime: "16:00", roomId: 2 },
  { id: 3, customerName: "Carol Brown", date: "2024-09-12", startTime: "10:00", endTime: "13:00", roomId: 3 },
];

// Ensure the 'data' directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Save data to a JSON file
const filePath = path.join(dataDir, 'data.json');
fs.writeFileSync(filePath, JSON.stringify({ rooms, bookings }, null, 2));

console.log('Initial data has been created and saved to data.json');
