export default function handler(req, res) {
  const html = `
    <html>
    <body style="font-family: Arial, sans-serif">
    <p>CASINO</p>
    <h1>{{Titolo}}</h1>
    <p>{{Descrizione}}</p>
    <img src="{{Immagine_URL}}" alt="banner" width="600" />
    <p>
      <a
        href="{{Link_CTA}}"
        style="
          background: #007bff;
          color: white;
          padding: 10px 20px;
          text-decoration: none;
        "
        >{{Testo_CTA}}</a
      >
    </p>
  </body>
      </html>
  `;
  res.setHeader("Content-Type", "text/html");
  res.status(200).send(html);
}
