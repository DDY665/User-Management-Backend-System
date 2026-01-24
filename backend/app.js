require("dotenv").config();

const express = require("express");
const app = express();

// body parser (must come before routes)
app.use(express.json());

// routes
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// error handler (MUST be last)
const errorHandler = require("./middleware/error.middleware");
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
