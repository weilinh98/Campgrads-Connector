const express = require("express");
const app = express();
const connectDB = require("./config/db");

connectDB();

//Init Middleware
const jsonMiddleware = express.json();
app.use(jsonMiddleware);

app.get("/", (req, res) => res.send("API running"));

//Define Routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));

const PORT = process.env.port || 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
