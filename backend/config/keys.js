//Figure out what set of credentials to return
if (process.env.NODE_ENV === "production") {
  //import i.e require it & immediately export it.
  module.exports = require("./prod");
} else {
  module.exports = require("./dev");
}
