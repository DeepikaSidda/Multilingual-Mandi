import { RekognitionClient, DetectTextCommand } from "@aws-sdk/client-rekognition";
import { TranslateClient, TranslateTextCommand } from "@aws-sdk/client-translate";

const REGION = process.env.NEXT_PUBLIC_AWS_REGION || "ap-south-1";

const rekognitionClient = new RekognitionClient({
    region: REGION,
    credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY || "",
    },
});

const translateClient = new TranslateClient({
    region: REGION,
    credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY || "",
    },
});

export async function POST(request) {
    try {
        const formData = await request.formData();
        const imageFile = formData.get('image');
        const targetLanguage = formData.get('targetLanguage') || 'en';

        if (!imageFile) {
            return Response.json({ error: 'No image provided' }, { status: 400 });
        }

        // Convert image to bytes - ensure it's a proper Buffer
        const arrayBuffer = await imageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Step 1: Extract text from image using AWS Rekognition
        const detectTextCommand = new DetectTextCommand({
            Image: {
                Bytes: buffer
            }
        });

        const textDetectionResult = await rekognitionClient.send(detectTextCommand);
        
        // Extract detected text
        const textDetections = textDetectionResult.TextDetections || [];
        
        // Get only LINE type detections (not individual words) for better readability
        const lines = textDetections
            .filter(detection => detection.Type === 'LINE')
            .sort((a, b) => {
                // Sort by vertical position (top to bottom)
                const aTop = a.Geometry?.BoundingBox?.Top || 0;
                const bTop = b.Geometry?.BoundingBox?.Top || 0;
                return aTop - bTop;
            })
            .map(detection => detection.DetectedText);

        const originalText = lines.join('\n');

        if (!originalText || originalText.trim().length === 0) {
            return Response.json({
                originalText: '',
                translatedText: '',
                detectedLanguage: '',
                error: 'No text detected in image'
            });
        }

        console.log('Extracted text:', originalText);

        // Step 2: Detect source language
        let detectedLanguage = 'en';
        
        // Simple language detection based on script
        if (/[\u0900-\u097F]/.test(originalText)) {
            detectedLanguage = 'hi'; // Hindi/Devanagari
        } else if (/[\u0C00-\u0C7F]/.test(originalText)) {
            detectedLanguage = 'te'; // Telugu
        } else if (/[\u0B80-\u0BFF]/.test(originalText)) {
            detectedLanguage = 'ta'; // Tamil
        } else if (/[\u0C80-\u0CFF]/.test(originalText)) {
            detectedLanguage = 'kn'; // Kannada
        } else if (/[\u0D00-\u0D7F]/.test(originalText)) {
            detectedLanguage = 'ml'; // Malayalam
        }

        console.log('Detected language:', detectedLanguage);
        console.log('Target language:', targetLanguage);

        // Step 3: Translate text if needed
        let translatedText = originalText;
        
        // Always translate if target language is different from detected language
        if (detectedLanguage !== targetLanguage) {
            try {
                console.log('Attempting translation from', detectedLanguage, 'to', targetLanguage);
                
                const translateCommand = new TranslateTextCommand({
                    Text: originalText,
                    SourceLanguageCode: detectedLanguage,
                    TargetLanguageCode: targetLanguage,
                });

                const translationResult = await translateClient.send(translateCommand);
                translatedText = translationResult.TranslatedText;
                
                console.log('Translation successful:', translatedText.substring(0, 100));
            } catch (translateError) {
                console.error('Translation error:', translateError);
                
                // Try with auto-detect if specific language fails
                try {
                    console.log('Retrying with auto-detect');
                    const autoTranslateCommand = new TranslateTextCommand({
                        Text: originalText,
                        SourceLanguageCode: 'auto',
                        TargetLanguageCode: targetLanguage,
                    });
                    
                    const autoTranslationResult = await translateClient.send(autoTranslateCommand);
                    translatedText = autoTranslationResult.TranslatedText;
                    console.log('Auto-translation successful');
                } catch (autoError) {
                    console.error('Auto translation error:', autoError);
                    // If translation fails, return original text
                    translatedText = originalText;
                }
            }
        } else {
            console.log('No translation needed - same language');
        }

        return Response.json({
            originalText,
            translatedText,
            detectedLanguage,
            textDetections: lines.length
        });

    } catch (error) {
        console.error('Signboard translation error:', error);
        return Response.json(
            { error: 'Failed to process image', details: error.message },
            { status: 500 }
        );
    }
}
