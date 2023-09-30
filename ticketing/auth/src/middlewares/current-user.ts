//middleware to extract the JWT payload and set it on req.currentUser

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

//this interface defines the payload
interface UserPayload {
  id: string;
  email: string;
}

//augmenting the req object(already having an existing type definition) to include a currentUser property
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export const currenUser = (req: Request, res: Response, next: NextFunction) => {
  //if the token is not present in req.session, there will be no currently signed user
  if (!req.session || !req.session.jwt) {
    return next();
  }
  //checking if the jwt is valid. If there is some tempering, verify will throw an error, so introduce a try-catch block
  try {
    const payload = jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY!
    ) as UserPayload;
    req.currentUser = payload;
  } catch (err) {}
  next();
};
