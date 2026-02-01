
import { TranslateClient, TranslateTextCommand } from "@aws-sdk/client-translate";
import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";
import { RekognitionClient, DetectLabelsCommand } from "@aws-sdk/client-rekognition";
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const REGION = process.env.NEXT_PUBLIC_AWS_REGION || "ap-south-1";

// Helper to check if credentials exist
const hasCredentials = () => {
    return !!process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID && !!process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY;
};

// --- Clients ---
const translateClient = new TranslateClient({
    region: REGION,
    credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY || "",
    },
});

const pollyClient = new PollyClient({
    region: REGION,
    credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY || "",
    },
});

const rekognitionClient = new RekognitionClient({
    region: REGION,
    credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY || "",
    },
});

const bedrockClient = new BedrockRuntimeClient({
    region: REGION,
    credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY || "",
    },
});

// --- Services ---

export const TranslationService = {
    translate: async (text, sourceLang, targetLang) => {
        if (!hasCredentials()) {
            console.warn("AWS Credentials missing. Returning mock translation.");
            return `[MOCK] ${text} (${targetLang})`;
        }
        try {
            // Normalize language codes (remove region suffix if present)
            const normalizeCode = (code) => {
                if (code.includes('-')) return code.split('-')[0];
                return code;
            };

            const source = normalizeCode(sourceLang);
            const target = normalizeCode(targetLang);

            // If source and target are the same, return original text
            if (source === target) return text;

            const command = new TranslateTextCommand({
                Text: text,
                SourceLanguageCode: source,
                TargetLanguageCode: target,
            });
            const response = await translateClient.send(command);
            return response.TranslatedText;
        } catch (error) {
            console.error("Translation Error:", error);
            return text; // Fallback to original
        }
    },
    
    // Helper to translate common phrases
    translatePhrase: async (phraseKey, targetLang) => {
        const phrases = {
            greeting: "Hello, how can I help you?",
            fairPrice: "This is a fair price",
            goodDeal: "This is a good deal",
            thankYou: "Thank you for your business",
        };
        
        const text = phrases[phraseKey] || phraseKey;
        return await TranslationService.translate(text, "en", targetLang);
    }
};

export const VoiceService = {
    speak: async (text, languageCode = "en-IN") => {
        if (!hasCredentials()) {
            console.warn("AWS Credentials missing. Returning mock audio.");
            return null; // Handle UI accordingly
        }
        try {
            // Map languages to Polly Voice IDs and language codes
            let voiceId = "Aditi"; // Default for Hindi/English
            let pollyLanguageCode = "en-IN";

            // Map language codes to appropriate voices
            if (languageCode === "hi" || languageCode === "hi-IN") {
                voiceId = "Aditi"; // Supports Hindi
                pollyLanguageCode = "hi-IN";
            } else if (languageCode === "te" || languageCode === "te-IN") {
                // Telugu - Polly doesn't have native Telugu, use English voice
                voiceId = "Aditi";
                pollyLanguageCode = "en-IN";
            } else if (languageCode === "ta" || languageCode === "ta-IN") {
                // Tamil - Polly doesn't have native Tamil, use English voice
                voiceId = "Aditi";
                pollyLanguageCode = "en-IN";
            } else if (languageCode === "kn" || languageCode === "kn-IN") {
                // Kannada - Polly doesn't have native Kannada, use English voice
                voiceId = "Aditi";
                pollyLanguageCode = "en-IN";
            } else if (languageCode === "ml" || languageCode === "ml-IN") {
                // Malayalam - Polly doesn't have native Malayalam, use English voice
                voiceId = "Aditi";
                pollyLanguageCode = "en-IN";
            } else {
                voiceId = "Aditi";
                pollyLanguageCode = "en-IN";
            }

            const command = new SynthesizeSpeechCommand({
                Text: text,
                OutputFormat: "mp3",
                VoiceId: voiceId,
                LanguageCode: pollyLanguageCode,
            });
            const response = await pollyClient.send(command);

            // Convert stream to Blob/URL
            const audioData = await response.AudioStream.transformToByteArray();
            const blob = new Blob([audioData], { type: "audio/mpeg" });
            return URL.createObjectURL(blob);
        } catch (error) {
            console.error("Polly Error:", error);
            return null;
        }
    }
};

export const VisionService = {
    analyzeImage: async (imageBytes) => {
        // imageBytes should be Uint8Array
        if (!hasCredentials()) {
            return {
                Labels: [{ Name: "Fresh Tomato", Confidence: 99.0 }, { Name: "Vegetable", Confidence: 95.0 }]
            };
        }
        try {
            const command = new DetectLabelsCommand({
                Image: { Bytes: imageBytes },
                MaxLabels: 5,
                MinConfidence: 80,
            });
            return await rekognitionClient.send(command);
        } catch (error) {
            console.error("Rekognition Error:", error);
            return { Labels: [] };
        }
    }
};

export const AiService = {
    negotiate: async (userMessage, context) => {
        if (!hasCredentials()) {
            return "This can be 40 rupees per kg. It is fresh. (Mock Response)";
        }
        try {
            // Using Claude 3 Sonnet (or Haiku) if available, or Titan.
            // Using Titan Text Express for broad availability: amazon.titan-text-express-v1
            // Or Claude if user has access. Let's try Titan first as it's standard.

            const prompt = `User: ${userMessage}\nContext: ${context}\nVendor Assistant:`;

            const payload = {
                inputText: prompt,
                textGenerationConfig: {
                    maxTokenCount: 100,
                    temperature: 0.7,
                    topP: 1,
                },
            };

            const command = new InvokeModelCommand({
                modelId: "amazon.titan-text-premier-v1:0",
                contentType: "application/json",
                accept: "application/json",
                body: JSON.stringify(payload),
            });

            const response = await bedrockClient.send(command);
            const responseBody = JSON.parse(new TextDecoder().decode(response.body));
            return responseBody.results[0].outputText.trim();
        } catch (error) {
            console.error("Bedrock Error:", error);
            return "Let us agree on a fair price. (Fallback)";
        }
    }
};
