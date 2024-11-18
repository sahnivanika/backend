import express from 'express';
import mongoose from 'mongoose';
import router from './routes/user-routes.js'; // Adjust the path to match your structure
import blogRouter from './routes/blog-routes.js'; // Adjust the path to match your structure
import cors from 'cors';

// Initialize Express
const app = express();

// Middleware
app.use(cors()); // Corrected from 'corse'
app.use(express.json()); // Parse incoming JSON requests

// Routes
app.use('/api/user', router); // Route prefix for user-related routes
app.use('/api/blog', blogRouter); // Route prefix for blog-related routes

// MongoDB connection string
mongoose
  .connect(
    "mongodb+srv://vanikasahni5:b0JYZgjIMUtBmBvB@cluster0.kd3rk.mongodb.net/Blog?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    // Start the server after successful connection
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Connected to database and listening on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
