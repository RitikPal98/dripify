const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { HfInference } = require("@huggingface/inference");
require("dotenv").config();

const Collab = require("./models/Collab");

const app = express();
const port = process.env.PORT || 5000;

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Initialize Hugging Face
const hf = new HfInference(process.env.HUGGING_FACE_TOKEN);

app.use(cors());
app.use(express.json());

// Get all collabs
app.get("/api/collabs", async (req, res) => {
  try {
    const collabs = await Collab.find().sort({ createdAt: -1 });
    res.json({ success: true, data: collabs });
  } catch (error) {
    console.error("Error fetching collabs:", error);
    res.status(500).json({ success: false, error: "Failed to fetch collabs" });
  }
});

// Generate and save new collab
app.post("/api/generate-collab", async (req, res) => {
  try {
    const { brand1, brand2 } = req.body;
    console.log("Generating collab for:", { brand1, brand2 });

    // Generate description
    const descriptionPrompt = `Create a brief, exciting description for a fashion collaboration between ${brand1} and ${brand2}. Make it sound innovative and slightly absurd.`;
    const description = await hf.textGeneration({
      model: "gpt2",
      inputs: descriptionPrompt,
      parameters: {
        max_length: 100,
        temperature: 0.9,
        return_full_text: false,
      },
    });

    // Generate image
    const imagePrompt = `A professional fashion advertisement showcasing a collaboration between ${brand1} and ${brand2}. High-end commercial photography.`;
    const imageBlob = await hf.textToImage({
      model: "stabilityai/stable-diffusion-xl-base-1.0",
      inputs: imagePrompt,
      parameters: {
        negative_prompt: "low quality, blurry",
        num_inference_steps: 50,
        guidance_scale: 7.5,
      },
    });

    // Convert image to base64
    const arrayBuffer = await imageBlob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString("base64");
    const imageUrl = `data:image/jpeg;base64,${base64Image}`;

    // Save to MongoDB
    const newCollab = new Collab({
      brand1,
      brand2,
      description: description.generated_text,
      imageUrl,
    });

    await newCollab.save();

    res.json({
      success: true,
      data: newCollab,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to generate collab",
    });
  }
});

// Delete collab
app.delete("/api/collabs/:id", async (req, res) => {
  try {
    await Collab.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting collab:", error);
    res.status(500).json({ success: false, error: "Failed to delete collab" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
