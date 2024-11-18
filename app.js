import express from 'express';
import mongoose from 'mongoose';
import router from "./backend/routes/user-routes.js";
import blogRouter from './backend/routes/blog-routes.js';
import corse from 'cors';
// Initialize Express
const app = express();
app.use(corse());
app.use(express.json());
// Middleware to parse incoming JSON requests
// Routes
app.use("/api/user", router); // Use /api/user as the route prefix
app.use("/api/blog",blogRouter);
// MongoDB connection string
mongoose.connect(
  "mongodb+srv://vanikasahni5:b0JYZgjIMUtBmBvB@cluster0.kd3rk.mongodb.net/Blog?retryWrites=true&w=majority&appName=Cluster0"
)
.then(() => {
  // Start the server after successful connection
  app.listen(process.env.PORT || 5000, () => {
    console.log(`Connected to database and listening to localhost ${5000}`);
  });
})
.catch((err) => console.log(err));
