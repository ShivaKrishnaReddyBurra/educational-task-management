// app/api/serve-file/[...path]/route.js
import fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const filePath = params.path;
  
  if (!filePath || filePath.length === 0) {
    return NextResponse.json({ message: 'File not found' }, { status: 404 });
  }

  try {
    const fileName = Array.isArray(filePath) ? filePath.join('/') : filePath;
    const fullPath = path.join(process.cwd(), '/backend/taskmanagement/uploads', fileName);
    
    // Security check: ensure the file is within uploads directory
    const uploadsDir = path.join(process.cwd(), '/backend/taskmanagement/uploads');
    const resolvedPath = path.resolve(fullPath);
    const resolvedUploadsDir = path.resolve(uploadsDir);
    
    if (!resolvedPath.startsWith(resolvedUploadsDir)) {
      return NextResponse.json({ message: 'Access denied' }, { status: 403 });
    }

    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      return NextResponse.json({ message: 'File not found' }, { status: 404 });
    }

    // Get file stats
    const stats = fs.statSync(fullPath);
    
    // Set appropriate content type
    const ext = path.extname(fileName).toLowerCase();
    let contentType = 'application/octet-stream';
    
    if (ext === '.pdf') {
      contentType = 'application/pdf';
    } else if (ext === '.jpg' || ext === '.jpeg') {
      contentType = 'image/jpeg';
    } else if (ext === '.png') {
      contentType = 'image/png';
    } else if (ext === '.gif') {
      contentType = 'image/gif';
    }

    // Read the file
    const fileBuffer = fs.readFileSync(fullPath);
    
    // Return the file with appropriate headers
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': stats.size.toString(),
        'Content-Disposition': 'inline',
      },
    });
    
  } catch (error) {
    console.error('Error serving file:', error);
    return NextResponse.json({ message: 'Error serving file' }, { status: 500 });
  }
}