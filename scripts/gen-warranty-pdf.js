const fs = require("fs");
const path = require("path");

// Simple valid PDF generator — no dependencies needed
// Produces a single-page PDF with warranty info in Courier font

const lines = [
  "BYD TBILISI  /  GT GROUP",
  "",
  "Vehicle Warranty Certificate",
  "(Sample Document for Demonstration)",
  "",
  "========================================",
  "",
  "DEALER INFORMATION",
  "----------------------------------------",
  "Dealer:   BYD Tbilisi / GT Group",
  "Address:  Kakheti Hwy 45A, Tbilisi, Georgia",
  "Phone:    +995 XXX XXX XXX",
  "Email:    info@gtgroup.ge",
  "",
  "",
  "WARRANTY COVERAGE",
  "----------------------------------------",
  "",
  "Standard Warranty Terms:",
  "",
  "  Vehicle Body:       6 years / 150,000 km",
  "  Battery (EV):       8 years / 200,000 km",
  "  Battery (PHEV):     8 years / 150,000 km",
  "  Powertrain:         6 years / 150,000 km",
  "  Paint Warranty:     3 years",
  "  Anti-Perforation:   6 years",
  "",
  "(whichever comes first)",
  "",
  "",
  "COVERED COMPONENTS",
  "----------------------------------------",
  "",
  "  - Electric motor and controller",
  "  - High-voltage battery pack",
  "  - On-board charger",
  "  - DC/DC converter",
  "  - Transmission / reduction gear",
  "  - Steering system",
  "  - Braking system (excl. wear parts)",
  "  - Suspension components",
  "  - Climate control compressor",
  "",
  "",
  "CONDITIONS",
  "----------------------------------------",
  "",
  "  1. Vehicle must be serviced at authorized",
  "     BYD service centers per schedule.",
  "  2. Warranty is non-transferable unless",
  "     approved by the dealer.",
  "  3. Wear parts (brakes, tires, wipers)",
  "     are excluded from coverage.",
  "  4. Damage from misuse, accidents, or",
  "     unauthorized modifications is excluded.",
  "",
  "",
  "IMPORTANT NOTICE",
  "----------------------------------------",
  "",
  "This is a SAMPLE document for website",
  "demonstration purposes only.",
  "",
  "The actual warranty terms and conditions",
  "are subject to the official BYD warranty",
  "policy for the Georgian market.",
  "",
  "Contact BYD Tbilisi / GT Group for the",
  "official warranty documentation.",
  "",
  "",
  "========================================",
  "BYD Tbilisi / GT Group",
  "Kakheti Hwy 45A, Tbilisi, Georgia",
  "Document Version: DEMO-v1  |  April 2026",
];

// Build PDF content stream
const fontSize = 10;
const lineHeight = 13;
const marginLeft = 55;
let y = 740;

let stream = "BT\n/F1 " + fontSize + " Tf\n";
for (const line of lines) {
  if (y < 40) break;
  const safe = line.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
  // Larger font for headers
  if (/^[A-Z]{4,}/.test(line) && !line.startsWith("(")) {
    stream += "/F1 12 Tf\n";
  } else if (line.startsWith("===")) {
    y -= 6;
    stream += "/F1 " + fontSize + " Tf\n";
    continue;
  } else {
    stream += "/F1 " + fontSize + " Tf\n";
  }
  stream += marginLeft + " " + y + " Td\n";
  stream += "(" + safe + ") Tj\n";
  stream += -marginLeft + " " + -lineHeight + " Td\n";
  y -= lineHeight;
}
stream += "ET";

const streamBuf = Buffer.from(stream, "latin1");

// Assemble PDF objects
const objs = [];
objs.push(Buffer.from("%PDF-1.4\n"));
objs.push(Buffer.from("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n"));
objs.push(Buffer.from("2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n"));
objs.push(
  Buffer.from(
    "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n"
  )
);
objs.push(
  Buffer.from("4 0 obj\n<< /Length " + streamBuf.length + " >>\nstream\n")
);
objs.push(streamBuf);
objs.push(Buffer.from("\nendstream\nendobj\n"));
objs.push(
  Buffer.from(
    "5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Courier >>\nendobj\n"
  )
);

// Calculate offsets
let pos = objs[0].length; // after header
const offsets = [];
offsets.push(pos);
pos += objs[1].length; // obj 1
offsets.push(pos);
pos += objs[2].length; // obj 2
offsets.push(pos);
pos += objs[3].length; // obj 3
offsets.push(pos);
pos += objs[4].length + objs[5].length + objs[6].length; // obj 4
offsets.push(pos);
pos += objs[7].length; // obj 5

const xrefPos = pos;
let xref = "xref\n0 6\n0000000000 65535 f \n";
for (const o of offsets) {
  xref += String(o).padStart(10, "0") + " 00000 n \n";
}
xref +=
  "trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n" + xrefPos + "\n%%EOF\n";
objs.push(Buffer.from(xref));

const outPath = path.join(__dirname, "..", "public", "documents", "byd-warranty-georgia.pdf");
fs.writeFileSync(outPath, Buffer.concat(objs));
console.log("PDF created:", outPath, "(" + Buffer.concat(objs).length + " bytes)");
