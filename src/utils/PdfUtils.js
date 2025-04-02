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
    this.drawChart(doc, activityLogs,summaries, pageWidth, bannerHeight + tripSectionHeight, chartHeight);
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
    doc.setFontSize(10);
    tripInfo.forEach((text, index) => {
      doc.text(text, columnWidth * index + 5, y, { align: "left" });
    });
  }

  drawChart(doc, activityLogs, summaries, pageWidth, startY, height) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 300;
    canvas.height = 200;

    const X_STEPS = 96;
    const Y_STEPS = 4;
    const X_GAP = canvas.width / X_STEPS;
    const Y_GAP = canvas.height / Y_STEPS;

    const ACTIVITIES = ["ONDUTY", "DRIVING", "SLEEPERBERTH", "OFFDUTY"];
    const COLORS = { ONDUTY: "red", DRIVING: "blue", SLEEPERBERTH: "green", OFFDUTY: "purple" };

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#D3D3D3";

    for (let i = 0; i <= X_STEPS; i++) {
      const x = i * X_GAP;
     
      if (i % 4 === 0) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
        ctx.fillText(i / 4, x, canvas.height - 5);
      }
    }

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
    console.log("Generated image data:", imgData);
    console.log("Chart height:", height);

    doc.addImage(imgData, "PNG", 10, startY + 10, 120, height - 20);
   

    const remarksCanvas = document.createElement("canvas");
    const remarksCtx = remarksCanvas.getContext("2d");
    remarksCanvas.width = 300;
    remarksCanvas.height = 100;
  
    remarksCtx.clearRect(0, 0, remarksCanvas.width, remarksCanvas.height);
    remarksCtx.strokeStyle = "#D3D3D3";
  
    // Draw vertical grid lines
    for (let i = 0; i <= X_STEPS; i++) {
      const x = i * X_GAP;
      if (i % 4 === 0) {
      remarksCtx.beginPath();
      remarksCtx.moveTo(x, 0);
      remarksCtx.lineTo(x, remarksCanvas.height);
      remarksCtx.stroke();
      }
    }
  
    // Mark points with non-empty remarks
    remarksCtx.font = "8px Arial"; // Reduced font size
    remarksCtx.fillStyle = "black";
  
    activityLogs.forEach((log) => {
      if (log.remark && log.remark.trim() !== "") {
        const x = (log.x_datapoint - 1) * X_GAP;
        const y = 40; // Middle of the chart
  
        // Draw 45-degree slanting remark
        remarksCtx.save();
        remarksCtx.translate(x, y);
        remarksCtx.rotate(-Math.PI / 4);
        remarksCtx.fillText(log.remark, 0, 0);
        remarksCtx.restore();
      }
    });
  
    const remarksImgData = remarksCanvas.toDataURL("image/png");
    doc.addImage(remarksImgData, "PNG", 10, startY + height - 10, 120, 40);





    doc.setFontSize(10);
    let tableStartX = 140;
    let tableStartY = startY + 10;
    doc.text("Activity Summary", tableStartX, tableStartY);
    tableStartY += 6;
    doc.text("Activity", tableStartX, tableStartY);
    doc.text("Hours", tableStartX + 40, tableStartY);
    doc.text("Minutes", tableStartX + 60, tableStartY);
    tableStartY += 4;
    doc.line(tableStartX, tableStartY, tableStartX + 80, tableStartY);
    tableStartY += 4;

    Object.entries(summaries.sums).forEach(([activity, intervals]) => {
      const totalMinutes = intervals * 15;
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      doc.text(activity, tableStartX, tableStartY);
      doc.text(hours.toString(), tableStartX + 40, tableStartY);
      doc.text(minutes.toString(), tableStartX + 60, tableStartY);
      tableStartY += 6;
    });
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
