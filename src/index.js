require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
// const path = require("path");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const routes = require("./routes");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());

// app.use(
//   "/files",
//   express.static(path.resolve(__dirname, "..", "tmp", "uploads"))
// );

mongoose.connect(
  process.env.MONGO_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => console.log(`db connected`)
);

const PORT = process.env.PORT || 3131;

app.use(routes);

app.listen(PORT, () => console.log(`server running on port ${PORT}`));
