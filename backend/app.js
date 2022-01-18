const express = require("express");
const createError = require("http-errors");
//const { PrismaClient } = require("@prisma/client");
//const bcrypt = require("bcryptjs");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");
//const cookieParser = require("cookie-parser");
//const jwt = require("jsonwebtoken");

//const db = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded());
app.use(morgan("dev"));
//app.use(cookieParser());

app.get("/api", async (req, res, next) => {
  res.send({ message: "Awesome it works 🐻" });
});

//app.use("/api", require("./routes/api.route"));
app.use("/api", require("./routes/posts"));
app.use("/api", require("./routes/users"));
app.use("/api", require("./routes/auth"));

app.use((req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`));
