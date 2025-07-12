import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
import { Document } from "@langchain/core/documents";


import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPEN_ROUTER_MISTRAL_KEY,
  baseURL: "https://openrouter.ai/api/v1", 
});


// export const aisummariseCommsit = async (diff: string) => {
//    const MAX_DIFF_CHARS = 8000;
//   const safeDiff = diff
//     .replace(/```/g, "'''")
//     .slice(0, MAX_DIFF_CHARS);
//   const prompt = `
// You are an expert programmer, and you are trying to summarize a git diff.

// Reminders about the git diff format:
// - Lines starting with '+' were added.
// - Lines starting with '-' were removed.
// - Lines without '+' or '-' are context.
// - Diff starts with lines like:
//   \`\`\`
//   diff --git a/file.ts b/file.ts
//   index abc123..def456 100644
//   --- a/file.ts
//   +++ b/file.ts
//   \`\`\`

// Example summary format:
// \`\`\`
// * Changed logic in file1.ts to handle edge cases
// * Updated API endpoint in routes/index.ts
// * Minor refactor in utils.ts
// \`\`\`

// Do **not** include the example above in your output. It is for format reference only.

// Please summarize the following git diff:

// \`\`\`diff
// ${safeDiff}
// \`\`\`
// `;

//   try {
//     const result = await model.generateContent([prompt]);
//     const text = result.response.text();
//     return text;
//   } catch (error) {
//     console.error("Error generating summary:", error);
//     return "Failed to summarize commit.";
//   }
// };



export const aisummariseCommit = async (diff: string) => {
  const MAX_DIFF_CHARS = 13000; // limit for safe token usage
  const safeDiff = diff
    .replace(/```/g, "'''") // avoid breaking Markdown
    .slice(0, MAX_DIFF_CHARS);

  const prompt = `
You are an expert programmer, and you are trying to summarize a git diff.

Reminders about the git diff format:
- Lines starting with '+' were added.
- Lines starting with '-' were removed.
- Lines without '+' or '-' are context.
- Diff starts with lines like:
  \`\`\`
  diff --git a/file.ts b/file.ts
  index abc123..def456 100644
  --- a/file.ts
  +++ b/file.ts
  \`\`\`

Example summary format:
\`\`\`
* Changed logic in file1.ts to handle edge cases
* Updated API endpoint in routes/index.ts
* Minor refactor in utils.ts
\`\`\`

Do **not** include the example above in your output. It is for format reference only.

Please summarize the following git diff:

\`\`\`diff
${safeDiff}
\`\`\`
`;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPEN_ROUTER_MISTRAL_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://fake-repo-viewer.dev/', // required by OpenRouter
        'X-Title': 'git-diff-summary',
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-7b-instruct',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;
    return text || 'No summary generated.';
  } catch (error: any) {
    console.error(' Error generating summary:', error);
    return 'Failed to summarize commit.';
  }
};



// export async function summariseCode(doc : Document){
// try {
  
//   const code = doc.pageContent.slice(0 , 10000);


//   const response =  await model.generateContent([
//     `You are an intelligent senior software engineer who specialises in onboarding junior software engineers onto projects.`,
//     `You are onboarding a junior software engineer and explaining to them the purpose of the ${doc.metadata.source} file
//     Here is the code:
// ---
// ${code}
// ---

// Give a summary no more than 100 words of the code above. Focus on:
// 1. What this file does
// 2. Key functions or components
// 3. How it fits into the larger project

// If the code appears to be configuration, data, or non-functional content, provide a brief description of its purpose.`
//   ]);
//   return response.response.text();
// } catch (error) {
//       console.error(`Error summarizing code for ${doc.metadata.source}:`, error);
//     return '';

// }
// }

export async function summariseCode(doc: Document) {
  try {
    // const code = doc.pageContent.slice(0, 16000); // keep size reasonable
    const code = doc.pageContent; 
    const prompt = `
You are an intelligent senior software engineer who specialises in onboarding junior software engineers onto projects.

You are onboarding a junior software engineer and explaining to them the purpose of the ${doc.metadata.source} file.

Here is the code:
---
${code}
---

Give a summary no more than 100 words of the code above. Focus on:
1. What this file does
2. Key functions or components
3. How it fits into the larger project

If the code appears to be configuration, data, or non-functional content, provide a brief description of its purpose.
`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPEN_ROUTER_MISTRAL_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://fake-repo-viewer.dev/",
        "X-Title": "code-summary",
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;
    return text || "No summary generated.";
  } catch (error) {
    console.error(`Error summarizing code for ${doc.metadata.source}:`, error);
    return "";
  }
}


export async function generateEmbedding(summary: string) {
  try {
  

    const model = genAI.getGenerativeModel({
      model: "text-embedding-004"
    });
    
    const result = await model.embedContent(summary);
    const embedding = result.embedding;
    
   
    
    return embedding.values;
  } catch (error) {
    console.error('Error generating embedding:', error);
    return [];
  }
}