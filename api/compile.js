const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");

// Funzione che formatta testo semplice in HTML con paragrafi e <br>
function autoFormatSmart(text) {
  if (!text) return "";

  const paragraphs = text
    .split(/\n\s*\n/) // doppio a capo = nuovo paragrafo
    .map(p => {
      const withLineBreaks = p.trim().replace(/\n/g, "<br>");
      return `<p style="line-height:1.5; font-family:Arial;">${withLineBreaks}</p>`;
    });

  return paragraphs.join("\n");
}

module.exports = async (req, res) => {
  const data = req.body;
  
  const selectedTemplate = (data.Template || "template")
  .toString()
  .trim()        // rimuove spazi/invii ai lati
  .toLowerCase();// tutto minuscolo

//console.log("DEBUG — Payload received:", data);
//console.log("DEBUG — Selected template:", selectedTemplate);

  const templatePath = path.join(__dirname, `${selectedTemplate}.html`);
  if (!fs.existsSync(templatePath)) {
    return res.status(400).json({ error: "Template non trovato" });
  }
  console.log("DEBUG — Template path:", templatePath);

  // Applica formattazione smart ai campi testuali lunghi
  if (data.Descrizione) data.Descrizione = autoFormatSmart(data.Descrizione);

  const rawTemplate = fs.readFileSync(templatePath, "utf8");
  const template = handlebars.compile(rawTemplate);
  const filledHtml = template(data);

  res.setHeader("Content-Type", "application/json");
  res.status(200).json({ html: filledHtml });
};
