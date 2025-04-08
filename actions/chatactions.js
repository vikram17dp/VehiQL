"use server"
// Server-side logic for car chatbot

import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai"

const apiKey = process.env.GEMINI_API_KEY

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not defined in the environment variables.")
}

const genAI = new GoogleGenerativeAI(apiKey)

const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
]

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
  safetySettings,
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: {
      type: "string",
      description: "The generated response from the AI model in normal text.",
    },
  },
})

// Action for handling the chat logic
export const getChatResponse = async (userInput, chatHistory) => {
  try {
    if (!userInput) {
      throw new Error("User input is required")
    }

    // Create the prompt with provided chat history and user input
    const prompt = `
      You are a knowledgeable and helpful automotive expert. Your goal is to provide accurate and helpful information about cars, including models, maintenance, buying advice, and technical specifications.

      Chat Log:
      ${chatHistory}

      User Input: "${userInput}"

      Instructions:
      - Analyze the user's question based on the chat history.
      - Provide practical and accurate information about cars in normal text.
      - Cover topics like car models, specifications, maintenance tips, buying advice, and troubleshooting.
      - If the user asks about something unrelated to cars, politely redirect them and mention you can only provide information about automotive topics.
      - If the user is greeting you, greet them back and briefly explain your purpose.
      - Keep responses concise but informative - minimum one line, maximum one paragraph.
      - Make sure not to use special characters unnecessarily.
      - Use bold text (with ** markers) for important terms or car model names.

      User Question: "${userInput}"
    `

    // Generate the response from the AI model
    const result = await model.generateContent(prompt.trim())
    const response = result.response
      .text()
      .replace(/\\\d+\\:\s+/g, "") // Removes numbered escape sequences
      .replace(/\\/g, "") // Removes unnecessary backslashes
      .replace(/{/g, "")
      .replace(/}/g, "")

    // Return the generated response
    return { response }
  } catch (error) {
    console.error("Error processing AI request:", error)
    throw new Error("Failed to generate response from AI.")
  }
}
