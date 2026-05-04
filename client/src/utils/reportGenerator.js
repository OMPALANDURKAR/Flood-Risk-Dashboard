import jsPDF from "jspdf";

export const generateReport = (data) => {
  try {
    if (!data) {
      alert("Please select a district first");
      return;
    }

    const pdf = new jsPDF();

    // =========================
    // TITLE
    // =========================
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);
    pdf.text("Flood Risk Report", 20, 20);

    pdf.setFontSize(14);
    pdf.text(`District: ${data.district}`, 20, 30);

    // =========================
    // DATA SECTION
    // =========================
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);

    let y = 50;

    const line = (label, value) => {
      pdf.text(`${label}: ${value}`, 20, y);
      y += 10;
    };

    line("Rainfall", `${data.rainfall.toFixed(1)} mm`);
    line("Water Level", `${data.waterLevel.toFixed(1)} m`);
    line("Discharge", `${data.discharge.toFixed(0)} m³/s`);
    line("Humidity", `${data.humidity.toFixed(0)} %`);
    line("Elevation", `${data.elevation.toFixed(0)} m`);
    line("Flood History", data.historicalFloods);

    // =========================
    // RISK LOGIC (MATCH YOUR APP)
    // =========================
    let risk = "LOW";

    if (
      data.rainfall > 220 &&
      data.waterLevel > 7.5 &&
      data.discharge > 3700 &&
      (data.historicalFloods === 1 || data.elevation < 2500)
    ) {
      risk = "HIGH";
    } else if (
      data.rainfall >= 100 &&
      data.rainfall <= 220 &&
      data.waterLevel >= 4 &&
      data.waterLevel <= 7.5 &&
      data.discharge >= 2000 &&
      data.discharge <= 3700 &&
      data.humidity > 60
    ) {
      risk = "MEDIUM";
    }

    // =========================
    // RISK DISPLAY
    // =========================
    y += 10;

    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(
      risk === "HIGH" ? 255 : risk === "MEDIUM" ? 255 : 0,
      risk === "HIGH" ? 0 : risk === "MEDIUM" ? 165 : 128,
      0
    );

    pdf.text(`Risk Level: ${risk}`, 20, y);

    pdf.setTextColor(0, 0, 0);

    // =========================
    // EXPLANATION
    // =========================
    y += 20;

    pdf.setFont("helvetica", "normal");

    pdf.text(
      "Flood risk is determined based on rainfall intensity, river discharge,",
      20,
      y
    );
    y += 8;

    pdf.text(
      "water level, terrain elevation, and historical flood occurrence.",
      20,
      y
    );

    // =========================
    // SAVE
    // =========================
    pdf.save(`${data.district}_Flood_Report.pdf`);
  } catch (err) {
    console.error(err);
    alert("Failed to generate report");
  }
};