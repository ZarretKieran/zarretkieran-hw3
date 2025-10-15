import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = 'AIzaSyBr3clRH1-v_EnQRtlmVrXWjZO6DNR03dY';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

export async function POST(request: NextRequest) {
  try {
    const { transcriptContent, userTopics } = await request.json();
    
    if (!transcriptContent || !Array.isArray(transcriptContent)) {
      return NextResponse.json({ error: 'Transcript content is required' }, { status: 400 });
    }

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
      return NextResponse.json({ error: 'Failed to generate summary' }, { status: response.status });
    }

    const data = await response.json();
    const summary = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No summary generated';

    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Error generating summary:', error);
    return NextResponse.json({ error: 'Failed to process summary request' }, { status: 500 });
  }
}
