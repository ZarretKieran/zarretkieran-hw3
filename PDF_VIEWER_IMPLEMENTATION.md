# PDF/Transcript Viewer Implementation

## Overview
Implemented a functional PDF/transcript viewer that allows users to fetch and display municipal meeting transcripts from web URLs. This feature replaces the mock PDF preview with a live document fetcher.

## What Was Built

### 1. API Route (`/src/app/api/fetch-transcript/route.ts`)
- **Purpose**: Server-side endpoint to fetch and parse transcript content
- **Method**: POST
- **Input**: JSON with `url` field containing the transcript URL
- **Output**: Parsed transcript data including:
  - Meeting title
  - Meeting date
  - List of speakers
  - Transcript content (dialogue)

### 2. TranscriptViewer Component (`/src/components/TranscriptViewer.tsx`)
- **Features**:
  - URL input field for municipal transcript links
  - "Load Transcript" button to fetch content
  - Loading states and error handling
  - Display of parsed transcript with:
    - Meeting header (title, date)
    - Speaker badges
    - Scrollable transcript content
  - "Clear" button to reset the viewer
  - Empty state with example URL

### 3. Updated Document Viewer Page (`/src/app/item/[id]/page.tsx`)
- Integrated `TranscriptViewer` into the right pane of the split viewer
- Updated description from "original PDF" to "live transcript loader"
- Maintains existing left pane with extracted text

## How to Use

1. **Navigate to any item detail page**:
   - Go to http://localhost:3000/dashboard
   - Click on any feed item to view its details

2. **Load a transcript**:
   - In the Document Viewer section (right pane)
   - Enter a municipal transcript URL, for example:
     ```
     https://watertown.munitrac.ai/transcript?id=2025-10-07_TownMeeting-0u699.mp4
     ```
   - Click "Load Transcript"
   - View the parsed meeting content

3. **Clear and try another**:
   - Click "Clear" to reset
   - Enter a different transcript URL

## Supported URLs
Currently optimized for **munitrac.ai** transcript pages:
- Format: `https://[city].munitrac.ai/transcript?id=[meeting-id]`
- Example: `https://watertown.munitrac.ai/transcript?id=2025-10-07_TownMeeting-0u699.mp4`

## Technical Details

### Parsing Strategy
The API route parses HTML content to extract:
- Meeting title from `<div class="text-3xl font-black text-center">`
- Meeting date from `<div class="mx-auto text-xl text-gray-500">`
- Speaker names and dialogue using regex patterns
- Timestamps are removed for cleaner display

### Architecture
```
User Input (URL)
    ↓
TranscriptViewer Component
    ↓
POST /api/fetch-transcript
    ↓
Fetch HTML from URL
    ↓
Parse HTML content
    ↓
Return structured data
    ↓
Display in UI
```

## Future Enhancements
- Support for PDF files (using pdf.js or similar)
- Support for additional transcript formats
- Text search within transcripts
- Keyword highlighting
- Download/export functionality
- Caching of fetched transcripts
- Integration with actual database when available

## Git Commit
Changes committed to the `pdf-editor` branch with message:
```
Add PDF/transcript viewer with URL input functionality

- Created API route to fetch and parse municipal transcripts
- Built TranscriptViewer component with URL input
- Integrated live transcript loading into document viewer
- Replaced mock PDF preview with functional transcript fetcher
- Supports munitrac.ai transcript URLs
```

## Testing
The dev server is running at http://localhost:3000. You can test the feature by:
1. Navigating to any item (e.g., http://localhost:3000/item/item-ks-johnson-utility-solar-1)
2. Using the example URL in the transcript viewer
3. Verifying the transcript loads and displays correctly
