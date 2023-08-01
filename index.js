const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
app.use(cors());

const corsOptions = {
  origin: "*",
  methods: [],
  allowedHeaders: [],
  exposedHeaders: [],
  credentials: true,
};
router.all("./signup", cors(corsOptions));

const mongoURI =
  "mongodb+srv://anurag2361:anuraggg@anurag2361.1pepyj9.mongodb.net/?retryWrites=true&w=majority";
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

app.use(express.json());
const uRoutes = require("./userRoutes");
const bRoutes = require("./blogRoutes");
const router = require("./userRoutes");
app.use(uRoutes);
app.use(bRoutes);
const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Port ${port}`));
