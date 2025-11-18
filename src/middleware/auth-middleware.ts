import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserRequest } from "../type/user-request";
import { prismaClient } from "../app/database";

export const authMiddleware = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ message: "Unauthorized" }).end();
  }

  const token = header.split(" ")[1];

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as jwt.JwtPayload;
    
    const user = await prismaClient.user.findUnique({
      where: {
        id: payload.id as string
      }
    });

    if(!user) {
      return res.status(401).json({ errors: "Unauthorized" }).end();
    }

    req.user = user!;
    next();
  } catch (err) {
    return res.status(401).json({ errors: "Unauthorized" }).end();
  }
};
