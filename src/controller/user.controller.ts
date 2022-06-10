import { Request, Response } from "express";
import { CreateUserInput } from "../schema/user.schema";
import { createUser } from "../service/user.service";
import logger from "../utils/logger";

export async function createUserHandler(
  req: Request<{}, {}, CreateUserInput["body"]>,
  res: Response
) {
  try {
    const user = await createUser(req.body);
    return res.send(user);
  } catch (e: any) {
    logger.error(e);

    if (e.message.includes("dup key: { email:")) {
      /* duplicated email error */
      return res.status(400).json([{
        "validation":"email",
        "code":"duplicated",
        "message":"This email is already registered",
        "path":[
          "body",
          "email"
        ]
      }])
    }

    return res.status(409).send(e.message);
  }
}