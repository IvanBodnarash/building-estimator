import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
import formatDate from "./formatDate";

const generatePDF = (estimate, tableRows, total, taxRate, taxAmount) => {
  if (!estimate || tableRows.length === 0) {
    alert("Estimate is empty. Add some rows");
  }

  const doc = new jsPDF();
  doc.addFont("../../public/fonts/Roboto-Regular.ttf", "Roboto", "normal");
  doc.setFont("Roboto");

  // Document header
  doc.setFontSize(18);
  doc.text(`Estimate: ${estimate.name}`, 14, 15);

  // Executor data
  doc.setFontSize(12);
  doc.text("Contractor: [Company Name]", 14, 25);
  doc.text("Address: [Address]", 14, 32);
  doc.text("Phone: [+123445678]", 14, 39);
  doc.text(`Date: ${formatDate(new Date())}`, 14, 46);

  // Estimate table
  const tableColumnPDF = [
    "ID",
    "Work",
    "Unit",
    "Quantity",
    "Price per Unit (€)",
    "Total (€)",
  ];
  const tableRowsPDF = tableRows.map((row) => [
    row.id,
    row.workName,
    row.unit,
    row.quantity,
    Number(row.priceForUnit || 0).toFixed(2),
    Number(row.result || 0).toFixed(2),
  ]);

  console.log("Table Rows:", tableRows);
  console.log("Table Rows Processed for PDF:", tableRowsPDF);
  autoTable(doc, {
    head: [tableColumnPDF],
    body: tableRowsPDF,
    startY: 55,
    theme: "plain",
    styles: {
      textColor: [0, 0, 0],
      lineColor: [0, 0, 0],
      lineWidth: 0.3,
      font: "Roboto",
      fontStyle: "normal",
    },
  });

  console.log(doc.getFontList());

  // Conclusions
  let finalY = doc.lastAutoTable.finalY + 10;
  const pageWidth = doc.internal.pageSize.width;
  const marginRight = 14;

  doc.setFontSize(12);

  const rightAlignX = pageWidth - marginRight;

  doc.text(`Subtotal: ${total.toFixed(2)} €`, rightAlignX, finalY, {
    align: "right",
  });
  doc.text(
    `Tax: (${taxRate}%): ${taxAmount.toFixed(2)} €`,
    rightAlignX,
    finalY + 7,
    { align: "right" }
  );
  doc.text(
    `Total (With Tax): ${(total + taxAmount).toFixed(2)} €`,
    rightAlignX,
    finalY + 14,
    {
      align: "right",
    }
  );

  window.open(doc.output("bloburl"), "_blank");
};

export default generatePDF;
