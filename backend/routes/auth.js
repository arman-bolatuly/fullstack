const router = require("express").Router();
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
//const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
require("dotenv").config();
//const cookieParser = require("cookie-parser");

const db = new PrismaClient();
//app.use(bodyParser.urlencoded());

// AUTH middlewares
// jwt.verify

async function checkAuth(req, res, next) {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .send({ auth: false, message: "No token provided." });
    }
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await db.user.findUnique({
      where: {
        id: decoded.userId,
      },
    });

    if (!user) {
      return res.status(404).send({ auth: false, message: "No user found." });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res
      .status(401)
      .send({ auth: false, message: "Failed to authenticate token." });
  }
}

// takes all users
router.get("/users", async (_req, res) => {
  const users = await db.user.findMany();
  res.json(users);
});

// sign in
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await db.user.findUnique({ where: { email } });
  if (!user) {
    res.status(404).json({ error: "User not found" });
  }
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    res.status(401).json({ error: "Invalid password" });
  }
  //create access token
  const accessToken = jwt.sign(
    { userId: user.id },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "6h",
    }
  );
  //create refresh token
  const refreshToken = jwt.sign(
    { userId: user.id },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "60d",
    }
  );
  //saving refresh token with current user
  //const otherUsers = db.users.find({ email: user.email });
  //const currentUser = { ...user.email, refreshToken };
  //db.setUsers([...otherUsers, currentUser]);

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  });
  res.json({ accessToken, user: { role: user.role } });
});

// test for authenticated
router.get("/test", checkAuth, (_req, res) => {
  res.json({ message: "You are authenticated" });
});

// user registration
router.post("/users", async (req, res) => {
  try {
    // create new user
    const { email, name, surname, ts } = req.body;
    const password = await bcrypt.hash(req.body.password, 10);
    await db.user.create({
      data: {
        email,
        password,
        name,
        surname,
        ts,
        role: "USER",
      },
    });

    res
      .status(201)
      .json({ success: true, message: `New user ${email} created` });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, error });
    console.log(error);
  }
});

// refresh token controller
router.get("/refresh", (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    res.status(401);
  }
  console.log(cookies.jwt);
  const refreshToken = cookies.jwt;

  const user = db.user.findUnique({
    where: { refreshToken: refreshToken },
  });
  if (!user) {
    res.status(403);
  }

  // evaluate jwt
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (
      err ||
      db.user.findUnique({
        where: {
          id: decoded.userId,
        },
      })
    ) {
      res.status(403);
      const accessToken = jwt.sign(
        { userId: decoded.userId },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "30s" }
      );
      res.json({ accessToken });
    }
  });
});

module.exports = router;
