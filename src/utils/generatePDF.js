import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
import formatDate from "./formatDate";
import translations from "../translations/translations";

const generatePDF = (
  estimate,
  tableRows,
  total,
  taxRate,
  taxAmount,
  estimateLanguage
) => {
  if (!estimate || tableRows.length === 0) {
    alert(
      translations[estimateLanguage]?.emptyEstimate ||
        "Estimate is empty. Add some rows"
    );
    return;
  }

  const t = translations[estimateLanguage] || translations["en"];

  const doc = new jsPDF();
  doc.addFont("../../public/fonts/Roboto-Regular.ttf", "Roboto", "normal");
  doc.setFont("Roboto");

  // Document header
  doc.setFontSize(18);
  doc.text(`${t.estimate}: ${estimate.name}`, 14, 15);

  // Executor data
  doc.setFontSize(10);
  doc.text(`${t.contractor}: Casian & Co.`, 14, 25);
  doc.text(`${t.address}: c/Calle 12, Lloret de Mar`, 14, 32);
  doc.text(`${t.phone}: [+123445678]`, 14, 39);
  doc.text(`${t.date}: ${formatDate(new Date())}`, 14, 46);

  let startY = 55;

  // Group works by category
  const categorizedRows = tableRows.reduce((acc, row) => {
    const category = row.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(row);
    return acc;
  }, {});

  Object.entries(categorizedRows).forEach(([category, rows], categoryIndex) => {
    doc.setFontSize(12);
    doc.setFont("Roboto");
    doc.text(`${t.category} ${categoryIndex + 1}: ${category}`, 14, startY, {
      align: "left",
    });
    startY += 7;

    // Estimate table
    const tableColumnPDF = [
      "ID",
      t.workName,
      t.unit,
      t.quantity,
      `${t.priceForUnit} (€)`,
      `${t.total} (€)`,
    ];
    const tableRowsPDF = tableRows.map((row, workIndex) => [
      `${categoryIndex + 1}.${workIndex + 1}`,
      row.workName,
      row.unit,
      row.quantity,
      Number(row.priceForUnit || 0).toFixed(2),
      Number(row.result || 0).toFixed(2),
    ]);

    autoTable(doc, {
      head: [tableColumnPDF],
      body: tableRowsPDF,
      startY,
      theme: "plain",
      styles: {
        textColor: [0, 0, 0],
        lineColor: [0, 0, 0],
        lineWidth: 0.3,
        font: "Roboto",
        fontStyle: "normal",
      },
    });

    startY = doc.lastAutoTable.finalY + 10;

    // console.log(doc.getFontList());
  });

  // Conclusions
  // let finalY = doc.lastAutoTable.finalY + 10;
  // const pageWidth = doc.internal.pageSize.width;
  // const marginRight = 14;

  // doc.setFontSize(10);

  // const rightAlignX = pageWidth - marginRight;

  // doc.text(`${t.subtotal}: ${total.toFixed(2)} €`, rightAlignX, finalY, {
  //   align: "right",
  // });
  // doc.text(
  //   `${t.tax}: (${taxRate}%): ${taxAmount.toFixed(2)} €`,
  //   rightAlignX,
  //   finalY + 7,
  //   { align: "right" }
  // );
  // doc.text(
  //   `${t.totalWithTax}: ${(total + taxAmount).toFixed(2)} €`,
  //   rightAlignX,
  //   finalY + 14,
  //   {
  //     align: "right",
  //   }
  // );

  // window.open(doc.output("bloburl"), "_blank");

  const pageWidth = doc.internal.pageSize.width;
  const marginRight = 14;
  const rightAlignX = pageWidth - marginRight;

  doc.setFontSize(10);
  doc.setFont("Roboto", "normal");

  doc.text(`${t.subtotal}: ${total.toFixed(2)} €`, rightAlignX, startY, {
    align: "right",
  });
  doc.text(
    `${t.tax}: (${taxRate}%): ${taxAmount.toFixed(2)} €`,
    rightAlignX,
    startY + 7,
    { align: "right" }
  );
  doc.text(
    `${t.totalWithTax}: ${(total + taxAmount).toFixed(2)} €`,
    rightAlignX,
    startY + 14,
    {
      align: "right",
    }
  );

  window.open(doc.output("bloburl"), "_blank");
};

export default generatePDF;
