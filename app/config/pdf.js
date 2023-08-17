const fs = require("fs");
var html_to_pdf = require("html-pdf-node");
const db = require("./db");
//var config = require("../config/config.json");

const createPDF = async (html) => {
 
  var pathTemp = "./app/";

  let options = {
    format: "A4",
    scale: 1,
    preferCSSPageSize: true,
    printBackground: true,
    margin: {
      top: "0.4cm",
      left: "0cm",
      right: "0.4cm",
      bottom: "1cm",
    },
    // args: ['--no-sandbox', '--disable-setuid-sandbox'],
    path : pathTemp + `LAUDO.pdf`
    // file: `./app/models/nf/NF${name_}-${cpf_}.pdf`,
  };

  //console.log(html)
  pdfBuffer = await html_to_pdf.generatePdf({ content: html }, options);

  return pdfBuffer;
};

module.exports = {
  createPDF,
};
