import { GoogleGenAI, Type } from "@google/genai";
import { type Product } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const storeSchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    address: { type: Type.STRING },
  },
  required: ["name", "address"],
};

const productSchema = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.NUMBER },
    name: { type: Type.STRING },
    store: storeSchema,
    category: { type: Type.STRING },
    price: { type: Type.NUMBER },
    description: { type: Type.STRING },
    mpn: { type: Type.STRING },
    manufacturer: { type: Type.STRING },
    imageUrl: { type: Type.STRING },
  },
  required: ["id", "name", "store", "category", "price", "description", "mpn", "manufacturer"]
};

const searchResultSchema = {
  type: Type.ARRAY,
  items: productSchema,
};

export const performSemanticSearch = async (query: string, inventory: Product[]): Promise<Product[]> => {
  const model = "gemini-2.5-flash";

  const prompt = `
    You are an advanced semantic search engine for "CanvasIligan", a search engine for local electronics stores. Your task is to find products from the provided inventory list that best match the user's search query. The query might be a product name, a description of its use, a part number, or a general category.

    Analyze the user's query: "${query}"

    Here is the inventory data from various local stores in JSON format:
    ${JSON.stringify(inventory, null, 2)}

    Instructions:
    1. Carefully read the user's query to understand their intent. Are they looking for a specific component, something for a specific task (e.g., "a brain for my robot"), or a type of part?
    2. Scan the entire inventory list.
    3. Identify the products that are most semantically relevant to the query. Consider product name, category, description, manufacturer, and MPN. For example, if the user searches for "a small computer for a project", the "Raspberry Pi" is a very relevant result. If they search for "something to control a motor's speed", a "L298N Motor Driver Module" or a microcontroller like an Arduino would be good matches.
    4. Return a JSON array containing only the matching product objects from the inventory.
    5. The order of the results should be from most relevant to least relevant.
    6. If no products are a good match, return an empty array [].
    7. Do not invent new products or modify the existing product data. Your response must strictly be a subset of the provided inventory.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: searchResultSchema,
      },
    });

    const responseText = response.text.trim();
    if (!responseText) {
        return [];
    }
    
    const parsedResults = JSON.parse(responseText);
    
    return parsedResults as Product[];

  } catch (error) {
    console.error("Error performing semantic search:", error);
    throw new Error("Failed to communicate with the Gemini API.");
  }
};