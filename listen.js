const app = require("./app.js");

const { PORT = 3000 } = process.env;

app.listen(3000, () => {
  console.log(`listening on ${PORT}...`);
});
