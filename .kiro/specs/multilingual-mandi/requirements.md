# Multilingual Mandi - Requirements Documentation

## Project Overview
The Multilingual Mandi is an AI-powered marketplace application designed to bridge language barriers in Indian markets. It provides real-time translation, price discovery, negotiation assistance, and various tools to help buyers and vendors communicate and transact effectively across 6 Indian languages.

## Target Users
- **Primary**: Vendors and buyers in Indian mandis (markets) who speak different languages
- **Secondary**: Small-scale farmers, street vendors, and local shopkeepers
- **Geographic Focus**: India (with emphasis on South India)

## Supported Languages
1. English (en)
2. Hindi (hi) - हिंदी
3. Telugu (te) - తెలుగు
4. Tamil (ta) - தமிழ்
5. Kannada (kn) - ಕನ್ನಡ
6. Malayalam (ml) - മലയാളം

---

## Feature 1: Price Discovery

### User Story
**As a** vendor or buyer  
**I want to** check fair market prices for commodities  
**So that** I can negotiate fairly and avoid being cheated

### Acceptance Criteria

#### 1.1 Commodity Selection
- System provides 60+ commodities across 4 categories:
  - Vegetables (20 items): Tomato, Onion, Potato, Carrot, Cabbage, etc.
  - Fruits (11 items): Apple, Banana, Mango, Orange, Grapes, etc.
  - Grains & Pulses (11 items): Rice, Wheat, Maize, Tur Dal, Moong Dal, etc.
  - Spices & Others (11 items): Turmeric, Red Chilli, Coconut, Groundnut, etc.
- Dropdown organized by category for easy selection
- Each item has emoji icon for visual recognition

#### 1.2 Location Selection
- System provides 70+ cities across India:
  - South India (45+ cities): Karnataka, Telangana, Andhra Pradesh, Tamil Nadu, Kerala
  - West India (7 cities): Maharashtra, Gujarat
  - North India (8 cities): Delhi, Rajasthan, Uttar Pradesh, Punjab, Chandigarh
  - East India (5 cities): West Bengal, Bihar, Odisha, Jharkhand, Assam
  - Central India (3 cities): Madhya Pradesh, Chhattisgarh
- Dropdown organized by region for easy selection

#### 1.3 Quantity Input
- User can enter quantity in kilograms (kg)
- Minimum quantity: 1 kg
- Input validates numeric values only
- Default value: 10 kg

#### 1.4 Real Market Data Integration
- System fetches real prices from data.gov.in Agmarknet API
- API Key: Uses AGMARKNET_API_KEY from environment variables
- Prices converted from quintal (100 kg) to per kg
- Shows "✅ Real Data" badge when using Agmarknet data
- Source attribution: "Agmarknet (Government of India)"

#### 1.5 AI-Powered Price Estimates
- When real data unavailable, system uses AWS Bedrock (Titan Text Lite)
- AI considers: commodity, location, quantity, date, seasonal factors
- Shows "🤖 AI Estimate" badge when using AI data
- Source attribution: "AI-Powered Estimate (AWS Bedrock)"

#### 1.6 Fallback Simulated Data
- When both real and AI data fail, system uses simulated prices
- Simulated prices based on realistic market ranges
- Location multipliers adjust for regional variations
- Shows "📊 Estimated" badge when using fallback data
- Source attribution: "Estimated (Fallback data)"

#### 1.7 Price Display
- **Average Market Price**: Shows per kg price from data source
- **Suggested Fair Price**: Smart algorithm adjusts based on:
  - Quantity (bulk discounts: 5% for 50+ kg, 0% for 20-49 kg, +5% for <20 kg)
  - Market trend (rising: +3%, falling: -2%, stable: 0%)
  - Ensures price stays within min-max range
- **Total Price**: Shows total cost for quantity (quantity × price per kg)
- **Explanation**: Provides reasoning for suggested price in user's language

#### 1.8 Multilingual Support
- All UI text translated to user's selected language
- Explanation text translated using AWS Translate
- Voice output speaks result in user's language using AWS Polly
- Language selection persists across page navigation

#### 1.9 Voice Output
- System automatically speaks price result after calculation
- Uses AWS Polly for text-to-speech
- Supports all 6 languages (with Hindi voice fallback for regional languages)

---

## Feature 2: Negotiation Assistant

### User Story
**As a** vendor or buyer  
**I want to** get AI-powered negotiation advice  
**So that** I can make fair counter-offers and close deals effectively

### Acceptance Criteria

#### 2.1 Dual Mode Toggle
- User can switch between "Vendor Mode" and "Buyer Mode"
- Mode selection changes perspective and advice
- UI clearly indicates current mode with color coding

#### 2.2 Input Fields
- **Commodity**: Dropdown with same 60+ items from price discovery
- **Vendor Asking Price**: Numeric input (₹/kg)
- **Buyer Offer**: Numeric input (₹/kg)
- **Market Average** (optional): Numeric input (₹/kg)
- All fields validate numeric values

#### 2.3 Vendor Mode Logic
- Assesses if buyer's offer is fair compared to asking price
- Suggests counter-offer that:
  - Is never less than buyer's current offer
  - Moves toward market average if available
  - Considers 5-10% negotiation margin
- Provides polite negotiation sentence in vendor's language

#### 2.4 Buyer Mode Logic
- Assesses if vendor's price is fair compared to market
- Suggests counter-offer that:
  - Is never more than vendor's current price
  - Moves toward market average if available
  - Considers 5-10% negotiation margin
- Provides polite negotiation sentence in buyer's language

#### 2.5 Fairness Assessment
- **Great Deal** (green): Offer within 5% of market average
- **Fair** (yellow): Offer within 10% of market average
- **High** (orange): Offer 10-20% above market average
- **Too High** (red): Offer more than 20% above market average
- Color-coded visual indicator for quick understanding

#### 2.6 AI-Generated Negotiation Sentences
- Uses AWS Bedrock to generate culturally appropriate phrases
- Sentences are polite, respectful, and market-appropriate
- Translated to user's language using AWS Translate
- Voice output available using AWS Polly

#### 2.7 Negotiation Tips
- **Vendor Tips** (10 tips): Start high, know your cost, be patient, etc.
- **Buyer Tips** (10 tips): Research prices, buy in bulk, build relationships, etc.
- Tips displayed on left side of interface
- Each tip is clickable with voice output in all languages

#### 2.8 Quick Phrases
- **Vendor Phrases** (5 phrases): "This is my best price", "I can give small discount", etc.
- **Buyer Phrases** (5 phrases): "Can you reduce price?", "I will buy more next time", etc.
- Phrases displayed on right side of interface
- Each phrase is clickable with voice output in all languages

---

## Feature 3: Speak with Vendor

### User Story
**As a** buyer or vendor  
**I want to** have real-time translated conversations  
**So that** I can communicate despite language barriers

### Acceptance Criteria

#### 3.1 Speaker Mode Toggle
- User can switch between "User" and "Vendor" buttons
- Current speaker clearly indicated
- Mode determines which language is source/target

#### 3.2 Speech Input
- Microphone button (🎤) for voice input
- Uses browser's Web Speech API
- Supports English and Hindi speech recognition
- Visual feedback during recording

#### 3.3 Text Input Fallback
- Text input field available when speech not working
- Supports typing in any language
- Submit button to send message

#### 3.4 Virtual Keyboard
- Keyboard toggle button (⌨️) appears for non-English languages
- Custom layouts for Hindi, Telugu, Tamil, Kannada, Malayalam
- Uses react-simple-keyboard library
- Full character sets including vowels, consonants, numbers, symbols
- Keyboard hides when not needed

#### 3.5 Chat Interface
- Messages displayed in conversation format
- Each message shows:
  - Original text (in speaker's language)
  - Translated text (in listener's language)
- User messages aligned right (blue background)
- Vendor messages aligned left (green background)
- Timestamps for each message

#### 3.6 Real-time Translation
- Uses AWS Translate for instant translation
- Automatic language detection based on speaker mode
- Translation happens immediately after message sent
- Both original and translated text preserved

#### 3.7 Conversation History
- All messages stored in session
- Scrollable chat history
- Clear conversation option available

---

## Feature 4: Smart Calculator

### User Story
**As a** vendor  
**I want to** quickly calculate prices with automatic discounts  
**So that** I can provide accurate totals to customers

### Acceptance Criteria

#### 4.1 Voice Input
- Microphone button for voice commands
- Recognizes patterns like "10 kilos at 28 rupees"
- Automatically parses and fills quantity and price fields
- Supports English and Hindi voice input

#### 4.2 Manual Input Fields
- **Item Name** (optional): Text input for commodity name
- **Quantity**: Numeric input with kg/grams toggle
- **Price per kg**: Numeric input (₹)
- Weight unit toggle between kg and grams

#### 4.3 Quick Calculation Buttons
- One-click buttons: 1kg, 5kg, 10kg, 500g
- Instantly sets quantity to selected value
- Speeds up common calculations

#### 4.4 Automatic Bulk Discounts
- **2% off** for 10+ kg
- **5% off** for 20+ kg
- **10% off** for 50+ kg
- Discount automatically applied based on quantity
- Discount amount shown separately

#### 4.5 Price Calculation Display
- **Subtotal**: Quantity × Price per kg
- **Discount**: Amount saved (if applicable)
- **Final Amount**: Subtotal - Discount
- Large, clear display of final amount
- All amounts in Indian Rupees (₹)

#### 4.6 Shopping Cart
- "Add to Cart" button to save item
- Cart shows all added items with:
  - Item name
  - Quantity and unit
  - Price per kg
  - Discount applied
  - Item total
- **Grand Total**: Sum of all items in cart
- Remove individual items from cart
- Clear entire cart option

#### 4.7 Voice Output
- "Speak Total" button for voice announcement
- Speaks final amount in user's language
- Uses AWS Polly for text-to-speech

#### 4.8 Multilingual Support
- All labels, buttons, messages in 6 languages
- Number formatting respects locale
- Voice input/output in user's language

---

## Feature 5: Signboard Translator

### User Story
**As a** buyer  
**I want to** translate signboards and price boards using my camera  
**So that** I can understand prices and information in unfamiliar languages

### Acceptance Criteria

#### 5.1 Camera Capture
- Camera button to take photo
- File upload option for existing images
- Image preview before processing
- Supports common image formats (JPG, PNG)

#### 5.2 OCR Text Extraction
- Uses AWS Rekognition DetectText API
- Extracts all text from image
- Preserves text layout and structure
- Handles multiple text blocks

#### 5.3 Automatic Language Detection
- Detects language based on Unicode script ranges:
  - Devanagari (U+0900-U+097F): Hindi
  - Telugu (U+0C00-U+0C7F): Telugu
  - Tamil (U+0B80-U+0BFF): Tamil
  - Kannada (U+0C80-U+0CFF): Kannada
  - Malayalam (U+0D00-U+0D7F): Malayalam
  - Latin (U+0000-U+007F): English
- Shows detected language to user

#### 5.4 Text Translation
- Uses AWS Translate for translation
- Translates to user's preferred language
- Preserves numbers, prices, and formatting
- Handles mixed-language text

#### 5.5 Side-by-Side Display
- **Original Text** (left side, cream background)
- **Translated Text** (right side, blue background)
- Clear visual separation
- Easy comparison of original and translation

#### 5.6 Voice Output
- "Speak Translation" button
- Reads translated text aloud
- Uses AWS Polly for text-to-speech
- Supports all 6 languages

#### 5.7 Error Handling
- Clear error messages if OCR fails
- Fallback if no text detected
- Guidance for better image quality

---

## Feature 6: Vendor Rating & Trust Score

### User Story
**As a** buyer  
**I want to** view vendor ratings and provide feedback  
**So that** I can choose trustworthy vendors and help others

### Acceptance Criteria

#### 6.1 Mode Toggle
- Switch between "View Vendors" and "Rate a Vendor"
- Clear visual indication of current mode

#### 6.2 View Vendors Mode
- List of all vendors with:
  - Vendor name
  - Shop name
  - Location (city)
  - Rating (⭐ out of 5)
  - Total reviews count
  - Trust badge
  - Languages spoken
  - Items sold
  - Positive feedback percentage
- Vendors sorted by rating (highest first)

#### 6.3 Trust Badges
- **🔵 Top Rated**: Rating ≥ 4.7 and ≥ 150 reviews
- **🟢 Trusted Vendor**: Rating ≥ 4.0 and ≥ 100 reviews
- **🟡 New Vendor**: < 50 reviews
- Badge displayed prominently with vendor info

#### 6.4 Rate Vendor Mode
- Dropdown to select vendor
- Star rating selector (1-5 stars)
- Visual feedback on star selection
- Quick feedback checkboxes:
  - ✓ Fair Price
  - ✓ Good Quality
  - ✓ Honest Dealing
- Submit button to save rating

#### 6.5 Rating Submission
- Validates that vendor is selected
- Validates that rating is given (1-5 stars)
- Quick feedback is optional
- Success message after submission
- Updates vendor's average rating

#### 6.6 Mock Data (Current Implementation)
- 4 sample vendors with realistic data:
  - Raju (Bangalore, 4.8 rating, 234 reviews)
  - Lakshmi (Hyderabad, 4.5 rating, 156 reviews)
  - Kumar (Chennai, 4.2 rating, 89 reviews)
  - Priya (Mysore, 3.9 rating, 45 reviews)
- In production, would connect to database

#### 6.7 Multilingual Support
- All vendor information in user's language
- Rating interface translated
- Success messages in user's language

---

## Feature 7: Home Page & Navigation

### User Story
**As a** user  
**I want to** easily navigate between features  
**So that** I can access the tools I need quickly

### Acceptance Criteria

#### 7.1 Home Page Layout
- App title: "The Multilingual Mandi"
- Tagline: "AI that speaks your market's language"
- Language selector dropdown (top-right)
- 6 feature cards in grid layout

#### 7.2 Feature Cards
- Each card shows:
  - Feature icon (emoji)
  - Feature title
  - Brief description
  - Click to navigate to feature
- Cards have artistic hand-drawn style borders
- Hover effects for interactivity

#### 7.3 Language Selector
- Dropdown with all 6 languages
- Shows language name in native script
- Selection persists across pages (localStorage)
- Changes all UI text immediately

#### 7.4 Background Images
- **Home Page**: indian_market_painting_1769918395003.png
- **Price Discovery**: indian_veg_pushcart_1769918988085.png
- **Negotiation**: flower.png
- **Speak with Vendor**: indian_art_background_1769918011194.png
- **Smart Calculator**: indian_village_market_tree_1769918608823.png
- **Signboard Translator**: indian_market_fruits_1769918574082.png
- **Vendor Rating**: indian_market_spices_1769918591343.png
- Background reverts to home image when leaving feature page

#### 7.5 Navigation
- "← Home" link on all feature pages
- Link styled with white background, black text, indigo border
- Large, readable font (1.3rem)
- Returns to home page on click

#### 7.6 Text Visibility
- All headings have black text with white glow effect
- Text shadow in 4 directions for maximum visibility
- Readable against busy background images
- Font sizes: Headings 2.5rem, Home link 1.3rem

---

## Technical Requirements

### Frontend
- **Framework**: Next.js 16.1.6 (App Router)
- **Language**: JavaScript/React
- **Styling**: CSS with custom variables
- **State Management**: React hooks (useState, useEffect, useContext)
- **Libraries**:
  - react-simple-keyboard: Virtual keyboards for Indian languages

### Backend (API Routes)
- **Price Discovery API**: `/api/price-discovery`
- **Negotiation API**: `/api/negotiation`
- **Signboard Translate API**: `/api/signboard-translate`
- All APIs use POST method with JSON payloads

### AWS Services
- **AWS Translate**: Text translation between 6 languages
- **AWS Polly**: Text-to-speech (Voice ID: Aditi for Hindi/English)
- **AWS Rekognition**: OCR for signboard images
- **AWS Bedrock**: AI-powered price estimates and negotiation advice
  - Model: amazon.titan-text-lite-v1 (price discovery)
  - Model: amazon.titan-text-premier-v1:0 (negotiation)

### External APIs
- **data.gov.in Agmarknet API**:
  - Resource ID: 9ef84268-d588-465a-a308-a864a43d0070
  - Provides real market prices for agricultural commodities
  - Prices in rupees per quintal (must convert to per kg)

### Environment Variables
```
NEXT_PUBLIC_AWS_ACCESS_KEY_ID=<aws_access_key>
NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY=<aws_secret_key>
NEXT_PUBLIC_AWS_REGION=ap-south-1
AGMARKNET_API_KEY=<data_gov_in_api_key>
```

### Browser APIs
- **Web Speech API**: Speech recognition (English, Hindi)
- **MediaDevices API**: Camera access for signboard photos
- **localStorage**: Persist language preference

---

## Design Requirements

### Color Palette
- **Saffron**: #FF9933 (primary accent)
- **Turmeric**: #FFD700 (secondary accent)
- **Turmeric Light**: #FFF8DC (backgrounds)
- **Indigo**: #4B0082 (buttons, links)
- **Green**: #138808 (success, positive)
- **Earth**: #8B4513 (text, borders)
- **Cream**: #FFFDD0 (card backgrounds)

### Typography
- **Headings**: 2.5rem, bold, black with white glow
- **Body Text**: 1rem, readable
- **Buttons**: 1.1rem, bold
- **Home Link**: 1.3rem, bold

### Visual Style
- Hand-drawn artistic borders on cards
- Soft shadows for depth
- Rounded corners (8px)
- Responsive design for mobile and desktop

---

## Success Metrics

### User Engagement
- 80% of users try at least 2 features
- Average session duration > 5 minutes
- 60% of users return within 7 days

### Feature Usage
- Price Discovery: 90% of users check prices
- Negotiation: 50% of users get negotiation advice
- Calculator: 40% of vendors use calculator
- Speak with Vendor: 30% of users try translation
- Signboard Translator: 20% of users scan signboards
- Vendor Rating: 15% of users view ratings

### Language Distribution
- Hindi: 40% of users
- English: 25% of users
- Telugu: 15% of users
- Tamil: 10% of users
- Kannada: 7% of users
- Malayalam: 3% of users

### Performance
- Page load time < 2 seconds
- API response time < 1 second
- Translation time < 500ms
- Voice output latency < 1 second

---

## Out of Scope (Future Enhancements)

### Phase 2 Features
- User authentication and profiles
- Real-time chat between users
- Product catalog with images
- Order management system
- Payment integration
- Location-based vendor discovery
- Push notifications
- Offline mode

### Technical Improvements
- Database integration (PostgreSQL/MongoDB)
- Real-time updates (WebSockets)
- Advanced analytics dashboard
- A/B testing framework
- Performance monitoring
- Automated testing suite
- CI/CD pipeline
- Multi-currency support

---

## Risks & Mitigations

### Technical Risks
- **Risk**: AWS service costs may be high with many users
  - **Mitigation**: Implement caching, rate limiting, optimize API calls
- **Risk**: Agmarknet API may be unreliable or slow
  - **Mitigation**: AI fallback, caching, timeout handling
- **Risk**: Speech recognition limited to English/Hindi
  - **Mitigation**: Provide text input fallback, virtual keyboards

### User Experience Risks
- **Risk**: Users may not trust AI-generated prices
  - **Mitigation**: Clear data source badges, show real data when available
- **Risk**: Regional language voice output may sound unnatural
  - **Mitigation**: Use Hindi voice fallback, focus on text display
- **Risk**: Camera quality may affect OCR accuracy
  - **Mitigation**: Provide guidance for better photos, manual text input option

### Business Risks
- **Risk**: Vendors may resist technology adoption
  - **Mitigation**: Simple UI, voice-first design, offline support (future)
- **Risk**: Fake ratings may undermine trust system
  - **Mitigation**: Verification process, report abuse feature (future)
