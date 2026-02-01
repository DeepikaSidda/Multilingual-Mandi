# Multilingual Mandi - Implementation Tasks

## Project Status: ✅ COMPLETED

This document outlines the implementation tasks for the Multilingual Mandi project. All tasks have been completed and the application is fully functional.

---

## Phase 1: Project Setup & Core Infrastructure

### 1.1 Initial Setup
- [x] Create Next.js 16.1.6 project with App Router
- [x] Configure TypeScript and ESLint
- [x] Set up project structure (src/app, src/lib)
- [x] Create .gitignore and README.md
- [x] Initialize Git repository

### 1.2 Environment Configuration
- [x] Create .env.local file
- [x] Add AWS credentials (ACCESS_KEY_ID, SECRET_ACCESS_KEY, REGION)
- [x] Add Agmarknet API key (DATA_GOV_IN_API_KEY)
- [x] Configure environment variables for Next.js

### 1.3 AWS Services Setup
- [x] Install AWS SDK packages (@aws-sdk/client-translate, @aws-sdk/client-polly, @aws-sdk/client-rekognition, @aws-sdk/client-bedrock-runtime)
- [x] Create AWS service clients in src/lib/aws-services.js
- [x] Implement TranslationService wrapper
- [x] Implement VoiceService wrapper
- [x] Implement VisionService wrapper
- [x] Implement AiService wrapper
- [x] Test AWS service connectivity

### 1.4 Language Context
- [x] Create LanguageContext in src/lib/language-context.js
- [x] Implement LanguageProvider with useState and useEffect
- [x] Add localStorage persistence for language preference
- [x] Wrap app with LanguageProvider in layout.js
- [x] Export useLanguage hook for components

---

## Phase 2: UI/UX Foundation

### 2.1 Global Styling
- [x] Create src/app/globals.css with CSS variables
- [x] Define color palette (saffron, turmeric, indigo, green, earth, cream)
- [x] Create .artistic-card class with hand-drawn borders
- [x] Create .btn-paint class for buttons
- [x] Add text-shadow for visibility on backgrounds
- [x] Remove text-transform: uppercase from headings (fixes Telugu/Tamil display)

### 2.2 Layout & Navigation
- [x] Create root layout in src/app/layout.js
- [x] Add metadata (title, description)
- [x] Remove decorative border lines (saffron/green)
- [x] Ensure clean, minimal layout

### 2.3 Background Images
- [x] Add all background images to public/ folder
- [x] Set home page background (indian_market_painting_1769918395003.png)
- [x] Configure background styles (cover, fixed, center)

---

## Phase 3: Home Page

### 3.1 Home Page Layout
- [x] Create src/app/page.js
- [x] Add app title "The Multilingual Mandi"
- [x] Add tagline "AI that speaks your market's language"
- [x] Style title (3.5rem, black, white glow)
- [x] Style tagline (2rem, black, white glow)

### 3.2 Language Selector
- [x] Add language dropdown to home page (top-right)
- [x] Include all 6 languages with native scripts
- [x] Connect to language context
- [x] Style dropdown (cream background, earth border)

### 3.3 Feature Cards
- [x] Create 6 feature cards in grid layout
- [x] Add icons (emojis) for each feature
- [x] Add titles and descriptions
- [x] Implement getText() for multilingual content
- [x] Add navigation links to feature pages
- [x] Style cards with artistic borders and shadows
- [x] Add hover effects

---

## Phase 4: Price Discovery Feature

### 4.1 Frontend Implementation
- [x] Create src/app/features/price-discovery/page.js
- [x] Add commodity dropdown (60+ items in 4 categories)
- [x] Add location dropdown (70+ cities in 5 regions)
- [x] Add quantity input (numeric, min 1)
- [x] Add "Check Fair Price" button
- [x] Implement getText() for multilingual UI
- [x] Add language selector to page
- [x] Add "← Home" navigation link
- [x] Set feature-specific background image
- [x] Add cleanup to revert background on unmount

### 4.2 API Route Implementation
- [x] Create src/app/api/price-discovery/route.js
- [x] Implement getRealMarketData() for Agmarknet API
- [x] Map commodity names to Agmarknet format
- [x] Map locations to state names
- [x] Convert quintal prices to per kg (divide by 100)
- [x] Implement getAIPriceEstimate() using AWS Bedrock
- [x] Implement getMarketData() fallback with simulated data
- [x] Add location multipliers for regional variations

### 4.3 Smart Pricing Algorithm
- [x] Implement quantity-based discounts (5% for 50+ kg, 0% for 20-49 kg, +5% for <20 kg)
- [x] Implement trend-based adjustments (+3% rising, -2% falling)
- [x] Ensure suggested price stays within min-max range
- [x] Generate explanation text
- [x] Translate explanation using AWS Translate

### 4.4 Results Display
- [x] Display data source badge (Real Data, AI Estimate, Estimated)
- [x] Display average market price (₹/kg)
- [x] Display suggested fair price (₹/kg)
- [x] Display total price for quantity (quantity × price)
- [x] Display explanation in user's language
- [x] Add voice output using AWS Polly
- [x] Style results with color-coded backgrounds

---

## Phase 5: Negotiation Assistant Feature

### 5.1 Frontend Implementation
- [x] Create src/app/features/negotiation/page.js
- [x] Add mode toggle (Vendor/Buyer buttons)
- [x] Add commodity dropdown (same 60+ items)
- [x] Add vendor asking price input
- [x] Add buyer offer input
- [x] Add market average input (optional)
- [x] Add "Get Advice" button
- [x] Implement getText() for multilingual UI
- [x] Add language selector and home link
- [x] Set feature-specific background image

### 5.2 Negotiation Tips & Phrases
- [x] Add 10 vendor tips on left side
- [x] Add 10 buyer tips on left side
- [x] Add 5 vendor quick phrases on right side
- [x] Add 5 buyer quick phrases on right side
- [x] Make all tips/phrases clickable
- [x] Add voice output for tips/phrases
- [x] Style tips/phrases (1.3rem, black, white glow)

### 5.3 API Route Implementation
- [x] Create src/app/api/negotiation/route.js
- [x] Implement vendor mode logic
- [x] Implement buyer mode logic
- [x] Calculate fairness assessment
- [x] Calculate counter-offer (never worse than current offer)
- [x] Generate AI negotiation sentence using AWS Bedrock
- [x] Translate sentence using AWS Translate

### 5.4 Results Display
- [x] Display fairness assessment with color coding
- [x] Display counter-offer suggestion
- [x] Display negotiation sentence
- [x] Add voice output button
- [x] Style results with appropriate colors

---

## Phase 6: Speak with Vendor Feature

### 6.1 Frontend Implementation
- [x] Create src/app/features/speak-with-vendor/page.js
- [x] Add speaker mode toggle (User/Vendor buttons)
- [x] Add microphone button for speech input
- [x] Add text input field as fallback
- [x] Add keyboard toggle button (⌨️)
- [x] Implement chat message display
- [x] Style user messages (right, blue)
- [x] Style vendor messages (left, green)
- [x] Add language selector and home link
- [x] Set feature-specific background image

### 6.2 Speech Recognition
- [x] Implement Web Speech API integration
- [x] Support English (en-US) and Hindi (hi-IN)
- [x] Add visual feedback during recording
- [x] Handle speech recognition errors
- [x] Auto-fill text input with transcript

### 6.3 Virtual Keyboard
- [x] Install react-simple-keyboard package
- [x] Create keyboard layouts for Hindi
- [x] Create keyboard layouts for Telugu
- [x] Create keyboard layouts for Tamil
- [x] Create keyboard layouts for Kannada
- [x] Create keyboard layouts for Malayalam
- [x] Show keyboard only for non-English languages
- [x] Handle keyboard input and update text field

### 6.4 Translation & Chat
- [x] Implement message sending logic
- [x] Determine source/target languages based on speaker mode
- [x] Translate messages using AWS Translate
- [x] Store messages with original and translated text
- [x] Display conversation history
- [x] Add timestamps to messages

---

## Phase 7: Smart Calculator Feature

### 7.1 Frontend Implementation
- [x] Create src/app/features/calculator/page.js
- [x] Add item name input (optional)
- [x] Add quantity input with kg/grams toggle
- [x] Add price per kg input
- [x] Add quick calculation buttons (1kg, 5kg, 10kg, 500g)
- [x] Add microphone button for voice input
- [x] Implement getText() for multilingual UI
- [x] Add language selector and home link
- [x] Set feature-specific background image

### 7.2 Voice Command Parsing
- [x] Implement speech recognition
- [x] Parse patterns like "10 kilos at 28 rupees"
- [x] Extract quantity and price from transcript
- [x] Auto-fill input fields
- [x] Handle parsing errors gracefully

### 7.3 Calculation Logic
- [x] Calculate subtotal (quantity × price)
- [x] Determine discount percentage (2%, 5%, 10%)
- [x] Calculate discount amount
- [x] Calculate final amount
- [x] Display all values clearly

### 7.4 Shopping Cart
- [x] Implement cart state management
- [x] Add "Add to Cart" button
- [x] Display cart items with details
- [x] Calculate grand total
- [x] Add remove item functionality
- [x] Add clear cart functionality
- [x] Style cart with artistic borders

### 7.5 Voice Output
- [x] Add "Speak Total" button
- [x] Generate spoken text in user's language
- [x] Use AWS Polly for text-to-speech
- [x] Handle voice output errors

---

## Phase 8: Signboard Translator Feature

### 8.1 Frontend Implementation
- [x] Create src/app/features/camera/page.js
- [x] Add camera/file input button
- [x] Add image preview
- [x] Add "Translate" button
- [x] Implement getText() for multilingual UI
- [x] Add language selector and home link
- [x] Set feature-specific background image

### 8.2 Image Capture & Upload
- [x] Implement file input handler
- [x] Convert image to base64
- [x] Send image to API route
- [x] Handle large images
- [x] Add loading indicator

### 8.3 API Route Implementation
- [x] Create src/app/api/signboard-translate/route.js
- [x] Convert base64 to Buffer for AWS
- [x] Implement OCR using AWS Rekognition DetectText
- [x] Extract text blocks from image
- [x] Implement language detection using Unicode ranges
- [x] Translate text using AWS Translate
- [x] Return original and translated text

### 8.4 Results Display
- [x] Display original text (left, cream background)
- [x] Display translated text (right, blue background)
- [x] Show detected language
- [x] Add "Speak Translation" button
- [x] Implement voice output
- [x] Style side-by-side layout

---

## Phase 9: Vendor Rating Feature

### 9.1 Frontend Implementation
- [x] Create src/app/features/vendor-rating/page.js
- [x] Add mode toggle (View Vendors/Rate a Vendor)
- [x] Implement getText() for multilingual UI
- [x] Add language selector and home link
- [x] Set feature-specific background image

### 9.2 View Vendors Mode
- [x] Create mock vendor data (4 vendors)
- [x] Display vendor list with all details
- [x] Show vendor name, shop name, location
- [x] Show rating (⭐ out of 5)
- [x] Show total reviews count
- [x] Calculate and display trust badge
- [x] Show languages spoken
- [x] Show items sold
- [x] Show positive feedback percentage
- [x] Style vendor cards

### 9.3 Rate Vendor Mode
- [x] Add vendor selection dropdown
- [x] Add star rating selector (1-5 stars)
- [x] Add quick feedback checkboxes (Fair Price, Good Quality, Honest Dealing)
- [x] Add submit button
- [x] Implement rating submission logic
- [x] Show success message
- [x] Reset form after submission

### 9.4 Trust Badge Logic
- [x] Implement getTrustBadge() function
- [x] Top Rated: ≥4.7 rating, ≥150 reviews (🔵)
- [x] Trusted Vendor: ≥4.0 rating, ≥100 reviews (🟢)
- [x] New Vendor: <50 reviews (🟡)
- [x] Apply appropriate colors

---

## Phase 10: Testing & Bug Fixes

### 10.1 Language Support Testing
- [x] Test English UI and translations
- [x] Test Hindi UI and translations
- [x] Test Telugu UI and translations (fix uppercase issue)
- [x] Test Tamil UI and translations (fix uppercase issue)
- [x] Test Kannada UI and translations
- [x] Test Malayalam UI and translations
- [x] Verify language persistence across pages

### 10.2 Feature Testing
- [x] Test price discovery with real Agmarknet data
- [x] Test price discovery with AI estimates
- [x] Test price discovery with fallback data
- [x] Test negotiation in vendor mode
- [x] Test negotiation in buyer mode
- [x] Test speak with vendor translation
- [x] Test virtual keyboards for all languages
- [x] Test calculator voice input
- [x] Test calculator discounts
- [x] Test signboard OCR and translation
- [x] Test vendor rating submission

### 10.3 Bug Fixes
- [x] Fix Telugu/Tamil text display (remove text-transform: uppercase)
- [x] Fix total price display (show quantity × price)
- [x] Fix counter-offer logic (never worse than current offer)
- [x] Fix Agmarknet price conversion (quintal to kg)
- [x] Fix signboard image format (Uint8Array to Buffer)
- [x] Fix language not changing on home page
- [x] Fix background images not loading
- [x] Fix text visibility on busy backgrounds

### 10.4 UI/UX Improvements
- [x] Increase heading sizes (2.5rem)
- [x] Add white glow to all headings
- [x] Style home link (white bg, black text, 1.3rem)
- [x] Style vendor tips/phrases (1.3rem, white glow)
- [x] Add unique backgrounds for each feature
- [x] Ensure backgrounds revert on page exit

---

## Phase 11: Deployment & Documentation

### 11.1 Code Cleanup
- [x] Remove test files (test-aws-access.js, test-kannada-malayalam.js, etc.)
- [x] Remove documentation files (FIX-TELUGU-ISSUE.md)
- [x] Keep all production code and images
- [x] Verify .gitignore excludes .env.local

### 11.2 Git & GitHub
- [x] Initialize Git repository
- [x] Add all files to Git
- [x] Create initial commit
- [x] Push to GitHub (https://github.com/DeepikaSidda/Multilingual-Mandi.git)
- [x] Verify repository is accessible

### 11.3 Deployment Attempts
- [x] Try Vercel deployment (encountered output directory issue)
- [x] Create vercel.json configuration
- [x] Remove vercel.json (let Vercel auto-detect)
- [x] Build succeeds on Vercel
- [x] Create amplify.yml for AWS Amplify
- [x] Note: S3 + CloudFront won't work (needs server for API routes)

### 11.4 Documentation
- [x] Create comprehensive README.md
- [x] Document all 6 features
- [x] Add supported languages section
- [x] Add tech stack details
- [x] Add prerequisites
- [x] Add local development setup instructions
- [x] Add deployment instructions (Vercel, AWS Amplify)
- [x] Add project structure
- [x] Add design features
- [x] Add key implementation details

### 11.5 Kiro Documentation
- [x] Create .kiro/specs/multilingual-mandi/ folder
- [x] Create requirements.md (this file)
- [x] Create design.md (architecture and implementation details)
- [x] Create tasks.md (this file)
- [x] Document all features comprehensively
- [x] Include acceptance criteria
- [x] Include technical requirements

---

## Phase 12: Future Enhancements (Not Implemented)

### 12.1 User Authentication
- [ ] Implement JWT-based authentication
- [ ] Create user registration flow
- [ ] Create login/logout functionality
- [ ] Add password reset feature
- [ ] Create user profile pages
- [ ] Implement role-based access (buyer/vendor)

### 12.2 Database Integration
- [ ] Set up PostgreSQL or MongoDB
- [ ] Create database schema
- [ ] Implement user data persistence
- [ ] Store vendor ratings in database
- [ ] Store negotiation history
- [ ] Store price discovery queries

### 12.3 Real-time Features
- [ ] Implement WebSocket server
- [ ] Add real-time chat between users
- [ ] Add live price updates
- [ ] Add push notifications
- [ ] Add real-time vendor availability

### 12.4 Advanced Features
- [ ] Create product catalog with images
- [ ] Implement order management system
- [ ] Integrate payment gateway
- [ ] Add delivery tracking
- [ ] Implement vendor verification
- [ ] Create analytics dashboard
- [ ] Add SMS OTP for authentication
- [ ] Implement location-based vendor discovery

### 12.5 Offline Support
- [ ] Implement service workers
- [ ] Add IndexedDB for local storage
- [ ] Cache price data for offline access
- [ ] Sync data when online
- [ ] Add offline indicator

### 12.6 Testing & Quality
- [ ] Write unit tests for all components
- [ ] Write integration tests for API routes
- [ ] Write E2E tests for user flows
- [ ] Set up CI/CD pipeline
- [ ] Add code coverage reporting
- [ ] Implement automated testing

### 12.7 Performance & Monitoring
- [ ] Implement response caching
- [ ] Add CDN for static assets
- [ ] Set up error tracking (Sentry)
- [ ] Add analytics (Google Analytics)
- [ ] Implement rate limiting
- [ ] Add API monitoring
- [ ] Optimize bundle size
- [ ] Implement lazy loading

---

## Notes

### Completed Features
All 6 core features are fully implemented and functional:
1. ✅ Price Discovery (with real data, AI estimates, and fallback)
2. ✅ Negotiation Assistant (dual mode with tips and phrases)
3. ✅ Speak with Vendor (with virtual keyboards)
4. ✅ Smart Calculator (with voice input and cart)
5. ✅ Signboard Translator (with OCR and translation)
6. ✅ Vendor Rating (with trust badges)

### Known Limitations
- Voice recognition only works well for English and Hindi
- AWS Polly doesn't have native voices for Telugu, Tamil, Kannada, Malayalam (uses Hindi voice)
- Vendor ratings use mock data (no database yet)
- No user authentication (all features are public)
- No real-time updates (static data)

### Deployment Status
- Code pushed to GitHub: ✅
- Vercel build successful: ✅
- AWS Amplify ready: ✅ (amplify.yml created)
- Production URL: Pending user deployment

### Environment Requirements
- Node.js 18+
- AWS Account with Translate, Polly, Rekognition, Bedrock access
- data.gov.in API key for Agmarknet
- Modern browser with Web Speech API support

---

## Success Criteria

### All Criteria Met ✅
- [x] All 6 features implemented and working
- [x] All 6 languages supported with proper display
- [x] Real market data integration (Agmarknet API)
- [x] AI-powered features (AWS Bedrock)
- [x] Voice input/output (Web Speech API + AWS Polly)
- [x] OCR for signboards (AWS Rekognition)
- [x] Multilingual UI with language persistence
- [x] Unique backgrounds for each feature
- [x] Text visibility on all backgrounds
- [x] Responsive design for mobile and desktop
- [x] Comprehensive documentation (README + Kiro specs)
- [x] Code pushed to GitHub
- [x] Build successful on Vercel
- [x] Ready for production deployment

---

## Project Timeline

- **Week 1**: Project setup, AWS integration, language context
- **Week 2**: Home page, price discovery, negotiation assistant
- **Week 3**: Speak with vendor, smart calculator
- **Week 4**: Signboard translator, vendor rating
- **Week 5**: Testing, bug fixes, UI improvements
- **Week 6**: Documentation, deployment, final polish

**Total Duration**: 6 weeks  
**Status**: ✅ COMPLETED

---

## Maintenance Tasks

### Regular Maintenance
- [ ] Monitor AWS service costs
- [ ] Update Agmarknet API integration if API changes
- [ ] Update AWS SDK packages quarterly
- [ ] Review and update commodity/location lists
- [ ] Monitor error logs and fix issues
- [ ] Update documentation as needed

### Security Updates
- [ ] Rotate AWS credentials every 90 days
- [ ] Update dependencies for security patches
- [ ] Review and update .gitignore
- [ ] Audit API rate limits
- [ ] Review error messages for information leakage

---

## Contact & Support

**Project**: Multilingual Mandi  
**Repository**: https://github.com/DeepikaSidda/Multilingual-Mandi  
**Status**: Production Ready  
**Last Updated**: February 2026
