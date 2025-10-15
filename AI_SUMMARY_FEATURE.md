# AI-Powered Transcript Summarization Feature

## Overview
Implemented AI-powered summarization using Google's Gemini 2.5 Flash model to automatically generate intelligent summaries of municipal meeting transcripts, personalized to the user's topics of interest.

## Architecture

### 1. API Route: `/api/summarize-transcript`
**File**: `src/app/api/summarize-transcript/route.ts`

**Purpose**: Server-side endpoint that calls Gemini API to generate summaries

**Input**:
```json
{
  "transcriptContent": ["speaker: dialogue", "..."],
  "userTopics": ["solar zoning", "cell phone ban", "..."]
}
```

**Output**:
```json
{
  "summary": "## Meeting Overview\n\n..."
}
```

**Key Features**:
- Uses Gemini 2.5 Flash model (`gemini-2.0-flash-exp`)
- Temperature: 0.7 for balanced creativity/accuracy
- Max tokens: 1024 for concise summaries
- Includes user topics in the prompt for personalized analysis

### 2. Prompt Engineering

The AI is instructed to provide:

1. **Meeting Overview**: 2-3 sentence summary of the meeting
2. **Key Takeaways & Agreements**: Main decisions and outcomes
3. **Main Talking Points**: Primary topics and debates
4. **Relevance to User Interests**: How the meeting relates to user's selected topics

**Dynamic Context**: The prompt adapts based on whether the user has selected topics in onboarding. If topics exist, the AI specifically analyzes relevance to those topics.

### 3. Component Updates

**TranscriptViewer Component**:
- Added `onSummaryGenerated` callback prop
- Added `userTopics` prop to pass user preferences
- Automatically triggers summary generation after transcript loads
- Shows "Generating Summary..." loading state
- Handles errors gracefully

**ItemDetailPage**:
- Manages `aiSummary` state
- Retrieves user topics from app state (`state.preferences?.topics`)
- Passes topics to TranscriptViewer
- Displays summary in left pane with proper formatting
- Shows empty state with user's topics when no summary exists

## User Flow

1. **User navigates to item detail page**
   - Left pane shows empty state with their selected topics
   
2. **User enters transcript URL and clicks "Load Transcript"**
   - Button shows "Loading..." while fetching transcript
   - Transcript displays in right pane
   
3. **Automatic summary generation**
   - Button changes to "Generating Summary..."
   - API calls Gemini with transcript content and user topics
   - Summary appears in left pane within seconds

4. **Summary display**
   - Formatted with clear sections
   - Highlights relevance to user's topics
   - Scrollable for longer summaries

## User Topics Integration

The feature reads topics from the user's onboarding preferences:
- Stored in app state via `useAppState()`
- Topics like: "solar zoning", "cell phone ban", "transit", etc.
- Passed to Gemini API for context-aware summarization
- Displayed in empty state so users know what topics are being tracked

## Example Prompt

```
You are analyzing a municipal meeting transcript. Please provide a concise summary with the following sections:

1. **Meeting Overview**: A brief 2-3 sentence summary of what this meeting was about.

2. **Key Takeaways & Agreements**: List the main decisions, agreements, or outcomes from the meeting.

3. **Main Talking Points**: Highlight the primary topics discussed and any significant debates or concerns raised.

4. **Relevance to User Interests**: Explain how this meeting relates to the user's topics of interest: solar zoning, cell phone ban.

Here is the transcript content:
[transcript content...]

Please format your response with clear section headers and bullet points where appropriate.
```

## Security Considerations

⚠️ **API Key**: Currently hardcoded in the server-side route. For production:
- Move to environment variable (`.env.local`)
- Use `process.env.GEMINI_API_KEY`
- Never expose in client-side code

## Benefits

1. **Time Savings**: Users get instant summaries instead of reading full transcripts
2. **Personalization**: Summaries highlight topics the user cares about
3. **Better Insights**: AI identifies key decisions and talking points
4. **Contextual Relevance**: Explains how meetings relate to user's work

## Testing

To test the feature:

1. Go to onboarding and select some topics (or use defaults)
2. Navigate to any item detail page
3. Enter the example transcript URL:
   ```
   https://watertown.munitrac.ai/transcript?id=2025-10-07_TownMeeting-0u699.mp4
   ```
4. Click "Load Transcript"
5. Watch the AI summary generate in the left pane
6. Verify it mentions your selected topics

## Future Enhancements

- [ ] Cache summaries to avoid regenerating
- [ ] Allow users to regenerate with different focus
- [ ] Add summary quality feedback mechanism
- [ ] Support for multiple AI models
- [ ] Export summaries to PDF/Word
- [ ] Highlight specific sections user can click to jump to in transcript
- [ ] Compare summaries across multiple meetings
