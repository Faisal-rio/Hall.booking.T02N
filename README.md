# Hall Booking System

This is a simple Hall Booking System built using **Express.js**. The system allows users to manage rooms and bookings for a variety of events such as conferences, meetings, and more.

## Features

- **View all rooms**: Check room availability, price, amenities, and seat capacity.
- **Book a room**: Book rooms for specific dates and times with validation to prevent double booking.
- **View all customers**: Check which customers have booked rooms and their booking details.
- **Customer booking history**: View the booking history for individual customers.

## Endpoints

### Rooms
1. **Create a Room**: 
   - `POST /rooms`
   - Create a new room with details such as seats, amenities, and price per hour.
   
2. **View All Rooms**: 
   - `GET /rooms`
   - View all rooms along with booking details, if applicable.

### Bookings
1. **Create a Booking**: 
   - `POST /bookings`
   - Book a room by specifying customer name, date, start time, end time, and room ID. Validation ensures that rooms are not double-booked.

2. **View All Customers**:
   - `GET /customers`
   - View a list of all customers along with their booking details.
   
3. **View Customer's Booking History**:
   - `GET /customers/:customerName/bookings`
   - View the booking history for a specific customer.


