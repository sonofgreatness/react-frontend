import jsPDF from "jspdf";

class PdfUtils {
  generatePDF = (tripData, logData, activityLogs,summaries) => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    console.log("summaries", JSON.stringify(summaries)); 
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Define section heights
    const bannerHeight = pageHeight * 0.07;
    const tripSectionHeight = pageHeight * 0.10;
    const chartHeight = pageHeight * 0.40;
    const logSectionHeight = pageHeight - (bannerHeight + tripSectionHeight + chartHeight);

    this.drawBanner(doc, pageWidth, bannerHeight);
    this.drawTripSection(doc, tripData, pageWidth, bannerHeight, tripSectionHeight);
    this.drawChart(doc, activityLogs, pageWidth, bannerHeight + tripSectionHeight, chartHeight);
    this.drawLogSection(doc, logData, pageWidth, bannerHeight + tripSectionHeight + chartHeight, logSectionHeight);

    doc.save("ELD_Report.pdf");
  };

  drawBanner(doc, pageWidth, height) {
    doc.setFillColor(50, 50, 50);
    doc.rect(0, 0, pageWidth, height, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text("SPOTTER AI TRUCKING", pageWidth / 2, height / 2 - 2, { align: "center" });
    doc.setFontSize(10);
    doc.text("Electronic Logging Device (ELD) Report", pageWidth / 2, height / 2 + 4, { align: "center" });
    doc.setTextColor(0, 0, 0);
  }

  drawTripSection(doc, tripData, pageWidth, startY, height) {
    const tripInfo = [
      `Trip: ${tripData.from_place} → ${tripData.to_place}`,
      `Start Date: ${tripData.start_date}`,
      `End Date: ${tripData.end_date || "Ongoing"}`,
    ];
    const columnWidth = pageWidth / tripInfo.length;
    const y = startY + height / 2;
    doc.setFontSize(12);
    tripInfo.forEach((text, index) => {
      doc.text(text, columnWidth * index + 10, y, { align: "left" });
    });
  }

  drawChart(doc, activityLogs, pageWidth, startY, height) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = 500;
    canvas.height = 200;

    const X_STEPS = 96;
    const Y_STEPS = 4;
    const X_GAP = canvas.width / X_STEPS;
    const Y_GAP = canvas.height / Y_STEPS;

    const ACTIVITIES = ["ONDUTY", "DRIVING", "SLEEPERBERTH", "OFFDUTY"];
    const COLORS = { ONDUTY: "red", DRIVING: "blue", SLEEPERBERTH: "green", OFFDUTY: "purple" };

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#D3D3D3";

    // Draw vertical grid lines and x-axis labels
    for (let i = 0; i <= X_STEPS; i++) {
      const x = i * X_GAP;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
      if (i % 4 === 0) {
        ctx.fillText(i / 4, x, canvas.height - 5);
      }
    }

    // Draw horizontal grid lines and y-axis labels
    for (let i = 0; i < ACTIVITIES.length; i++) {
      const y = i * Y_GAP;
      ctx.beginPath();
      ctx.moveTo(0, y + Y_GAP / 2);
      ctx.lineTo(canvas.width, y + Y_GAP / 2);
      ctx.stroke();
      ctx.fillText(ACTIVITIES[i], 5, y + Y_GAP / 2);
    }
    
    ctx.lineWidth = 2;
    for (let i = 0; i < activityLogs.length - 1; i++) {
      const point = activityLogs[i];
      const nextPoint = activityLogs[i + 1];

      const x1 = (point.x_datapoint - 1) * X_GAP;
      const y1 = ACTIVITIES.indexOf(point.activity) * Y_GAP + Y_GAP / 2;
      const x2 = (nextPoint.x_datapoint - 1) * X_GAP;
      const y2 = ACTIVITIES.indexOf(nextPoint.activity) * Y_GAP + Y_GAP / 2;

      ctx.strokeStyle = COLORS[point.activity];
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    const imgData = canvas.toDataURL("image/png");
    doc.addImage(imgData, "PNG", 10, startY + 10, pageWidth - 20, height - 20);
  }

  drawLogSection(doc, logData, pageWidth, startY, height) {
    const logDetails = [
      `Date: ${logData.start_date}`,
      `Carrier: ${logData.name_of_carrier}`,
      `Co-driver: ${logData.name_of_codriver}`,
      `Shipping Doc #: ${logData.shipping_document_number}`,
      `Total Miles: ${logData.total_miles_driven}`,
    ];

    doc.setFontSize(11);
    const columnWidth = pageWidth / (logDetails.length / 2);
    let y = startY + height / 3;

    logDetails.forEach((text, index) => {
      let x = (index % 2) * columnWidth + 10;
      doc.text(text, x, y);
      if (index % 2 !== 0) y += 7;
    });
  }
}

export default new PdfUtils();
