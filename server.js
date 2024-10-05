const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
const path = require("path");

const app = express();
const port = 3002;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const uri = "mongodb://localhost:27017/123";
const client = new MongoClient(uri);

async function connect() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}

connect();

app.post("/submit-form", async (req, res) => {
  const { userName, designName, description } = req.body;
  console.log("Form data received:", { userName, designName, description });

  try {
    const db = client.db("123");
    const collection = db.collection("feedback");

    const result = await collection.insertOne({
      userName,
      designName,
      description,
    });
    console.log("Inserted document:", result.ops[0]);

    res.send("Feedback submitted successfully");
  } catch (err) {
    console.error("Error inserting document:", err);
    res.status(500).send("Error submitting feedback");
  }
});

app.get("/feedback", async (req, res) => {
  try {
    const db = client.db("123");
    const collection = db.collection("feedback");

    const feedbacks = await collection.find({}).toArray();
    res.json(feedbacks);
  } catch (err) {
    console.error("Error fetching data from MongoDB:", err);
    res.status(500).send("Internal server error");
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
