# Multilingual Mandi - Design Document

## Architecture Overview

### System Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                     Next.js Frontend                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Home    │  │  Price   │  │Negotiation│  │  Speak   │   │
│  │  Page    │  │Discovery │  │ Assistant │  │  Vendor  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                 │
│  │Calculator│  │Signboard │  │  Vendor  │                 │
│  │          │  │Translator│  │  Rating  │                 │
│  └──────────┘  └──────────┘  └──────────┘                 │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   API Routes (Next.js)                       │
│  /api/price-discovery  /api/negotiation  /api/signboard    │
└─────────────────────────────────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┬────────────────┐
        ▼                 ▼                 ▼                ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ AWS Translate│  │  AWS Polly   │  │AWS Rekognition│  │ AWS Bedrock  │
│  (6 langs)   │  │ (Text-Speech)│  │     (OCR)     │  │  (AI Model)  │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
                          │
                          ▼
                ┌──────────────────┐
                │  data.gov.in API │
                │   (Agmarknet)    │
                └──────────────────┘
```

### Technology Stack
- **Frontend**: Next.js 16.1.6 (React, App Router)
- **Styling**: CSS with custom properties
- **State**: React Context API + localStorage
- **APIs**: Next.js API routes
- **AI/ML**: AWS Bedrock (Titan models)
- **Translation**: AWS Translate
- **Voice**: AWS Polly
- **Vision**: AWS Rekognition
- **Data**: data.gov.in Agmarknet API


## Core Components

### 1. Language Context (`src/lib/language-context.js`)

**Purpose**: Global language state management

**Implementation**:
```javascript
const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en');
  
  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem('preferredLanguage');
    if (saved) setLanguage(saved);
  }, []);
  
  const updateLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('preferredLanguage', lang);
  };
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage: updateLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}
```

**Key Features**:
- Persists language selection across sessions
- Provides global access to current language
- Triggers re-renders when language changes

---

### 2. AWS Services (`src/lib/aws-services.js`)

**Purpose**: Centralized AWS service wrappers

**Services**:

#### TranslationService
```javascript
translate: async (text, sourceLang, targetLang) => {
  const command = new TranslateTextCommand({
    Text: text,
    SourceLanguageCode: sourceLang,
    TargetLanguageCode: targetLang,
  });
  return await translateClient.send(command);
}
```

#### VoiceService
```javascript
speak: async (text, languageCode) => {
  const command = new SynthesizeSpeechCommand({
    Text: text,
    OutputFormat: "mp3",
    VoiceId: "Aditi", // Hindi/English voice
    LanguageCode: languageCode,
  });
  const response = await pollyClient.send(command);
  const audioData = await response.AudioStream.transformToByteArray();
  const blob = new Blob([audioData], { type: "audio/mpeg" });
  return URL.createObjectURL(blob);
}
```

#### VisionService
```javascript
analyzeImage: async (imageBytes) => {
  const command = new DetectLabelsCommand({
    Image: { Bytes: imageBytes },
    MaxLabels: 5,
    MinConfidence: 80,
  });
  return await rekognitionClient.send(command);
}
```

#### AiService
```javascript
negotiate: async (userMessage, context) => {
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
    body: JSON.stringify(payload),
  });
  return await bedrockClient.send(command);
}
```

---

## Feature Designs

### Feature 1: Price Discovery

**Page**: `src/app/features/price-discovery/page.js`  
**API**: `src/app/api/price-discovery/route.js`

#### Data Flow
```
User Input (commodity, location, quantity)
    ↓
API Route: /api/price-discovery
    ↓
1. Try getRealMarketData() → Agmarknet API
    ↓ (if fails)
2. Try getAIPriceEstimate() → AWS Bedrock
    ↓ (if fails)
3. Use getMarketData() → Simulated fallback
    ↓
Smart Pricing Algorithm
    ↓
AWS Translate (explanation)
    ↓
Return: { averagePrice, suggestedPrice, explanation, marketData }
    ↓
Frontend: Display + AWS Polly (voice output)
```

#### Smart Pricing Algorithm
```javascript
// Base price from data source
let suggestedPrice = marketData.avgPrice;

// Quantity-based adjustment
if (quantity >= 50) {
  suggestedPrice *= 0.95; // 5% discount
} else if (quantity >= 20) {
  suggestedPrice *= 1.0;  // No change
} else {
  suggestedPrice *= 1.05; // 5% premium
}

// Trend-based adjustment
if (trend === 'rising') {
  suggestedPrice *= 1.03; // +3%
} else if (trend === 'falling') {
  suggestedPrice *= 0.98; // -2%
}

// Ensure within min-max range
suggestedPrice = Math.max(minPrice, Math.min(maxPrice, suggestedPrice));
```

#### Agmarknet API Integration
```javascript
const apiUrl = `https://api.data.gov.in/resource/${resourceId}`;
const response = await fetch(
  `${apiUrl}?api-key=${API_KEY}&format=json&filters[commodity]=${commodityName}&filters[state]=${stateName}&limit=10`
);

// CRITICAL: Convert quintal to kg
const prices = data.records.map(record => ({
  min: parseFloat(record.min_price) / 100,
  max: parseFloat(record.max_price) / 100,
  modal: parseFloat(record.modal_price) / 100
}));
```

---

### Feature 2: Negotiation Assistant

**Page**: `src/app/features/negotiation/page.js`  
**API**: `src/app/api/negotiation/route.js`

#### Negotiation Logic

**Vendor Mode**:
```javascript
// Assess fairness
const difference = buyerOffer - vendorPrice;
const percentDiff = (difference / vendorPrice) * 100;

let fairness = 'Too Low';
if (percentDiff >= -5) fairness = 'Great Deal';
else if (percentDiff >= -10) fairness = 'Fair';
else if (percentDiff >= -20) fairness = 'Low';

// Counter-offer calculation
let counterOffer = vendorPrice;
if (marketAverage) {
  counterOffer = (vendorPrice + marketAverage) / 2;
} else {
  counterOffer = vendorPrice * 0.95; // 5% reduction
}

// CRITICAL: Never go below buyer's offer
counterOffer = Math.max(buyerOffer, counterOffer);
```

**Buyer Mode**:
```javascript
// Assess fairness
const difference = vendorPrice - marketAverage;
const percentDiff = (difference / marketAverage) * 100;

let fairness = 'Too High';
if (percentDiff <= 5) fairness = 'Great Deal';
else if (percentDiff <= 10) fairness = 'Fair';
else if (percentDiff <= 20) fairness = 'High';

// Counter-offer calculation
let counterOffer = marketAverage;
if (buyerOffer) {
  counterOffer = (buyerOffer + marketAverage) / 2;
} else {
  counterOffer = vendorPrice * 0.90; // 10% reduction
}

// CRITICAL: Never go above vendor's price
counterOffer = Math.min(vendorPrice, counterOffer);
```

#### AI Sentence Generation
```javascript
const prompt = `Generate a polite negotiation sentence for a ${mode} in an Indian market.
Context: ${commodity}, vendor price: ${vendorPrice}, buyer offer: ${buyerOffer}
Counter-offer: ${counterOffer}
Language: English (will be translated)`;

const response = await bedrockClient.send(new InvokeModelCommand({
  modelId: "amazon.titan-text-premier-v1:0",
  body: JSON.stringify({ inputText: prompt })
}));
```

---

### Feature 3: Speak with Vendor

**Page**: `src/app/features/speak-with-vendor/page.js`

#### Speech Recognition
```javascript
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = language === 'hi' ? 'hi-IN' : 'en-US';
recognition.continuous = false;
recognition.interimResults = false;

recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  setInputText(transcript);
};
```

#### Virtual Keyboard Integration
```javascript
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';

const keyboardLayouts = {
  hindi: {
    default: ['अ आ इ ई उ ऊ ए ऐ ओ औ', 'क ख ग घ ङ च छ ज झ ञ', ...]
  },
  telugu: {
    default: ['అ ఆ ఇ ఈ ఉ ఊ ఎ ఏ ఐ ఒ ఓ ఔ అం అః', ...]
  },
  // ... other languages
};

<Keyboard
  layout={keyboardLayouts[language]}
  onChange={(input) => setInputText(input)}
  onKeyPress={(button) => handleKeyPress(button)}
/>
```

#### Translation Flow
```javascript
const handleSendMessage = async () => {
  const sourceLang = speakerMode === 'user' ? language : 'en';
  const targetLang = speakerMode === 'user' ? 'en' : language;
  
  const translated = await TranslationService.translate(
    inputText, 
    sourceLang, 
    targetLang
  );
  
  setMessages([...messages, {
    speaker: speakerMode,
    original: inputText,
    translated: translated,
    timestamp: new Date()
  }]);
};
```

---

### Feature 4: Smart Calculator

**Page**: `src/app/features/calculator/page.js`

#### Voice Command Parsing
```javascript
const parseVoiceCommand = (transcript) => {
  // Pattern: "10 kilos at 28 rupees"
  const pattern = /(\d+)\s*(kilo|kg|kilogram)s?\s*at\s*(\d+)\s*(rupee|rupees|rs)/i;
  const match = transcript.match(pattern);
  
  if (match) {
    return {
      quantity: parseFloat(match[1]),
      price: parseFloat(match[3])
    };
  }
  return null;
};
```

#### Discount Calculation
```javascript
const calculateDiscount = (quantity) => {
  if (quantity >= 50) return 0.10; // 10%
  if (quantity >= 20) return 0.05; // 5%
  if (quantity >= 10) return 0.02; // 2%
  return 0;
};

const subtotal = quantity * pricePerKg;
const discountPercent = calculateDiscount(quantity);
const discountAmount = subtotal * discountPercent;
const finalAmount = subtotal - discountAmount;
```

#### Shopping Cart Management
```javascript
const [cart, setCart] = useState([]);

const addToCart = () => {
  const item = {
    id: Date.now(),
    name: itemName || 'Item',
    quantity,
    unit: weightUnit,
    pricePerKg,
    discount: discountPercent,
    total: finalAmount
  };
  setCart([...cart, item]);
};

const removeFromCart = (itemId) => {
  setCart(cart.filter(item => item.id !== itemId));
};

const grandTotal = cart.reduce((sum, item) => sum + item.total, 0);
```

---

### Feature 5: Signboard Translator

**Page**: `src/app/features/camera/page.js`  
**API**: `src/app/api/signboard-translate/route.js`

#### Image Capture & Processing
```javascript
const handleCapture = async (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();
  
  reader.onload = async (e) => {
    const base64Image = e.target.result.split(',')[1];
    
    const response = await fetch('/api/signboard-translate', {
      method: 'POST',
      body: JSON.stringify({
        image: base64Image,
        targetLanguage: language
      })
    });
    
    const data = await response.json();
    setOriginalText(data.originalText);
    setTranslatedText(data.translatedText);
  };
  
  reader.readAsDataURL(file);
};
```

#### OCR with AWS Rekognition
```javascript
// Convert base64 to Buffer
const imageBuffer = Buffer.from(base64Image, 'base64');

const command = new DetectTextCommand({
  Image: { Bytes: imageBuffer }
});

const response = await rekognitionClient.send(command);

// Extract text blocks
const textBlocks = response.TextDetections
  .filter(detection => detection.Type === 'LINE')
  .map(detection => detection.DetectedText)
  .join('\n');
```

#### Language Detection
```javascript
const detectLanguage = (text) => {
  const unicodeRanges = {
    hindi: /[\u0900-\u097F]/,
    telugu: /[\u0C00-\u0C7F]/,
    tamil: /[\u0B80-\u0BFF]/,
    kannada: /[\u0C80-\u0CFF]/,
    malayalam: /[\u0D00-\u0D7F]/,
    english: /[A-Za-z]/
  };
  
  for (const [lang, regex] of Object.entries(unicodeRanges)) {
    if (regex.test(text)) return lang;
  }
  
  return 'english';
};
```

---

### Feature 6: Vendor Rating

**Page**: `src/app/features/vendor-rating/page.js`

#### Mock Vendor Data
```javascript
const vendors = [
  {
    id: 1,
    name: 'Raju',
    shopName: 'Raju Fresh Vegetables',
    location: 'Bangalore',
    rating: 4.8,
    totalReviews: 234,
    languages: ['Kannada', 'Hindi', 'English'],
    items: ['Vegetables', 'Fruits'],
    positiveFeedback: 92
  },
  // ... more vendors
];
```

#### Trust Badge Logic
```javascript
const getTrustBadge = (rating, totalReviews) => {
  if (rating >= 4.7 && totalReviews >= 150) {
    return { badge: '🔵 Top Rated', color: '#2196f3' };
  } else if (rating >= 4.0 && totalReviews >= 100) {
    return { badge: '🟢 Trusted Vendor', color: '#4caf50' };
  } else if (totalReviews < 50) {
    return { badge: '🟡 New Vendor', color: '#ffc107' };
  }
  return { badge: '', color: '#999' };
};
```

#### Rating Submission
```javascript
const handleSubmitRating = () => {
  // In production, would POST to API
  const newRating = {
    vendorId: selectedVendor,
    rating: starRating,
    feedback: {
      fairPrice: quickFeedback.fairPrice,
      goodQuality: quickFeedback.goodQuality,
      honestDealing: quickFeedback.honestDealing
    },
    timestamp: new Date()
  };
  
  // Update vendor's average rating
  // Show success message
};
```

---

## UI/UX Design Patterns

### 1. Multilingual Text Pattern
```javascript
const getText = (key) => {
  const texts = {
    title: {
      en: "Price Discovery",
      hi: "भाव पता करें",
      te: "ధర కనుగొనండి",
      ta: "விலை கண்டுபிடிப்பு",
      kn: "ಬೆಲೆ ಕಂಡುಹಿಡಿಯುವಿಕೆ",
      ml: "വില കണ്ടെത്തൽ"
    },
    // ... more keys
  };
  return texts[key]?.[language] || texts[key]?.en || key;
};
```

### 2. Background Image Management
```javascript
useEffect(() => {
  // Set feature-specific background
  document.body.style.backgroundImage = "url('/feature-bg.png')";
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundAttachment = "fixed";
  
  // Cleanup: revert to home background
  return () => {
    document.body.style.backgroundImage = "url('/indian_market_painting.png')";
  };
}, []);
```

### 3. Text Visibility Enhancement
```css
h2 {
  color: #000000;
  font-size: 2.5rem;
  font-weight: bold;
  text-shadow: 
    2px 2px 8px rgba(255, 255, 255, 0.9),
    -2px -2px 8px rgba(255, 255, 255, 0.9),
    2px -2px 8px rgba(255, 255, 255, 0.9),
    -2px 2px 8px rgba(255, 255, 255, 0.9);
}
```

### 4. Artistic Card Style
```css
.artistic-card {
  background: var(--color-cream);
  padding: 25px;
  border-radius: 8px;
  border: 3px solid var(--color-earth);
  box-shadow: 5px 5px 0px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}
```

---

## Data Models

### Language Preference
```javascript
{
  language: 'en' | 'hi' | 'te' | 'ta' | 'kn' | 'ml',
  storedIn: 'localStorage',
  key: 'preferredLanguage'
}
```

### Price Discovery Result
```javascript
{
  averagePrice: number,      // ₹/kg
  suggestedPrice: number,    // ₹/kg
  explanation: string,       // Translated
  spokenText: string,        // For voice output
  marketData: {
    min: number,
    max: number,
    trend: 'rising' | 'falling' | 'stable',
    source: string           // Data source attribution
  }
}
```

### Negotiation Result
```javascript
{
  fairness: 'Great Deal' | 'Fair' | 'High' | 'Too High' | 'Low' | 'Too Low',
  fairnessColor: string,     // CSS color
  counterOffer: number,      // ₹/kg
  negotiationSentence: string, // Translated
  explanation: string        // Translated
}
```

### Chat Message
```javascript
{
  speaker: 'user' | 'vendor',
  original: string,          // Original language
  translated: string,        // Translated language
  timestamp: Date
}
```

### Cart Item
```javascript
{
  id: number,
  name: string,
  quantity: number,
  unit: 'kg' | 'g',
  pricePerKg: number,
  discount: number,          // Percentage (0-1)
  total: number              // Final amount
}
```

### Vendor Profile
```javascript
{
  id: number,
  name: string,
  shopName: string,
  location: string,
  rating: number,            // 0-5
  totalReviews: number,
  languages: string[],
  items: string[],
  positiveFeedback: number   // Percentage
}
```

---

## Performance Optimizations

### 1. API Response Caching
```javascript
// Cache Agmarknet responses for 1 hour
const cache = new Map();
const CACHE_TTL = 3600000; // 1 hour

const getCachedData = (key) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  return null;
};
```

### 2. Lazy Loading Images
```javascript
<img 
  src="/feature-bg.png" 
  loading="lazy" 
  alt="Background"
/>
```

### 3. Debounced Voice Input
```javascript
const debouncedTranslate = useCallback(
  debounce(async (text) => {
    const translated = await TranslationService.translate(text, 'en', language);
    setTranslatedText(translated);
  }, 500),
  [language]
);
```

---

## Security Considerations

### 1. Environment Variables
- AWS credentials stored in `.env.local`
- Never committed to version control
- Server-side only (API routes)

### 2. Input Validation
```javascript
// Validate numeric inputs
const validatePrice = (price) => {
  const num = parseFloat(price);
  return !isNaN(num) && num > 0 && num < 100000;
};

// Sanitize text inputs
const sanitizeText = (text) => {
  return text.replace(/<script>/gi, '').trim();
};
```

### 3. Rate Limiting
```javascript
// Implement in production
const rateLimit = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // Max requests per window
};
```

---

## Error Handling

### 1. AWS Service Errors
```javascript
try {
  const result = await translateClient.send(command);
  return result.TranslatedText;
} catch (error) {
  console.error('Translation error:', error);
  return originalText; // Fallback to original
}
```

### 2. API Fallback Chain
```
Real Data (Agmarknet)
  ↓ (if fails)
AI Estimate (Bedrock)
  ↓ (if fails)
Simulated Data (Fallback)
```

### 3. User-Friendly Messages
```javascript
const getErrorMessage = (error, language) => {
  const messages = {
    network: {
      en: "Network error. Please check your connection.",
      hi: "नेटवर्क त्रुटि। कृपया अपना कनेक्शन जांचें।",
      // ... other languages
    },
    // ... other error types
  };
  return messages[error.type]?.[language] || messages[error.type]?.en;
};
```

---

## Testing Strategy

### Unit Tests
- AWS service wrappers
- Price calculation algorithms
- Language detection logic
- Discount calculations

### Integration Tests
- API routes with mock AWS services
- Translation flow end-to-end
- Price discovery with fallback chain

### E2E Tests
- Complete user flows for each feature
- Language switching across pages
- Voice input/output functionality

### Manual Testing
- Test on real devices (mobile, tablet, desktop)
- Test with actual AWS services
- Test with real Agmarknet API
- Test voice recognition in noisy environments

---

## Deployment Architecture

### Production Environment
```
Vercel / AWS Amplify
    ↓
Next.js App (SSR + Static)
    ↓
API Routes (Serverless Functions)
    ↓
AWS Services (Translate, Polly, Rekognition, Bedrock)
    ↓
External APIs (data.gov.in)
```

### Environment Configuration
```
Development:
- Local Next.js server (npm run dev)
- AWS services in ap-south-1 region
- Mock data for testing

Production:
- Vercel/Amplify deployment
- AWS services in ap-south-1 region
- Real Agmarknet API
- CDN for static assets
```

---

## Future Enhancements

### Phase 2: User Authentication
- JWT-based authentication
- User profiles (buyer/vendor)
- Session management
- Password reset flow

### Phase 3: Real-time Features
- WebSocket-based chat
- Live price updates
- Push notifications
- Real-time vendor availability

### Phase 4: Advanced Features
- Product catalog with images
- Order management
- Payment integration
- Delivery tracking
- Vendor verification
- Advanced analytics

### Phase 5: Offline Support
- Service workers
- IndexedDB for local storage
- Offline price cache
- Sync when online

---

## Maintenance & Monitoring

### Logging
```javascript
// Structured logging
console.log({
  timestamp: new Date().toISOString(),
  feature: 'price-discovery',
  action: 'fetch-real-data',
  commodity,
  location,
  success: true,
  source: 'agmarknet'
});
```

### Monitoring Metrics
- API response times
- AWS service usage
- Error rates by feature
- Language usage distribution
- User engagement metrics

### Cost Optimization
- Cache frequently requested translations
- Batch AWS Translate requests
- Use Bedrock Lite models where possible
- Implement request throttling
- Monitor AWS costs daily
