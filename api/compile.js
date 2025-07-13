const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");

// Smart formatter: double newlines → <p>, single newlines → <br>
function autoFormatSmart(text) {
  if (!text) return "";
  const paragraphs = text
    .split(/\n\s*\n/) // double newline = new paragraph
    .map(p => {
      const withLineBreaks = p.trim().replace(/\n/g, "<br>");
      return `<p style="line-height:1.5; font-family:Arial;">${withLineBreaks}</p>`;
    });
  return paragraphs.join("\n");
}

module.exports = async (req, res) => {
  const data = req.body;

  // ✅ Option A: if raw HTML is sent directly (from Zapier), return it
  if (data.html) {
    return res.status(200).json({ html: data.html });
  }

  // ✅ Option B: fallback to template-based rendering
  const selectedTemplate = (data.Template || "template")
    .toString()
    .trim()
    .toLowerCase();

  const templatePath = path.join(__dirname, `${selectedTemplate}.html`);
  if (!fs.existsSync(templatePath)) {
    return res.status(400).json({ error: `Template '${selectedTemplate}.html' not found` });
  }

  // Format long text fields
  if (data.Descrizione) {
    data.Descrizione = autoFormatSmart(data.Descrizione);
  }

  // Compile the Handlebars template
  const rawTemplate = fs.readFileSync(templatePath, "utf8");
  const template = handlebars.compile(rawTemplate);
  const filledHtml = template(data);

  res.setHeader("Content-Type", "application/json");
  res.status(200).json({ html: filledHtml });
};
