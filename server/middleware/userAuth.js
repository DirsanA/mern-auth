import jwt from "jsonwebtoken";

export async function userAuth(req, res, next) {
  const token = req.cookies?.token; // read token from cookies

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
    if (tokenDecode.id) {
      req.userId = tokenDecode.id; // ✅ safer than modifying req.body
      next();
    } else {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
  } catch (err) {
    console.error(err);
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
}
