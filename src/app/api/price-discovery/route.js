import { TranslateClient, TranslateTextCommand } from "@aws-sdk/client-translate";
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const REGION = process.env.NEXT_PUBLIC_AWS_REGION || "ap-south-1";

const translateClient = new TranslateClient({
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

// Fetch real market data from data.gov.in Agmarknet API
const getRealMarketData = async (commodity, location) => {
    const API_KEY = process.env.DATA_GOV_IN_API_KEY;
    
    if (!API_KEY) {
        console.log('DATA_GOV_IN_API_KEY not found, using simulated data');
        return null;
    }

    try {
        // data.gov.in API endpoint for Agmarknet data
        // Resource ID: 9ef84268-d588-465a-a308-a864a43d0070
        const resourceId = '9ef84268-d588-465a-a308-a864a43d0070';
        const apiUrl = `https://api.data.gov.in/resource/${resourceId}`;
        
        // Map our commodity names to Agmarknet commodity names
        const commodityMap = {
            // Vegetables
            'tomato': 'Tomato',
            'onion': 'Onion',
            'potato': 'Potato',
            'carrot': 'Carrot',
            'cabbage': 'Cabbage',
            'cauliflower': 'Cauliflower',
            'brinjal': 'Brinjal',
            'ladyfinger': 'Lady Finger',
            'capsicum': 'Capsicum',
            'cucumber': 'Cucumber',
            'pumpkin': 'Pumpkin',
            'beetroot': 'Beetroot',
            'radish': 'Radish',
            'beans': 'Beans',
            'peas': 'Peas',
            'spinach': 'Spinach',
            'coriander': 'Coriander Leaves',
            'ginger': 'Ginger',
            'garlic': 'Garlic',
            'greenchilli': 'Green Chilli',
            // Fruits
            'apple': 'Apple',
            'banana': 'Banana',
            'mango': 'Mango',
            'orange': 'Orange',
            'grapes': 'Grapes',
            'pomegranate': 'Pomegranate',
            'papaya': 'Papaya',
            'watermelon': 'Water Melon',
            'pineapple': 'Pineapple',
            'guava': 'Guava',
            'lemon': 'Lemon',
            // Grains & Pulses
            'rice': 'Rice',
            'wheat': 'Wheat',
            'maize': 'Maize',
            'bajra': 'Bajra',
            'jowar': 'Jowar',
            'ragi': 'Ragi',
            'tur': 'Tur Dal',
            'moong': 'Moong Dal',
            'urad': 'Urad Dal',
            'masoor': 'Masoor Dal',
            'chana': 'Gram',
            // Spices & Others
            'turmeric': 'Turmeric',
            'redchilli': 'Red Chilli',
            'corianderseed': 'Coriander Seed',
            'cumin': 'Cumin Seed',
            'blackpepper': 'Black Pepper',
            'cardamom': 'Cardamom',
            'coconut': 'Coconut',
            'groundnut': 'Groundnut',
            'soyabean': 'Soyabean',
            'cotton': 'Cotton',
            'sugarcane': 'Sugarcane'
        };

        // Map our location names to state names
        const stateMap = {
            // Karnataka
            'bangalore': 'Karnataka',
            'mysore': 'Karnataka',
            'mangalore': 'Karnataka',
            'hubli': 'Karnataka',
            'belgaum': 'Karnataka',
            'davangere': 'Karnataka',
            'bellary': 'Karnataka',
            'gulbarga': 'Karnataka',
            'tumkur': 'Karnataka',
            'shimoga': 'Karnataka',
            // Telangana
            'hyderabad': 'Telangana',
            'warangal': 'Telangana',
            'nizamabad': 'Telangana',
            'karimnagar': 'Telangana',
            'khammam': 'Telangana',
            'mahbubnagar': 'Telangana',
            'nalgonda': 'Telangana',
            'adilabad': 'Telangana',
            // Andhra Pradesh
            'vijayawada': 'Andhra Pradesh',
            'visakhapatnam': 'Andhra Pradesh',
            'guntur': 'Andhra Pradesh',
            'nellore': 'Andhra Pradesh',
            'kurnool': 'Andhra Pradesh',
            'kakinada': 'Andhra Pradesh',
            'rajahmundry': 'Andhra Pradesh',
            'tirupati': 'Andhra Pradesh',
            'anantapur': 'Andhra Pradesh',
            'kadapa': 'Andhra Pradesh',
            'eluru': 'Andhra Pradesh',
            'ongole': 'Andhra Pradesh',
            // Tamil Nadu
            'chennai': 'Tamil Nadu',
            'coimbatore': 'Tamil Nadu',
            'madurai': 'Tamil Nadu',
            'tiruchirappalli': 'Tamil Nadu',
            'salem': 'Tamil Nadu',
            'tirunelveli': 'Tamil Nadu',
            'erode': 'Tamil Nadu',
            'vellore': 'Tamil Nadu',
            'thoothukudi': 'Tamil Nadu',
            'thanjavur': 'Tamil Nadu',
            'dindigul': 'Tamil Nadu',
            'kanchipuram': 'Tamil Nadu',
            'karur': 'Tamil Nadu',
            // Kerala
            'kochi': 'Kerala',
            'thiruvananthapuram': 'Kerala',
            // West India
            'mumbai': 'Maharashtra',
            'pune': 'Maharashtra',
            'ahmedabad': 'Gujarat',
            'surat': 'Gujarat',
            'nagpur': 'Maharashtra',
            'nashik': 'Maharashtra',
            'rajkot': 'Gujarat',
            // North India
            'delhi': 'Delhi',
            'jaipur': 'Rajasthan',
            'lucknow': 'Uttar Pradesh',
            'kanpur': 'Uttar Pradesh',
            'agra': 'Uttar Pradesh',
            'chandigarh': 'Chandigarh',
            'amritsar': 'Punjab',
            'ludhiana': 'Punjab',
            // East India
            'kolkata': 'West Bengal',
            'patna': 'Bihar',
            'bhubaneswar': 'Odisha',
            'ranchi': 'Jharkhand',
            'guwahati': 'Assam',
            // Central India
            'bhopal': 'Madhya Pradesh',
            'indore': 'Madhya Pradesh',
            'raipur': 'Chhattisgarh'
        };

        const commodityName = commodityMap[commodity] || 'Tomato';
        const stateName = stateMap[location] || 'Karnataka';

        // Fetch data from API
        const response = await fetch(
            `${apiUrl}?api-key=${API_KEY}&format=json&filters[commodity]=${commodityName}&filters[state]=${stateName}&limit=10`,
            { 
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }
        );

        if (!response.ok) {
            console.error('Agmarknet API error:', response.status);
            return null;
        }

        const data = await response.json();
        
        if (!data.records || data.records.length === 0) {
            console.log('No records found for', commodityName, 'in', stateName);
            return null;
        }

        console.log(`Found ${data.records.length} records for ${commodityName} in ${stateName}`);
        console.log('Sample record:', JSON.stringify(data.records[0], null, 2));

        // Agmarknet prices are typically in rupees per quintal (100 kg)
        // We need to convert to per kg
        const prices = data.records.map(record => ({
            min: (parseFloat(record.min_price) || 0) / 100,  // Convert quintal to kg
            max: (parseFloat(record.max_price) || 0) / 100,  // Convert quintal to kg
            modal: (parseFloat(record.modal_price) || 0) / 100  // Convert quintal to kg
        })).filter(p => p.modal > 0); // Filter out zero prices

        if (prices.length === 0) {
            console.log('No valid prices found in records');
            return null;
        }

        const avgMin = Math.round(prices.reduce((sum, p) => sum + p.min, 0) / prices.length);
        const avgMax = Math.round(prices.reduce((sum, p) => sum + p.max, 0) / prices.length);
        const avgModal = Math.round(prices.reduce((sum, p) => sum + p.modal, 0) / prices.length);

        console.log(`Real prices (per kg) - Min: ₹${avgMin}, Max: ₹${avgMax}, Avg: ₹${avgModal}`);

        return {
            minPrice: avgMin,
            maxPrice: avgMax,
            avgPrice: avgModal,
            trend: 'stable', // Could be calculated from historical data
            source: 'Agmarknet (Government of India)'
        };

    } catch (error) {
        console.error('Error fetching real market data:', error);
        return null;
    }
};

// Get AI-powered price estimate using AWS Bedrock
const getAIPriceEstimate = async (commodity, location, quantity) => {
    try {
        const prompt = `You are an expert agricultural market analyst for India. Provide realistic wholesale market prices for the following:

Commodity: ${commodity}
Location: ${location}, India
Quantity: ${quantity} kg
Date: ${new Date().toLocaleDateString('en-IN')}

Based on typical Indian agricultural market conditions, seasonal factors, and regional variations, provide:
1. Minimum wholesale price per kg (in rupees)
2. Maximum wholesale price per kg (in rupees)
3. Average/Modal price per kg (in rupees)

Respond ONLY with three numbers separated by commas, nothing else.
Format: min,max,average
Example: 35,50,42

Your response:`;

        const payload = {
            inputText: prompt,
            textGenerationConfig: {
                maxTokenCount: 50,
                temperature: 0.3,
                topP: 0.9,
            },
        };

        const command = new InvokeModelCommand({
            modelId: "amazon.titan-text-lite-v1",
            contentType: "application/json",
            accept: "application/json",
            body: JSON.stringify(payload),
        });

        const response = await bedrockClient.send(command);
        const responseBody = JSON.parse(new TextDecoder().decode(response.body));
        const aiResponse = responseBody.results[0].outputText.trim();

        console.log('AI Response:', aiResponse);

        // Parse the response
        const prices = aiResponse.split(',').map(p => parseInt(p.trim())).filter(p => !isNaN(p) && p > 0);

        if (prices.length >= 3) {
            console.log(`AI-generated prices - Min: ₹${prices[0]}, Max: ₹${prices[1]}, Avg: ₹${prices[2]}`);
            return {
                minPrice: prices[0],
                maxPrice: prices[1],
                avgPrice: prices[2],
                trend: 'stable',
                source: 'AI-Powered Estimate (AWS Bedrock)'
            };
        }

        return null;
    } catch (error) {
        console.error('Error getting AI price estimate:', error);
        return null;
    }
};

// Simulated market data (fallback when API key is not available)
const getMarketData = (commodity, location) => {
    // Base prices (₹/kg) - these would come from a real API
    const basePrices = {
        // Vegetables
        tomato: { min: 35, max: 50, avg: 42 },
        onion: { min: 25, max: 40, avg: 32 },
        potato: { min: 18, max: 28, avg: 22 },
        carrot: { min: 30, max: 45, avg: 38 },
        cabbage: { min: 15, max: 25, avg: 20 },
        cauliflower: { min: 25, max: 40, avg: 32 },
        brinjal: { min: 20, max: 35, avg: 28 },
        ladyfinger: { min: 25, max: 40, avg: 32 },
        capsicum: { min: 40, max: 60, avg: 50 },
        cucumber: { min: 15, max: 25, avg: 20 },
        pumpkin: { min: 12, max: 20, avg: 16 },
        beetroot: { min: 25, max: 35, avg: 30 },
        radish: { min: 15, max: 25, avg: 20 },
        beans: { min: 30, max: 50, avg: 40 },
        peas: { min: 40, max: 60, avg: 50 },
        spinach: { min: 20, max: 30, avg: 25 },
        coriander: { min: 30, max: 50, avg: 40 },
        ginger: { min: 80, max: 120, avg: 100 },
        garlic: { min: 60, max: 100, avg: 80 },
        greenchilli: { min: 40, max: 70, avg: 55 },
        // Fruits
        apple: { min: 80, max: 150, avg: 120 },
        banana: { min: 30, max: 50, avg: 40 },
        mango: { min: 50, max: 100, avg: 75 },
        orange: { min: 40, max: 70, avg: 55 },
        grapes: { min: 60, max: 100, avg: 80 },
        pomegranate: { min: 80, max: 150, avg: 120 },
        papaya: { min: 20, max: 35, avg: 28 },
        watermelon: { min: 15, max: 25, avg: 20 },
        pineapple: { min: 30, max: 50, avg: 40 },
        guava: { min: 30, max: 50, avg: 40 },
        lemon: { min: 40, max: 70, avg: 55 },
        // Grains & Pulses
        rice: { min: 45, max: 65, avg: 55 },
        wheat: { min: 25, max: 35, avg: 30 },
        maize: { min: 20, max: 30, avg: 25 },
        bajra: { min: 22, max: 32, avg: 27 },
        jowar: { min: 25, max: 35, avg: 30 },
        ragi: { min: 30, max: 45, avg: 38 },
        tur: { min: 80, max: 120, avg: 100 },
        moong: { min: 70, max: 110, avg: 90 },
        urad: { min: 75, max: 115, avg: 95 },
        masoor: { min: 65, max: 95, avg: 80 },
        chana: { min: 50, max: 80, avg: 65 },
        // Spices & Others
        turmeric: { min: 80, max: 150, avg: 120 },
        redchilli: { min: 100, max: 200, avg: 150 },
        corianderseed: { min: 60, max: 100, avg: 80 },
        cumin: { min: 150, max: 250, avg: 200 },
        blackpepper: { min: 400, max: 600, avg: 500 },
        cardamom: { min: 1000, max: 1500, avg: 1250 },
        coconut: { min: 25, max: 40, avg: 32 },
        groundnut: { min: 60, max: 90, avg: 75 },
        soyabean: { min: 40, max: 60, avg: 50 },
        cotton: { min: 50, max: 80, avg: 65 },
        sugarcane: { min: 3, max: 5, avg: 4 }
    };

    // Location multipliers (simulate regional price variations)
    const locationMultipliers = {
        // Karnataka
        bangalore: 1.1,
        mysore: 1.0,
        mangalore: 1.05,
        hubli: 0.98,
        belgaum: 0.97,
        davangere: 0.95,
        bellary: 0.93,
        gulbarga: 0.92,
        tumkur: 0.98,
        shimoga: 0.96,
        // Telangana
        hyderabad: 1.0,
        warangal: 0.95,
        nizamabad: 0.93,
        karimnagar: 0.94,
        khammam: 0.92,
        mahbubnagar: 0.91,
        nalgonda: 0.93,
        adilabad: 0.90,
        // Andhra Pradesh
        vijayawada: 0.98,
        visakhapatnam: 1.0,
        guntur: 0.96,
        nellore: 0.95,
        kurnool: 0.92,
        kakinada: 0.97,
        rajahmundry: 0.96,
        tirupati: 0.98,
        anantapur: 0.91,
        kadapa: 0.92,
        eluru: 0.94,
        ongole: 0.93,
        // Tamil Nadu
        chennai: 1.05,
        coimbatore: 1.02,
        madurai: 0.98,
        tiruchirappalli: 0.97,
        salem: 0.96,
        tirunelveli: 0.95,
        erode: 0.97,
        vellore: 0.98,
        thoothukudi: 0.96,
        thanjavur: 0.94,
        dindigul: 0.95,
        kanchipuram: 1.0,
        karur: 0.96,
        // Kerala
        kochi: 1.08,
        thiruvananthapuram: 1.05,
        // West India
        mumbai: 1.2,
        pune: 1.1,
        ahmedabad: 1.05,
        surat: 1.03,
        nagpur: 0.98,
        nashik: 1.0,
        rajkot: 1.0,
        // North India
        delhi: 1.15,
        jaipur: 1.0,
        lucknow: 0.95,
        kanpur: 0.93,
        agra: 0.95,
        chandigarh: 1.1,
        amritsar: 0.98,
        ludhiana: 1.0,
        // East India
        kolkata: 0.95,
        patna: 0.90,
        bhubaneswar: 0.95,
        ranchi: 0.92,
        guwahati: 1.0,
        // Central India
        bhopal: 0.98,
        indore: 1.0,
        raipur: 0.93
    };

    const basePrice = basePrices[commodity] || basePrices.tomato;
    const multiplier = locationMultipliers[location] || 1.0;

    return {
        minPrice: Math.round(basePrice.min * multiplier),
        maxPrice: Math.round(basePrice.max * multiplier),
        avgPrice: Math.round(basePrice.avg * multiplier),
        trend: Math.random() > 0.5 ? 'stable' : (Math.random() > 0.5 ? 'rising' : 'falling')
    };
};

export async function POST(request) {
    try {
        const { commodity, location, quantity, language } = await request.json();

        // Try to get real market data first
        let marketData = await getRealMarketData(commodity, location);
        
        // If no real data, try AI-powered estimate
        if (!marketData) {
            console.log(`No real data found, trying AI estimate for ${commodity} in ${location}`);
            marketData = await getAIPriceEstimate(commodity, location, quantity);
        }
        
        // Final fallback to simulated data if AI also fails
        if (!marketData) {
            console.log(`Using simulated data for ${commodity} in ${location}`);
            marketData = getMarketData(commodity, location);
            marketData.source = 'Estimated (Fallback data)';
        } else if (marketData.source?.includes('Agmarknet')) {
            console.log(`Using real Agmarknet data for ${commodity} in ${location}`);
        } else if (marketData.source?.includes('AI-Powered')) {
            console.log(`Using AI-powered estimate for ${commodity} in ${location}`);
        }

        // Smart pricing algorithm (instead of relying on Bedrock)
        const avgPrice = marketData.avgPrice;
        
        // Calculate suggested price based on quantity and market conditions
        let suggestedPrice = avgPrice;
        let explanation = "";

        // Bulk discount logic
        const qty = parseInt(quantity) || 10;
        if (qty >= 50) {
            suggestedPrice = Math.round(avgPrice * 0.95); // 5% discount for bulk
            explanation = "Good bulk quantity. Price slightly below market average for faster sale.";
        } else if (qty >= 20) {
            suggestedPrice = avgPrice;
            explanation = "Fair market price. Good quantity for steady sales.";
        } else {
            suggestedPrice = Math.round(avgPrice * 1.05); // Small premium for small quantity
            explanation = "Small quantity. Slightly above average to maintain profit margin.";
        }

        // Adjust based on market trend
        if (marketData.trend === 'rising') {
            suggestedPrice = Math.round(suggestedPrice * 1.03);
            explanation += " Market is rising, good time to sell.";
        } else if (marketData.trend === 'falling') {
            suggestedPrice = Math.round(suggestedPrice * 0.98);
            explanation += " Market is falling, price adjusted for quick sale.";
        }

        // Ensure suggested price is within reasonable range
        suggestedPrice = Math.max(marketData.minPrice, Math.min(marketData.maxPrice, suggestedPrice));

        // Translate explanation to user's language if not English
        let translatedExplanation = explanation;
        if (language !== 'en') {
            try {
                const translateCommand = new TranslateTextCommand({
                    Text: explanation,
                    SourceLanguageCode: 'en',
                    TargetLanguageCode: language,
                });
                const translateResponse = await translateClient.send(translateCommand);
                translatedExplanation = translateResponse.TranslatedText;
            } catch (error) {
                console.error('Translation error:', error);
                // Keep English if translation fails
            }
        }

        // Create spoken text
        const spokenText = `${translatedExplanation} ${suggestedPrice}`;

        return Response.json({
            averagePrice: avgPrice,
            suggestedPrice: suggestedPrice,
            explanation: translatedExplanation,
            spokenText: spokenText,
            marketData: {
                min: marketData.minPrice,
                max: marketData.maxPrice,
                trend: marketData.trend,
                source: marketData.source
            }
        });

    } catch (error) {
        console.error('Price discovery API error:', error);
        return Response.json(
            { error: 'Failed to get price data', details: error.message },
            { status: 500 }
        );
    }
}
