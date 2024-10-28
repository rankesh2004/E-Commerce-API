# E-Commerce API
This is an e-commerce REST API built with Express.js, MongoDB, and JWT for authentication. The API allows users to sign up, sign in, view and edit their profiles, add items to the cart, place orders, and view products.

## Prerequisites
- Node.js
- MongoDB
- Postman or another tool for testing APIs

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone <repository_url>

2. **Navigate into the project directory:**
   ```bash
   cd ecommerceAPI

3. **Install dependencies:**
   ```bash
   npm install

4. **Start the MongoDB server on your local machine (ensure MongoDB is running on mongodb://127.0.0.1:27017).**

5. **Start the Express server:**
   ```bash
   node app.js

The server will run at http://localhost:3000.

##Environment Variables
Update the authenticateUser middleware to replace "MY_SECRET_KEY" with a custom JWT secret.

## Dependencies
- express: Web framework for Node.js
- bcrypt: Password hashing
- jsonwebtoken: JWT handling
- mongodb: MongoDB driver
- mongoose: MongoDB object modeling for Node.js

# API Endpoints
## Authenticatio
### Sign Up

- POST /signup
    - Body: { "name": "string", "username": "string", "email": "string", "password": "string" }
    - Response: 200 OK or 400 Bad Request
    - Sign In

- POST /signin
    - Body: { "email": "string", "password": "string" }
    - Response: { "jwtToken": "string", "id": "string" } or 400 Bad Request
    - User Profile
    - Update Profile

- PUT /users/:id
    - Headers: Authorization: Bearer <JWT_TOKEN>
    - Body: { "name": "string", "username": "string", "email": "string" }
    - Response: 200 OK or 400 Bad Request
    - Products
    - Get All Products

- GET /products
    - Query Params: sortby (price), category, rating
    - Response: List of products
    - Get Specific Product

- GET /products/:id
    - Response: Product details
    - Cart
    - Add to Cart

- POST /cart
    - Headers: Authorization: Bearer <JWT_TOKEN>
    - Body: { "title": "string", "brand": "string", "price": "number", "image_url": "string", "quantity": "number" }
    - Response: 200 OK or 400 Bad Request
    - Get Cart Items

- GET /cart
    - Headers: Authorization: Bearer <JWT_TOKEN>
    - Response: List of cart items
    - Edit Cart Quantity

- PUT /cart
    - Headers: Authorization: Bearer <JWT_TOKEN>
    - Body: { "id": "string", "quantity": "number" }
    - Response: 200 OK or 400 Bad Request
    - Delete Cart Item

- DELETE /cart/:id
    - Headers: Authorization: Bearer <JWT_TOKEN>
    - Response: 200 OK or 400 Bad Request
    - Orders
    - Place an Order

- POST /orders
    - Headers: Authorization: Bearer <JWT_TOKEN>
    - Body: { "title": "string", "brand": "string", "price": "number", "image_url": "string", "quantity": "number" }
    - Response: 200 OK or 400 Bad Request
    - Get All Orders

- GET /orders
    - Headers: Authorization: Bearer <JWT_TOKEN>
    - Response: List of orders
    - Error Handling
    - Each endpoint includes error handling with appropriate status codes and messages.
