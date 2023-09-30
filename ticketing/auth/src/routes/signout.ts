//route to send a header to tell the browser to dump all the information about the cookie
import express from "express";

const router = express.Router();

router.post("/api/users/signout", (req, res) => {
  req.session = null;
  res.send({});
});

export { router as signoutRouter };
