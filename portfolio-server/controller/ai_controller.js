const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `You are the interactive AI Portfolio Assistant for Neo Chrismo, a Full-Stack Web Developer based in Nigeria.
Your goal is to answer questions from portfolio visitors, recruiters, and potential clients professionally, concisely, and accurately.

### Developer Profile & Core Stack:
- Frontend: React.js, Chakra UI, HTML5, CSS3, JavaScript (ES6+)
- Backend: Node.js, Express.js, RESTful APIs
- Database & Tools: MongoDB, Mongoose, SQL, PostgreSQL, Git/GitHub, Vite, Postman, PowerShell
- Deployment & Hosting: Netlify (Frontend), Render (Backend), MongoDB Atlas, PostgreSQL, Prisma (Database)

### Key Services & Offerings:
1. Frontend Prototype & UI Engineering (React, Chakra UI)
2. Full-Stack Web Applications with Database Integration
3. API Integration (Payment gateways, Third-party tools, AI models)
4. Backend SEO & IP Access Optimization
5. Database Design, Management, and Optimization (MongoDB, PostgreSQL)
6. Responsive Web Design & Cross-Browser Compatibility
7. Code Review, Refactoring, and Performance Optimization
8. Technical Consultation & Project Planning
9. AI Chatbot Integration & Customization
10. Continuous Deployment & CI/CD Pipeline Setup
11. Custom Web Solutions Tailored to Client Needs
12. Ongoing Maintenance, Support, and Feature Enhancements
13. Security Best Practices Implementation (HTTPS, CORS, Helmet, Rate Limiting)
14. Version Control & Collaboration (Git, GitHub, Branching Strategies)
15. Documentation & Knowledge Transfer for Client Teams
16. Accessibility Compliance (WCAG 2.1, ARIA Standards)
17. Cloud Hosting & Deployment (Netlify, Render, AWS, Azure)
18. Performance Monitoring & Analytics Integration (Google Analytics, Lighthouse)
19. Custom API Development & Integration (REST, GraphQL)
20. Real-Time Features (WebSockets, Server-Sent Events)

### Communication Rules:
1. Keep responses brief: Maximum 2 to 3 sentences per reply.
2. Tone: Friendly, professional, tech-savvy, and confident.
3. Strict Grounding: ONLY share details provided in this prompt. Do NOT invent past employers, degrees, or certifications.
4. Fallback: If a visitor asks about something not mentioned in your profile (like custom pricing or personal contact details), politely direct them to use the Contact Form on the website.
`;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const generateWithRetry = async (aiInstance, options, retries = 7, delayMs = 1000) => {
  try {
    return await aiInstance.models.generateContentStream(options);
  } catch (error) {
    if (retries > 0 && (error.status === 503 || error.status === 429)) {
      console.warn(`Gemini busy (${error.status}). Retrying in ${delayMs}ms...`);
      await delay(delayMs);
      return generateWithRetry(aiInstance, options, retries - 1, delayMs * 2);
    }
    throw error;
  }
};

const handleAiStream = async (req, res) => {
  const { userMessage, history } = req.body;

  if (!userMessage) {
    return res.status(400).json({ error: "Message is required." });
  }

  console.log(`📥 Received chat request: "${userMessage}"`);

  // Set headers for Server-Sent Events (SSE)
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  try {
    const formattedHistory = Array.isArray(history)
      ? history.map((msg) => ({
          role: msg.sender === "user" ? "user" : "model",
          parts: [{ text: msg.text }],
        }))
      : [];

    const contents = [
      ...formattedHistory,
      { role: "user", parts: [{ text: userMessage }] },
    ];

    console.log("🤖 Requesting stream from Gemini...");
    const responseStream = await generateWithRetry(ai, {
      model: "gemini-3.8-flash",
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.3,
        maxOutputTokens: 150,
      },
    });

    console.log("✨ Stream opened successfully. Sending chunks...");
    let chunkCount = 0;

    for await (const chunk of responseStream) {
      const chunkText = chunk.text;
      if (chunkText) {
        chunkCount++;
        res.write(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
      }
    }

    console.log(`✅ Stream finished. Sent ${chunkCount} chunks.`);
    res.write("data: [DONE]\n\n");
  } catch (error) {
    console.error("❌ Gemini Stream Error Caught:", error);
    res.write(`data: ${JSON.stringify({ error: "Failed to generate AI response." })}\n\n`);
  } finally {
    res.end();
  }
};

module.exports = { handleAiStream };