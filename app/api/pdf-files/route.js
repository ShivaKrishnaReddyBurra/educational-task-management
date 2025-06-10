// app/api/pdf-files/route.js
import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const uploadsDir = path.join(process.cwd(), 'backend/taskmanagement/uploads');
    
    // Check if uploads directory b
    if (!fs.existsSync(uploadsDir)) {
      return NextResponse.json([]);
    }

    // Read all files from uploads directory
    const files = fs.readdirSync(uploadsDir);
    
    // Filter only PDF files and get their stats
    const pdfFiles = files
      .filter(file => file.toLowerCase().endsWith('.pdf'))
      .map(file => {
        const filePath = path.join(uploadsDir, file);
        const stats = fs.statSync(filePath);
        
        return {
          name: file,
          displayName: file.replace(/^\d+_/, ''), // Remove timestamp prefix if exists
          size: stats.size,
          modified: stats.mtime,
          created: stats.birthtime
        };
      })
      .sort((a, b) => new Date(b.modified) - new Date(a.modified)); // Sort by modified date, newest first

    return NextResponse.json(pdfFiles);
  } catch (error) {
    console.error('Error reading PDF files:', error);
    return NextResponse.json(
      { message: 'Error reading PDF files', error: error.message },
      { status: 500 }
    );
  }
}