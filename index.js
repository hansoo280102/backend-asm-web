const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const port = process.env.PORT || 3333;

//parse option
app.use(express.json());
app.use(cors());

const blogRoutes = require("./src/routes/blog.route");
app.use("/api/blogs", blogRoutes);

async function main() {
  await mongoose.connect(process.env.MONGO_URl);
}

main()
  .then(() => console.log("Mongodb connected successfully"))
  .catch((err) => console.log(err));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
