import { getUserById } from "#db/queries/users";
import { verifyToken } from "#utils/jwt";

export default async function getUserFromToken(req, res, next) {
  const authorization = req.get("authorization");

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(); // no token, no user — but not an error
  }

  const token = authorization.split(" ")[1];

  try {
    const { id } = verifyToken(token);

    const user = await getUserById(id);
    req.user = user ?? null;

    return next();
  } catch (err) {
    console.error("Token verification failed:", err);
    return res.status(401).send("Invalid token.");
  }
}
