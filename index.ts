import express from 'express';
import sessions from 'express-session';
import { User } from './types';
import users from './users.json';

// modify session data
declare module "express-session" {
  interface SessionData {
    user: User;
  }
}

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET = process.env.SECRET || 'default_secret';

app.use(
  sessions({
    secret: SECRET,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
    },
    // Forces the session to be saved back to the session store, 
    // even if the session data was never modified during the request.
    resave: true,
    saveUninitialized: false,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({
    "message": "Welcome to the user sessioning example 🥸!",
    "Logged-in as": req.session.user?.username ?? 'not logged-in'
  });
});

app.post('/login', (req, res) => {
  if (!req.body || !(req.body satisfies User)) {
    res.status(403).json({
      "message": 'bruh'
    });
    return;
  }

  const { username, password }: User = req.body;

  let isAuthenticated = true;

  let user = users.find(user => user.username == username);

  if (!user || user.password != password) {
    isAuthenticated = false;
    res.status(403).json({
      "message": 'bruh'
    });
    return;
  }

  req.session.user = user;
  
  res.status(200).json({
    "message": "log-in success ⚡️"
  });
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
})

app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});