import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export async function POST(request: NextRequest) {
  try {
    const { transcriptContent, userTopics } = await request.json();
    
    if (!transcriptContent || !Array.isArray(transcriptContent)) {
      return NextResponse.json({ error: 'Transcript content is required' }, { status: 400 });
    }

    // If transcript content is empty, return a helpful message
    if (transcriptContent.length === 0) {
      return NextResponse.json({ 
        summary: "No transcript content available to summarize. Please load a valid transcript first." 
      });
    }

    // Try to call Gemini API
    try {
      if (!GEMINI_API_KEY) {
        console.error('GEMINI_API_KEY not configured in environment');
        throw new Error('API key not configured');
      }
      
      console.log('Attempting to call Gemini API...');
      const summary = await generateGeminiSummary(transcriptContent, userTopics);
      return NextResponse.json({ summary });
    } catch (apiError) {
      console.error('Gemini API failed, using fallback:', apiError);
      
      // Fallback to a mock summary when API is unavailable
      const fallbackSummary = generateFallbackSummary(transcriptContent, userTopics);
      return NextResponse.json({ 
        summary: fallbackSummary,
        fallback: true,
        error: apiError instanceof Error ? apiError.message : 'Unknown error'
      });
    }
  } catch (error) {
    console.error('Error generating summary:', error);
    return NextResponse.json({ error: 'Failed to process summary request' }, { status: 500 });
  }
}

async function generateGeminiSummary(transcriptContent: string[], userTopics: string[] = []) {
  // Build the prompt
  const topicsContext = userTopics && userTopics.length > 0 
    ? `\n\nThe user is particularly interested in these topics: ${userTopics.join(', ')}. Please highlight any connections to these topics in your summary.`
    : '';

  const prompt = `You are analyzing a municipal meeting transcript. Please provide a concise summary with the following sections:

1. **Meeting Overview**: A brief 2-3 sentence summary of what this meeting was about.

2. **Key Takeaways & Agreements**: List the main decisions, agreements, or outcomes from the meeting.

3. **Main Talking Points**: Highlight the primary topics discussed and any significant debates or concerns raised.

4. **Relevance to User Interests**: ${userTopics && userTopics.length > 0 ? `Explain how this meeting relates to the user's topics of interest: ${userTopics.join(', ')}.` : 'Explain the broader significance of this meeting for the community.'}

Here is the transcript content:

${transcriptContent.slice(0, 100).join('\n')}

Please format your response with clear section headers and bullet points where appropriate. Keep the summary concise but informative.`;

  // Call Gemini API
  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      }
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Gemini API error:', errorData);
    
    // Provide more specific error messages
    if (response.status === 429) {
      throw new Error('API quota exceeded');
    } else if (response.status === 404) {
      throw new Error('AI model not available');
    }
    
    throw new Error('Failed to generate summary');
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No summary generated';
}

function generateFallbackSummary(transcriptContent: string[], userTopics: string[] = []): string {
  const topicsText = userTopics.length > 0 
    ? `User Topics of Interest: ${userTopics.join(', ')}\n\n`
    : '';

  return `# Meeting Summary

${topicsText}## Meeting Overview
This appears to be a municipal meeting transcript with ${transcriptContent.length} lines of discussion. The meeting covers various local government topics and proceedings.

## Key Takeaways & Agreements
- Meeting conducted with multiple participants discussing municipal matters
- Various topics were addressed during the session
- Proceedings follow standard municipal meeting format

## Main Talking Points
- Local governance and community issues
- Municipal policies and procedures
- Public service discussions and decisions

## Relevance to User Interests
${userTopics.length > 0 
  ? `While specific connections to your topics (${userTopics.join(', ')}) would require deeper analysis, this meeting likely contains relevant local government information that may impact your areas of interest.`
  : 'This meeting provides insights into local governance and community decision-making processes that affect residents and stakeholders.'
}

---
*Note: This is a generated summary. For detailed analysis, please review the full transcript.*`;
}
