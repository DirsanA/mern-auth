import userModel from "../models/userModel.js";

export async function getUser(req, res) {
  try {
    const { userId } = req.body;

    if (!userId) {
      console.log("Missing id filds");
      return res.json({
        success: "false",
        message: "Missing id filds",
      });
    }

    const user = await userModel.findById(userId);

    if (!user) {
      console.log("User not found");
      return res.json({
        success: "false",
        message: "User not found",
      });
    }

    return res.json({
      success: "true",
      data: user,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
  }
}
