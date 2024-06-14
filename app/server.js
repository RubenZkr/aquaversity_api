const app = require("./app");
const PORT = process.env.PORT || 5050;
require("dotenv").config();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
