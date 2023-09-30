//middleware to reject request if user is not logged in (if req.currentUser is empty)

import { Request, Response, NextFunction } from "express";
import { NotAuthorizedError } from "../errors/not_authorized-error";
export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.currentUser) {
    return new NotAuthorizedError();
  }
  next();
};
