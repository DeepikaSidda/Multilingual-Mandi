import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { TranslateClient, TranslateTextCommand } from "@aws-sdk/client-translate";

const REGION = process.env.NEXT_PUBLIC_AWS_REGION || "ap-south-1";

const bedrockClient = new BedrockRuntimeClient({
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
        const { mode, commodity, vendorPrice, buyerOffer, marketPrice, language } = await request.json();

        // Calculate market price if not provided
        const avgMarketPrice = marketPrice || vendorPrice * 0.9;

        // Determine fairness based on mode
        const offerPercentage = (buyerOffer / vendorPrice) * 100;
        let fairnessAssessment = "";
        let fairnessColor = "";
        let counterOffer;
        
        if (mode === 'vendor') {
            // Vendor perspective: Is buyer's offer fair?
            if (buyerOffer >= vendorPrice * 0.95) {
                fairnessAssessment = "Excellent offer! Very close to your asking price.";
                fairnessColor = "#e8f5e9";
                counterOffer = vendorPrice; // Accept asking price
            } else if (buyerOffer >= vendorPrice * 0.85) {
                fairnessAssessment = "Good offer. Reasonable and fair.";
                fairnessColor = "#fff9c4";
                counterOffer = Math.round((vendorPrice + buyerOffer) / 2); // Meet in middle
            } else if (buyerOffer >= vendorPrice * 0.75) {
                fairnessAssessment = "Low offer. You can negotiate higher.";
                fairnessColor = "#ffe0b2";
                counterOffer = Math.round(vendorPrice * 0.90); // 10% discount
            } else {
                fairnessAssessment = "Very low offer. Stand firm on your price.";
                fairnessColor = "#ffcdd2";
                counterOffer = Math.round(vendorPrice * 0.85); // Max 15% discount
            }
            
            // Ensure counter-offer is never less than buyer's offer
            if (counterOffer < buyerOffer) {
                counterOffer = Math.round((vendorPrice + buyerOffer) / 2);
            }
        } else {
            // Buyer perspective: Is vendor's price fair?
            if (vendorPrice <= avgMarketPrice * 1.05) {
                fairnessAssessment = "Fair price! Close to market average.";
                fairnessColor = "#e8f5e9";
                counterOffer = Math.round(vendorPrice * 0.98); // Small discount
            } else if (vendorPrice <= avgMarketPrice * 1.15) {
                fairnessAssessment = "Slightly high. You can negotiate lower.";
                fairnessColor = "#fff9c4";
                counterOffer = Math.round(avgMarketPrice * 1.05); // Near market rate
            } else if (vendorPrice <= avgMarketPrice * 1.30) {
                fairnessAssessment = "High price. Negotiate for better deal.";
                fairnessColor = "#ffe0b2";
                counterOffer = Math.round(avgMarketPrice * 1.10); // 10% above market
            } else {
                fairnessAssessment = "Very high price. Offer market rate.";
                fairnessColor = "#ffcdd2";
                counterOffer = Math.round(avgMarketPrice); // Market rate
            }
            
            // Ensure counter-offer is never more than vendor's price
            if (counterOffer > vendorPrice) {
                counterOffer = Math.round(vendorPrice * 0.95);
            }
        }

        // Create AI prompt for negotiation sentence
        const prompt = mode === 'vendor' 
            ? `You are an AI negotiation assistant for Indian mandi vendors.

Commodity: ${commodity}
Vendor's asking price: ₹${vendorPrice}/kg
Buyer's offer: ₹${buyerOffer}/kg
Market average: ₹${avgMarketPrice}/kg
Suggested counter-offer: ₹${counterOffer}/kg

Generate ONE polite, respectful negotiation sentence the vendor can say to the buyer. The sentence should:
- Be polite and respectful
- Mention the counter-offer price
- Reference quality or market conditions
- Be short (max 20 words)
- Sound natural for an Indian vendor

Respond with ONLY the sentence, nothing else. In English.`
            : `You are an AI negotiation assistant for Indian market buyers.

Commodity: ${commodity}
Vendor's asking price: ₹${vendorPrice}/kg
Your offer: ₹${buyerOffer}/kg
Market average: ₹${avgMarketPrice}/kg
Suggested counter-offer: ₹${counterOffer}/kg

Generate ONE polite, respectful negotiation sentence the buyer can say to the vendor. The sentence should:
- Be polite and respectful
- Mention the counter-offer price
- Reference market rates or budget
- Be short (max 20 words)
- Sound natural for an Indian buyer

Respond with ONLY the sentence, nothing else. In English.`;

        const payload = {
            inputText: prompt,
            textGenerationConfig: {
                maxTokenCount: 100,
                temperature: 0.7,
                topP: 0.9,
            },
        };

        let negotiationSentence = mode === 'vendor'
            ? `Sir, considering the quality, I can offer you at ₹${counterOffer} per kg.`
            : `Brother, market rate is around ₹${avgMarketPrice}. Can you do ₹${counterOffer} per kg?`;

        try {
            const command = new InvokeModelCommand({
                modelId: "amazon.titan-text-lite-v1",
                contentType: "application/json",
                accept: "application/json",
                body: JSON.stringify(payload),
            });

            const response = await bedrockClient.send(command);
            const responseBody = JSON.parse(new TextDecoder().decode(response.body));
            const aiResponse = responseBody.results[0].outputText.trim();
            
            if (aiResponse && aiResponse.length > 10 && aiResponse.length < 200) {
                negotiationSentence = aiResponse.replace(/^["']|["']$/g, '');
            }
        } catch (error) {
            console.error('Bedrock error:', error);
            // Use fallback sentence
        }

        // Translate to user's language
        let translatedFairness = fairnessAssessment;
        let translatedSentence = negotiationSentence;

        if (language !== 'en') {
            try {
                const fairnessTranslate = new TranslateTextCommand({
                    Text: fairnessAssessment,
                    SourceLanguageCode: 'en',
                    TargetLanguageCode: language,
                });
                const fairnessResponse = await translateClient.send(fairnessTranslate);
                translatedFairness = fairnessResponse.TranslatedText;

                const sentenceTranslate = new TranslateTextCommand({
                    Text: negotiationSentence,
                    SourceLanguageCode: 'en',
                    TargetLanguageCode: language,
                });
                const sentenceResponse = await translateClient.send(sentenceTranslate);
                translatedSentence = sentenceResponse.TranslatedText;
            } catch (error) {
                console.error('Translation error:', error);
            }
        }

        return Response.json({
            fairnessAssessment: translatedFairness,
            fairnessColor,
            counterOffer,
            negotiationSentence: translatedSentence
        });

    } catch (error) {
        console.error('Negotiation API error:', error);
        return Response.json(
            { error: 'Failed to process negotiation' },
            { status: 500 }
        );
    }
}
