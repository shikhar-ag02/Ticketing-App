//this route enables the react app to know if the user is currently signed in or not
import express from "express";
import jwt from "jsonwebtoken";
const router = express.Router();
import { currenUser } from "../middlewares/current-user";
router.get("/api/users/currentuser", currenUser, (req, res) => {
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
