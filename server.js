const app = require("./index");
require("dotenv").config();
const connectDb = require("./src/config/db");

const PORT = process.env.config || 5001;
connectDb();

app.listen(PORT, () => {
  console.log(`Server is listening on PORT ${PORT}`);
});
