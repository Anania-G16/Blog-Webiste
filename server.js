import express from "express";
import pg from "pg";
import cors from "cors";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import env from "dotenv";
import session from "express-session";
import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";

const app = express();
const port = 5000;
const saltRounds = 10;

env.config();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cors());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(
  session({
    secret: "sessionsecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 5,
      secure: false,
      httpOnly: true,
      sameSite: "lax",
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

db.connect();

app.post("/", async (req, res) => {
  console.log(req.body);
  if (req.body) res.send("Blog recieved!");
  const blog = req.body;
  await db.query("INSERT INTO blog (title, content) VALUES ($1, $2)", [
    blog.title,
    blog.content,
  ]);
});

app.get("/getBlogs", async (req, res) => {
  //   res.send("Request successful");
  const response = await db.query("SELECT * FROM blog ORDER BY blog_id DESC");
  // console.log(response.rows);
  const blogs = response.rows;
  res.send(blogs);
});

app.post("/register", async (req, res, next) => {
  console.log("This is the backend. Request accepted.");
  // res.send("Successfully connected!");
  console.log(req.body);
  const user = req.body;
  const response = await db.query(
    "SELECT email, username FROM users WHERE username = $1 OR email = $2",
    [user.username, user.email]
  );
  if (response.rows[0]) {
    console.log(response.rows);
    if (response.rows[0].email === user.email) {
      res.status(409).json({
        success: false,
        message: "Email already registered. Try logging in.",
      });
      // res.send("Email already registered. Try logging in.");
      return;
    }
    if (response.rows[0].username === user.username) {
      res.status(409).json({
        success: false,
        message: "Username is already taken. Try another one.",
      });
      // res.send("Username is already taken. Try another one.");
      return;
    }
  }
  bcrypt.hash(user.password, saltRounds, async (err, hash) => {
    if (err) {
      console.log("Error hashing");
    }
    try {
      const result = await db.query(
        "INSERT INTO users (email, username, password) VALUES ($1, $2, $3) RETURNING *",
        [user.email, user.username, hash]
      );
      const newUser = { id: result.rows[0].user_id };
      req.logIn(newUser, (err) => {
        if (err) return next(err);
        return res.json({
          success: true,
          message: "User successfully registered",
          user: newUser,
        });
      });
    } catch (err) {
      console.log(err.message);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  });
});

app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.json({ success: false, message: info.message });
    }
    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.json({ success: true, message: "Login successful", user });
    });
  })(req, res, next);
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/",
  }),
  (req, res) => {
    res.redirect("http://localhost:5173/giveAccess");
  }
);

app.get("/check-auth", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ isLoggedIn: true, user: req.user });
  } else {
    res.json({ isLoggedIn: false });
  }
});

passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email, password, done) => {
      try {
        const response = await db.query(
          "SELECT * FROM users WHERE email = $1",
          [email]
        );
        const user = response.rows[0];
        console.log(user);
        if (response.rows.length > 0) {
          const hash = response.rows[0].password;
          bcrypt.compare(password, hash, function (err, result) {
            // result == true
            if (!result) {
              return done(null, false, { message: "Incorrect Password." });
            }
            return done(null, { id: user.user_id });
          });
        } else {
          return done(null, false, { message: "Email not registered." });
        }
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log(profile);
      const username = profile.emails[0].value.split("@")[0];
      const alreadyUsedEmail = await db.query(
        "SELECT * from users WHERE email = $1",
        [profile.emails[0].value]
      );
      let user_id = 0;
      if (alreadyUsedEmail.rows.length > 0) {
        user_id = alreadyUsedEmail.rows[0].user_id;
      }
      console.log(alreadyUsedEmail.rows);
      if (alreadyUsedEmail.rows.length === 0) {
        const response = await db.query(
          "INSERT INTO users (username, email) VALUES ($1, $2) RETURNING *",
          [username, profile.emails[0].value]
        );
        user_id = response.rows[0].user_id;
      }

      const user = { id: user_id };
      done(null, user);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  // done(null, { id, name: "Demo user", email: "DemoEmail@demo.com" });
  try {
    const result = await db.query("SELECT  * FROM users WHERE user_id = $1", [
      id,
    ]);
    done(null, result.rows[0]);
  } catch (err) {
    done(err);
  }
});
app.listen(port, () => {
  console.log(`Server runnning on port ${port}`);
});
