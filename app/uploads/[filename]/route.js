import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request, { params }) {
  // Await params to resolve dynamic route parameters
  const { filename } = await params;

  console.log("Serving file:", filename); // Debug log

  // Sanitize filename to prevent path traversal
  const sanitizedFilename = path.basename(filename);

  // Resolve path to the uploads directory (at project root)
  const filePath = path.join(process.cwd(), "uploads", sanitizedFilename);
  console.log("Resolved filePath:", filePath); // Debug log

  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error("File not found at:", filePath);
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Read file
    const fileBuffer = fs.readFileSync(filePath);
    const fileExtension = path.extname(sanitizedFilename).toLowerCase();
    const contentTypes = {
      ".pdf": "application/pdf",
      ".doc": "application/msword",
      ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ".txt": "text/plain",
    };

    // Set headers
    const headers = new Headers({
      "Content-Type": contentTypes[fileExtension] || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${sanitizedFilename}"`,
    });

    // Return file
    return new NextResponse(fileBuffer, { headers });
  } catch (error) {
    console.error("Error serving file:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}