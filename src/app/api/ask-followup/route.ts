import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

export async function POST(request: NextRequest) {
  try {
    const { question, transcriptContent, conversationHistory } = await request.json();
    
    if (!question || !transcriptContent) {
      return NextResponse.json({ error: 'Question and transcript content are required' }, { status: 400 });
    }

    // Build context from conversation history
    const historyContext = conversationHistory && conversationHistory.length > 0
      ? `\n\nPrevious conversation:\n${conversationHistory.map((item: {question: string; answer: string}) => 
          `Q: ${item.question}\nA: ${item.answer}`
        ).join('\n\n')}`
      : '';

    // Build the prompt with transcript context
    const prompt = `You are an AI assistant helping users understand a municipal meeting transcript. Answer the user's question based on the transcript content provided.

${historyContext}

Transcript content:
${transcriptContent.slice(0, 100).join('\n')}

User's question: ${question}

Please provide a clear, concise answer based on the transcript. If the information isn't in the transcript, say so. Format your response in markdown for readability.`;

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
          maxOutputTokens: 512,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      return NextResponse.json({ error: 'Failed to get answer' }, { status: response.status });
    }

    const data = await response.json();
    const answer = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No answer generated';

    return NextResponse.json({ answer });
  } catch (error) {
    console.error('Follow-up API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
