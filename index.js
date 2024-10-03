import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import AssignedAssest from "./Models/AssignedAssits.js";
import Location from "./Models/Location.js";
import path from "path";
import { fileURLToPath } from "url";
import User from "./Models/User.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const secretKey =
  "280891b410b6f5279a90fe52bb5b8b3806e14b57b2c9ac310a229f50c47630d1";

const vector = "0142a78e74b87ab26b961b8bd1d96cf6";

const jwt_secret =
  "25be109914839804d883b367353383f8212b9aa44d7eb72c12232afbe77bcbdb";

// Encrypt the user ID
const encryptId = (id) => {
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(secretKey),
    Buffer.from(vector)
  ); // Replace with your secret key and initialization vector
  let encryptedId = cipher.update(id, "utf8", "hex");
  encryptedId += cipher.final("hex");
  return encryptedId;
};

// Decrypt the user ID (if needed)
const decryptId = (encryptedId) => {
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(secretKey),
    Buffer.from(vector)
  ); // Replace with your secret key and initialization vector
  let decryptedId = decipher.update(encryptedId, "hex", "utf8");
  decryptedId += decipher.final("utf8");
  return decryptedId;
};

app.use(express.static(path.join(__dirname, "dist")));

app.get("/", function (req, res) {
  console.log(path.join(__dirname, "dist", "index.html"));
  res.sendFile(path.join(__dirname, "dist", "index.html"), (err) => {
    if (err) console.log("Error line No. 56", err);
  });
});

app.get("/assets/findall", async (req, res) => {
  try {
    // console.log("Hi");
    const assignedAssests = await AssignedAssest.find();
    console.log(assignedAssests);
    res.status(200).json(assignedAssests);
  } catch (err) {
    console.error("Error retrieving records:", err);
    res.status(400).json("Server Error");
  }
});

app.get("/assets/find-by-category/:category/:value", async (req, res) => {
  const category = req.params.category;
  const value = req.params.value.toUpperCase();
  console.log(category, value, req.params);
  let assignedAssests;
  try {
    if (category === "LOCATION") {
      console.log("1");
      assignedAssests = await AssignedAssest.find({ location: value });
    } else if (category === "ASSET_CATEGORY") {
      console.log("2");
      assignedAssests = await AssignedAssest.find({ asset_category: value });
    } else if (category === "PROJECT") {
      console.log("Hi");
      // Use regex to find entries that contain the "value" in the project field
      assignedAssests = await AssignedAssest.find({ project: { $regex: value, $options: "i" } });
    } else if (category === "CDSID") {
      console.log("4");
      assignedAssests = await AssignedAssest.find({ cdsid: value });
    }


    console.log(assignedAssests);
    res.status(200).json(assignedAssests);
  } catch (err) {
    res.json("Server Error");
    console.log(err);
  }
});

app.post("/assets/add", async (req, res) => {
  // Retrieve the token from the Authorization header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; // Get the token part after "Bearer "

  // Verify the token
  if (!token) {
    return res.status(401).json({ message: "Token is required" });
  }

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, jwt_secret);

    // Process the asset data
    let {
      name,
      cdsid,
      location,
      assetType,
      assetCategory,
      assetId,
      project,
      comment,
    } = req.body.asset;

    // Convert fields to uppercase
    name = name.toUpperCase();
    cdsid = cdsid.toUpperCase();
    location = location.toUpperCase();
    assetCategory = assetCategory.toUpperCase();
    project = project.toUpperCase();
    assetType = assetType.toUpperCase();
    comment = comment.toUpperCase();

    // Create and save the asset
    const assignedAssest = new AssignedAssest({
      name,
      cdsid,
      location,
      asset_type: assetType,
      asset_category: assetCategory,
      asset_id: assetId,
      project,
      comment,
    });

    await assignedAssest.save();
    res.status(201).json("Post Created");
  } catch (err) {
    // Handle token verification errors
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired or invalid" });
    }

    // Handle other errors
    console.error("Error creating a record:", err);
    res.status(500).json("Server Error");
  }
});

app.get("/location", async (req, res) => {
  try {
    const data = await Location.find();
    console.log(data);
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(400).json("Server Error");
  }
});

// api route to fetch all the distinct projects

app.get("/find/distinct-projects", async (req, res) => {
  try {
    const distinctProjects = await AssignedAssest.distinct("project");
    res.status(200).json(distinctProjects);
  } catch (err) {
    console.error("Error retrieving distinct projects:", err);
    res.status(400).json("Server Error");
  }
});

// api route to fetch all the distinct names

app.get("/find/distinct-cdsids", async (req, res) => {
  try {
    const distinctNames = await AssignedAssest.distinct("cdsid");
    res.status(200).json(distinctNames);
  } catch (err) {
    console.error("Error retrieving distinct cdsids:", err);
    res.status(400).json("Server Error");
  }
});

app.post("/auth", async (req, res) => {
  const { cdsid, password } = req.body;
  const exp_time = "2s";
  // Validate input
  if (!cdsid || !password) {
    return res.status(400).json({ message: "cdsid and password are required" });
  }

  try {
    // Search for the user in the database
    const user = await User.findOne({ cdsid });
    if (!user) {
      console.log(1);
      return res.status(403).json({ message: "Invalid credentials" });
    }

    // Encrypt the provided password and check if it matches
    if (user.password !== password) {
      console.log(2);
      return res.status(403).json({ message: "Invalid credentials" });
    }
    console.log(3);
    const encryptId = user._id;
    // Generate JWT token
    const token = jwt.sign(
      { id: encryptId },
      jwt_secret,
      { expiresIn: "15m" } // Token expiry time
    );

    // Send token to client
    res.json({ token });
  } catch (error) {
    console.error("Error during authentication:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/register", async (req, res) => {
  const { cdsid, password } = req.body;
  //console.log("Cdsid: " + cdsid + " Password: " + password);

  // Validate input
  if (!cdsid || !password) {
    return res.status(400).json({ message: "cdsid and password are required" });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ cdsid });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create a new user
    const newUser = new User({
      cdsid,
      password, // Note: Password should be hashed in a real application
    });

    // Save the new user to the database
    await newUser.save();

    // Respond with success
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

mongoose
  .connect(
    "mongodb+srv://kush:Laltain100@cluster0.u5wrb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.log("DB Error", err);
  });
