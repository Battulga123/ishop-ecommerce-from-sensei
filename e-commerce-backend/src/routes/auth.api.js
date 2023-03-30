import express from "express";
import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import Users from "../models/Users";
import UserRole from "../models/UserRole";

const authApi = express.Router();

authApi.post("/register", async (request, response) => {
  const data = request.body;

  if (data) {
    const oldUser = await Users.findOne({ email: data.email });
    if (oldUser) {
      return response.status(400).json({
        success: false,
        status: "Hereglegch ali hediin uussen baina. Nevtertch orno uu",
      });
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    data.password = hashedPassword;

    try {
      const user = await Users.create(data);
      const result = await user.populate("userrole");
      response.status(201).json({
        message: "User created successfull",
        data: result,
      });
    } catch (error) {
      response.status(500).json({
        success: false,
        error: error,
      });
    }
  } else {
    return response.json({
      error: "input field is empty",
    });
  }
});

authApi.post("/login", async (request, response) => {
  try {
    const { email, password } = request.body;

    if (!(email && password)) {
      response.status(400).json({
        success: false,
        status: "утгуудыг бүрэн оруулна уу",
        updated: 1,
        email: email,
        password: password,
      });
      return;
    }

    const user = await Users.findOne({ email });

    const isMatch = await bcrypt.compare(password, user?.password);

    if (user && isMatch) {
      const jwBody = { user_id: user._id, email: email };
      const token = jwt.sign(jwBody, "PrivateKey", { expiresIn: "24h" });
      response.status(200).json({
        success: true,
        token: token,
      });
      return;
    } else {
      return response.json({
        success: false,
        status: "Nuuts ug ner hoorondoo taarahgui baina",
      });
    }
  } catch (err) {
    response.status(500).json({
      data: "aldaa garlaa",
      error: err,
    });
  }
});

authApi.post("/role/create", async (req, res) => {
  const { name } = req.body;
  const result = await UserRole.create({ name });

  res.status(200).json({
    data: result,
  });
});

authApi.get("/role/list", async (req, res) => {
  const result = await UserRole.find({});
  console.log(result);
  res.status(200).json({
    data: result,
  });
});

module.exports = authApi;
