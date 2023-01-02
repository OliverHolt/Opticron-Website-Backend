const app = require("./app.js");

const { PORT = 8008 } = process.env;

app.listen(9090, () => {
  console.log(`listening on ${PORT}...`);
});
