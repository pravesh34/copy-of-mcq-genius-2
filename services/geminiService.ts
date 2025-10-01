import { GoogleGenAI, Type } from "@google/genai";
import { Question } from '../types';

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        questions: {
            type: Type.ARRAY,
            description: "An array of multiple-choice questions extracted from the document.",
            items: {
                type: Type.OBJECT,
                properties: {
                    questionText: {
                        type: Type.STRING,
                        description: "The text of the question.",
                    },
                    options: {
                        type: Type.ARRAY,
                        description: "An array of 4-5 possible answers as strings.",
                        items: {
                            type: Type.STRING
                        },
                    },
                    correctAnswerIndex: {
                        type: Type.INTEGER,
                        description: "The 0-based index of the correct answer in the 'options' array.",
                    },
                    reason: {
                        type: Type.STRING,
                        description: "A brief, clear explanation for why the answer is correct.",
                    }
                },
                required: ["questionText", "options", "correctAnswerIndex", "reason"]
            }
        }
    },
    required: ["questions"]
};

const parseJsonResponse = (jsonText: string): any => {
    let cleanedText = jsonText.trim();
    if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText.substring(7);
    }
    if (cleanedText.endsWith('```')) {
        cleanedText = cleanedText.substring(0, cleanedText.length - 3);
    }
    try {
        return JSON.parse(cleanedText);
    } catch (e) {
        console.error("Failed to parse JSON response from AI:", cleanedText);
        return null;
    }
};


export const generateMcqFromText = async (text: string, apiKey: string): Promise<Question[]> => {
    try {
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `You are an expert quiz creator. Analyze the following text extracted from a question paper. Your goal is to extract all multiple-choice questions and format them as a JSON object according to the provided schema.

Follow these rules for extraction:
1.  **Primary Goal:** Extract multiple-choice questions and their options accurately from the text.
2.  **Filter Noise:** The text may contain noise. Do your best to ignore irrelevant text like page numbers, instructions to the student, and document headers.
3.  **Handle Duplicates:** If you see the exact same question written in two different languages, only include the question once in your output. Prefer the English version.
4.  **Strict JSON Output:** The final output must be ONLY the JSON object. Do not include any other text, explanations, or markdown formatting. If you cannot find any questions, return a JSON object with an empty "questions" array.

Here is the text:\n\n${text}`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.2,
            }
        });

        const parsedJson = parseJsonResponse(response.text);
        
        if (parsedJson && Array.isArray(parsedJson.questions)) {
            return parsedJson.questions as Question[];
        } else {
             console.warn("AI returned invalid or empty structure for text, returning empty questions array.", parsedJson);
            return [];
        }

    } catch (error) {
        console.error("Error generating MCQ from Gemini (text):", error);
        throw new Error("Failed to generate quiz from text due to an API error. Please check your API key and network connection.");
    }
};

export const generateMcqFromImage = async (base64DataArray: string[], mimeType: string, apiKey: string): Promise<Question[]> => {
    try {
        const ai = new GoogleGenAI({ apiKey });
        const imageParts = base64DataArray.map(base64Data => ({
            inlineData: {
                data: base64Data,
                mimeType: mimeType,
            },
        }));

        const textPart = {
            text: `You are an expert quiz creator. Analyze the following series of images, which represent the pages of a single document (e.g., a question paper). Your goal is to extract all multiple-choice questions from across all pages and format them as a single JSON object according to the provided schema.

Follow these rules for extraction:
1.  **Primary Goal:** Extract multiple-choice questions and their options accurately from all the images.
2.  **Filter Noise:** The images may contain noise. Do your best to ignore irrelevant text like page numbers, instructions to the student, and document headers.
3.  **Handle Duplicates:** If you see the exact same question written in two different languages (often on the same page), only include the question once in your output. Prefer the English version.
4.  **Strict JSON Output:** The final output must be ONLY the JSON object. Do not include any other text, explanations, or markdown formatting. If you cannot find any questions, return a JSON object with an empty "questions" array.`,
        };
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [...imageParts, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.2,
            }
        });

        const parsedJson = parseJsonResponse(response.text);
        
        if (parsedJson && Array.isArray(parsedJson.questions)) {
            return parsedJson.questions as Question[];
        } else {
            console.warn("AI returned invalid or empty structure for image, returning empty questions array.", parsedJson);
            return [];
        }

    } catch (error) {
        console.error("Error generating MCQ from Gemini (image):", error);
        throw new Error("Failed to generate quiz from image due to an API error. Please check your API key and network connection.");
    }
};