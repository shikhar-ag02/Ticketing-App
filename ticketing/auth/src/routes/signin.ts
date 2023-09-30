import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { validateRequest } from "../middlewares/validate-request";
import { User } from "../models/user";
const router = express.Router();
import { BadRequestError } from "../errors/bad-request-error";
import { Password } from "../services/password";

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("You must supply a password"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError("Invalid login credentials");
    }

    const passwordMatch = await Password.compare(
      existingUser.password,
      password
    );
    if (!passwordMatch) {
      throw new BadRequestError("Invalid login credentials");
    }
    //Everything seems fine, send the jwt token
    //Generating a jwt
    const userjwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY!
    );

    //Storing the jwt on the session object(of cookie-session)
    req.session = {
      jwt: userjwt,
    };
    res.status(200).send(existingUser);
  }
);

export { router as signinRouter };
