# Interactive Q&A Feature - Follow-Up Questions

## Overview
An interactive conversational interface that allows users to ask follow-up questions about loaded municipal transcripts. The AI maintains conversation context and provides answers based on the transcript content.

## User Flow

1. **Load Transcript** → AI generates initial summary
2. **Q&A Section Appears** → Below the summary in the left pane
3. **User Asks Question** → Types in textarea and clicks "Ask"
4. **AI Responds** → Answer appears in conversation history
5. **Continue Conversation** → Ask more questions with context maintained

## Features

### Conversation History
- **Persistent display** of all Q&A pairs
- **Scrollable container** (max 300px height)
- **Visual distinction** between questions and answers
- **Icons** for user (person) and AI (lightbulb)
- **Color coding**:
  - Questions: Brand purple background
  - Answers: Emerald green background

### Input Interface
- **Multi-line textarea** (3 rows)
- **Placeholder text**: "Ask a question about this transcript..."
- **Character limit**: None (Gemini handles token limits)
- **Disabled state** during processing
- **Auto-clear** after successful submission

### Processing States
- **Idle**: "Ask anything about the meeting content"
- **Processing**: Animated pulse + "Processing your question..."
- **Error**: Graceful error message in conversation history

### AI Integration
- **Context-aware**: Includes conversation history in prompts
- **Transcript-based**: Answers grounded in actual content
- **Markdown formatted**: Responses support lists, bold, etc.
- **Concise**: Limited to 512 tokens for quick responses

## Technical Implementation

### Component State
```typescript
const [transcriptContent, setTranscriptContent] = useState<string[] | null>(null);
const [followUpQuestion, setFollowUpQuestion] = useState("");
const [isAskingQuestion, setIsAskingQuestion] = useState(false);
const [conversationHistory, setConversationHistory] = useState<Array<{
  question: string;
  answer: string;
}>>([]);
```

### API Endpoint: `/api/ask-followup`

**Request:**
```json
{
  "question": "What were the main concerns about solar zoning?",
  "transcriptContent": ["SPEAKER: ...", "..."],
  "conversationHistory": [
    {
      "question": "Who attended the meeting?",
      "answer": "The meeting was attended by..."
    }
  ]
}
```

**Response:**
```json
{
  "answer": "The main concerns about solar zoning included:\n\n- Setback distances from property lines\n- Visual impact on neighboring properties\n- Agricultural land preservation\n\nThese points were raised by multiple speakers during the public comment period."
}
```

### Gemini Prompt Structure

```
You are an AI assistant helping users understand a municipal meeting transcript.

Previous conversation:
Q: [Previous question]
A: [Previous answer]

Transcript content:
[First 100 lines of transcript]

User's question: [Current question]

Please provide a clear, concise answer based on the transcript.
If the information isn't in the transcript, say so.
Format your response in markdown for readability.
```

## UI/UX Design

### Layout
```
┌─────────────────────────────────────┐
│ AI-Generated Summary                │
│ [Markdown content]                  │
├─────────────────────────────────────┤
│ Ask Follow-Up Questions             │
│                                     │
│ ┌─ Conversation History ─────────┐ │
│ │ 👤 You asked:                  │ │
│ │ What was discussed?            │ │
│ │                                │ │
│ │ 💡 AI Response:                │ │
│ │ The meeting covered...         │ │
│ └────────────────────────────────┘ │
│                                     │
│ ┌─ Input ────────────────────────┐ │
│ │ [Textarea]                     │ │
│ │ Ask anything... [Ask Button]   │ │
│ └────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Color Scheme
- **Question bubbles**: `bg-[--color-brand-500]/10` with `border-[--color-brand-500]/30`
- **Answer bubbles**: `bg-[--color-accent-emerald]/10` with `border-[--color-accent-emerald]/30`
- **Input border**: `border-[--color-brand-400]/30`
- **Focus ring**: `ring-[--color-brand-400]`

### Typography
- **Section title**: Uppercase, bold, brand-200
- **Question label**: Bold, brand-200, 12px
- **Answer label**: Bold, emerald-300, 12px
- **Content**: 14px, relaxed line height

## Example Interactions

### Example 1: Specific Information
**Q:** "What was the vote count on the solar zoning ordinance?"  
**A:** "The solar zoning ordinance passed with a vote of 4-1. Council members Smith, Johnson, Davis, and Lee voted in favor, while Council member Brown voted against."

### Example 2: Clarification
**Q:** "Can you explain the setback requirements mentioned?"  
**A:** "The setback requirements specify:
- **Residential areas**: 200 feet from property lines
- **Agricultural areas**: 100 feet from property lines
- **Commercial areas**: 50 feet from property lines

These requirements apply to utility-scale solar installations."

### Example 3: Not in Transcript
**Q:** "What was the weather like during the meeting?"  
**A:** "The transcript doesn't contain information about the weather. The document focuses on the meeting proceedings and discussions."

### Example 4: Follow-up with Context
**Q1:** "Who opposed the ordinance?"  
**A1:** "Council member Brown opposed the ordinance, expressing concerns about agricultural land use."

**Q2:** "What were their specific concerns?"  
**A2:** "Based on the previous discussion about Council member Brown, their specific concerns included:
- Loss of prime agricultural land
- Impact on local farming operations
- Insufficient protections for existing agricultural uses"

## Accessibility

### Keyboard Navigation
- **Tab**: Focus textarea
- **Enter**: Submit (with Shift+Enter for new line)
- **Escape**: Clear textarea (future enhancement)

### Screen Readers
- **ARIA labels** on textarea
- **Semantic HTML** for conversation structure
- **Icon descriptions** via SVG titles

### Visual Accessibility
- **High contrast** text on colored backgrounds
- **Clear visual hierarchy** with icons and spacing
- **Focus indicators** on interactive elements

## Performance Considerations

### Optimization
- **Conversation history limit**: First 100 transcript lines sent to API
- **Token limit**: 512 max output tokens for quick responses
- **Debouncing**: Could add to prevent rapid-fire questions
- **Caching**: Could cache common questions (future)

### Error Handling
- **Network errors**: Graceful fallback message
- **API errors**: User-friendly error in conversation
- **Empty responses**: Handled with default message
- **Rate limiting**: Could add client-side throttling

## Future Enhancements

### Potential Features
- [ ] **Export conversation** as PDF or text
- [ ] **Share Q&A** with colleagues
- [ ] **Suggested questions** based on summary
- [ ] **Voice input** for questions
- [ ] **Citation links** to specific transcript lines
- [ ] **Multi-language support**
- [ ] **Question templates** for common queries
- [ ] **Conversation branching** (save/load different threads)

### Technical Improvements
- [ ] **Streaming responses** for longer answers
- [ ] **Conversation persistence** (save to database)
- [ ] **Question suggestions** using embeddings
- [ ] **Semantic search** within transcript
- [ ] **Answer confidence scores**
- [ ] **Source attribution** with line numbers

## Testing Scenarios

### Happy Path
1. Load transcript
2. Wait for summary
3. Ask question
4. Receive answer
5. Ask follow-up
6. Verify context maintained

### Edge Cases
- Empty question submission (disabled)
- Very long questions (handled by Gemini)
- Rapid consecutive questions (queued)
- Network timeout (error message)
- Invalid transcript data (graceful failure)

### User Experience
- Clear visual feedback during processing
- Smooth scroll to new answers
- Consistent styling with app theme
- Responsive on mobile devices
- Fast response times (<3 seconds typical)

## Integration Points

### Data Flow
```
User Input → Component State → API Route → Gemini API
                ↓                              ↓
         Conversation History ← Response ← Answer
```

### Dependencies
- **React state management**: `useState` for local state
- **Gemini API**: External AI service
- **ReactMarkdown**: Answer formatting
- **Custom scrollbar**: CSS styling

### Parent Component
- Receives `transcriptContent` from `TranscriptViewer`
- Manages conversation state locally
- No database persistence (stateless)

---

**Result**: A powerful, intuitive Q&A interface that transforms static transcripts into interactive, explorable documents. Users can dive deep into meeting content with AI-assisted analysis.
