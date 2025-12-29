const express = require("express");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const blogRoutes = require("./routes/blogRoutes");
const projectRoutes = require("./routes/projectRoutes");
const authRoutes = require("./routes/authRoutes");
const contactRoutes = require("./routes/contactRoutes"); // Added contact routes
const metaRoutes = require("./routes/metaRoutes");

dotenv.config();

const PORT = process.env.PORT || 8500;
const MONGODB_URI = process.env.MONGODB_URI;
const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/blogs", blogRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/upload", require("./routes/uploadRoutes"));
app.use(metaRoutes);

// Serve static files from 'uploads' directory
app.use("/uploads", express.static("uploads"));

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
});

connectDB(MONGODB_URI).then(() => {
  app.listen(PORT, () => {
    console.log(`Server ready on http://localhost:${PORT}`);
  });
});
