const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");

module.exports = async (req, res) => {
  const data = req.body;
  const templateHtml = fs.readFileSync(
    path.join(__dirname, "template.html"),
    "utf8"
  );
  const template = handlebars.compile(templateHtml);
  const filledHtml = template(data);

  res.status(200).json({ html: filledHtml });
};
