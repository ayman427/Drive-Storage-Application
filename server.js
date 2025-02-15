import express from "express";
import multer from "multer";
import path from "path";
import cors from "cors";

const app = express();
const PORT = 5000;

app.use(cors()); // Add this line

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Endpoint to upload file
app.post("/upload", upload.single("file"), (req, res) => {
  if (req.file) {
    res.status(200).json({ fileUrl: `/uploads/${req.file.filename}` });
  } else {
    res.status(400).json({ error: "File not uploaded" });
  }
});

// Serve static files from uploads directory
app.use("/uploads", express.static("uploads"));

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
