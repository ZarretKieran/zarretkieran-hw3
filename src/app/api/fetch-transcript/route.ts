import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Fetch the transcript page
    const response = await fetch(url);
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch transcript' }, { status: response.status });
    }

    const html = await response.text();
    
    // Parse the transcript content
    const transcript = parseTranscript(html);
    
    return NextResponse.json({ transcript });
  } catch (error) {
    console.error('Error fetching transcript:', error);
    return NextResponse.json({ error: 'Failed to process transcript' }, { status: 500 });
  }
}

function parseTranscript(html: string): { title: string; date: string; speakers: string[]; content: string[] } {
  // Extract title
  const titleMatch = html.match(/<div class="text-3xl font-black text-center">\s*([^<]+)/);
  const title = titleMatch ? titleMatch[1].trim() : 'Unknown Meeting';
  
  // Extract date
  const dateMatch = html.match(/<div class="mx-auto text-xl text-gray-500">\s*([^<]+)/);
  const date = dateMatch ? dateMatch[1].trim() : '';
  
  // Extract speaker names and content
  const speakers: Set<string> = new Set();
  const content: string[] = [];
  
  // Match speaker sections with their dialogue
  const speakerPattern = /<i>[\d.]+<\/i>\s*([A-Z\s&]+)<i>[\d.]+<\/i>\s*-<i>[\d.]+<\/i>\s*([^<]*(?:<i>[\d.]+<\/i>\s*[^<]*)*)/g;
  let match;
  
  while ((match = speakerPattern.exec(html)) !== null) {
    const speaker = match[1].trim();
    const text = match[2].replace(/<i>[\d.]+<\/i>/g, '').trim();
    
    if (speaker && text && !speaker.includes('SPEAKER')) {
      speakers.add(speaker);
      content.push(`${speaker}: ${text}`);
    }
  }
  
  // If the above pattern doesn't work well, try a simpler approach
  if (content.length === 0) {
    // Look for any text content between tags, removing timestamps
    const cleanedHtml = html.replace(/<i>[\d.]+<\/i>/g, '');
    const textPattern = />([A-Z][^<]{20,})</g;
    
    while ((match = textPattern.exec(cleanedHtml)) !== null) {
      const text = match[1].trim();
      if (text.length > 30 && !text.includes('class=') && !text.includes('style=')) {
        content.push(text);
      }
    }
  }
  
  return {
    title,
    date,
    speakers: Array.from(speakers),
    content: content.slice(0, 50) // Limit to first 50 entries for performance
  };
}
