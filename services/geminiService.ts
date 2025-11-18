
import { GoogleGenAI, Modality } from "@google/genai";
import { Character, AspectRatio } from "../types";

const generateImage = async (parts: any[], promptText: string): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
    }
    throw new Error(`Image generation failed for prompt: "${promptText}"`);
};

export const generateCharacter = async (prompt: string): Promise<string> => {
    const parts = [{ text: `Create a full-body portrait of a character based on this description: "${prompt}". The character should be centered on a simple, neutral background.` }];
    return generateImage(parts, prompt);
};

export const generateScene = async (characters: Character[], scenePrompt: string, aspectRatio: AspectRatio): Promise<string> => {
    const parts: any[] = [];
    characters.forEach(character => {
        const base64Data = character.imageData.split(',')[1];
        parts.push({
            inlineData: {
                mimeType: character.imageData.substring(5, character.imageData.indexOf(';')),
                data: base64Data,
            },
        });
    });

    const fullPrompt = `Using the character images provided, create a new scene.
    Scene Description: "${scenePrompt}"
    Instructions:
    - Place the provided characters into the described scene in a natural way.
    - IMPORTANT: Retain the exact appearance, style, and clothing of each character from their original images.
    - The final output should be a single, cohesive image with an aspect ratio of ${aspectRatio}.`;
    parts.push({ text: fullPrompt });

    return generateImage(parts, scenePrompt);
};

export const editImage = async (baseImage: string, editPrompt: string): Promise<string> => {
    const base64Data = baseImage.split(',')[1];
    const mimeType = baseImage.substring(5, baseImage.indexOf(';'));

    const parts = [
        {
            inlineData: { mimeType, data: base64Data },
        },
        { text: `Edit the provided image based on the following instruction: "${editPrompt}". Only change what is requested.` },
    ];
    return generateImage(parts, editPrompt);
};
