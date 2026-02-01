# 🏪 The Multilingual Mandi

**AI that speaks your market's language**

A Next.js-powered multilingual marketplace application designed to bridge language barriers in Indian markets. Built with AWS AI services to provide real-time translation, price discovery, negotiation assistance, and more.

![Multilingual Mandi](public/indian_market_painting_1769918395003.png)

---

## 🌟 Features

### 1. 💰 Price Discovery
- Get fair market prices for 60+ commodities
- Real-time data from data.gov.in Agmarknet API
- AI-powered price estimates using AWS Bedrock
- Covers 70+ cities across India
- Shows both per kg price and total price for quantity
- Data source badges (Real Data, AI Estimate, or Fallback)

### 2. 🤝 Negotiation Assistant
- Dual mode: Vendor & Buyer perspectives
- AI-powered negotiation advice
- Smart counter-offer suggestions
- 10 negotiation tips for vendors
- 10 negotiation tips for buyers
- 5 quick phrases for each mode
- Voice output for all tips and phrases
- Fairness assessment with color-coded indicators

### 3. 🗣️ Speak with Vendor
- Real-time bidirectional translation
- Speech-to-text input (English & Hindi)
- Virtual keyboard for Indian languages
- Chat-style conversation interface
- Supports all 6 languages

### 4. 🧮 Smart Calculator
- Voice input: "10 kilos at 28 rupees"
- Automatic bulk discounts (2%, 5%, 10%)
- Shopping cart with multiple items
- Weight units: kg and grams
- Quick calculation buttons (1kg, 5kg, 10kg, 500g)
- Voice output for totals

### 5. 📸 Signboard Translator
- Camera-based OCR using AWS Rekognition
- Automatic language detection
- Side-by-side original and translated text
- Preserves prices, numbers, and formatting
- Voice output for translations

### 6. ⭐ Vendor Rating & Trust Score
- Rate vendors after deals (1-5 stars)
- Quick feedback: Fair Price, Good Quality, Honest Dealing
- Trust badges: 🔵 Top Rated, 🟢 Trusted Vendor, 🟡 New Vendor
- View vendor ratings before negotiating
- See vendor's preferred language and items sold

---

## 🌐 Supported Languages

- 🇬🇧 English
- 🇮🇳 हिंदी (Hindi)
- 🇮🇳 తెలుగు (Telugu)
- 🇮🇳 தமிழ் (Tamil)
- 🇮🇳 ಕನ್ನಡ (Kannada)
- 🇮🇳 മലയാളം (Malayalam)

Language selection persists across all pages using localStorage.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16.1.6 (App Router)
- **Language**: JavaScript/React
- **Styling**: CSS with custom Indian-themed color palette
- **AI Services**: 
  - AWS Translate (multilingual translation)
  - AWS Polly (text-to-speech)
  - AWS Rekognition (OCR for signboards)
  - AWS Bedrock (AI-powered price estimates & negotiation)
- **APIs**: 
  - data.gov.in Agmarknet API (real market prices)
- **Libraries**:
  - react-simple-keyboard (virtual keyboards)
  - @aws-sdk/client-* (AWS service clients)

---

## 📋 Prerequisites

Before running this app, ensure you have:

1. **Node.js** (v18 or higher)
2. **npm** or **yarn**
3. **AWS Account** with the following services enabled:
   - AWS Translate
   - AWS Polly
   - AWS Rekognition
   - AWS Bedrock (with Titan models)
4. **AWS Credentials** (Access Key ID & Secret Access Key)
5. **Agmarknet API Key** from data.gov.in

---

## 🚀 Local Development Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/DeepikaSidda/Multilingual-Mandi.git
cd Multilingual-Mandi
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# AWS Credentials
NEXT_PUBLIC_AWS_ACCESS_KEY_ID=your_aws_access_key_id
NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
NEXT_PUBLIC_AWS_REGION=ap-south-1

# Agmarknet API Key
AGMARKNET_API_KEY=your_agmarknet_api_key
```

**Important**: Never commit `.env.local` to version control!

### Step 4: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Step 5: Build for Production (Optional)

```bash
npm run build
npm start
```

---

## 🌍 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables in Vercel dashboard
5. Deploy!

Your app will be live at: `your-app-name.vercel.app`

### Deploy to AWS Amplify

1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Click "New app" → "Host web app"
3. Connect your GitHub repository
4. Add environment variables
5. Deploy!

Your app will be live at: `your-app.amplifyapp.com`

### Deploy to Netlify

1. Go to [netlify.com](https://netlify.com)
2. Import your GitHub repository
3. Add environment variables
4. Deploy!

---

## 📁 Project Structure

```
Multilingual-Mandi/
├── public/                          # Static assets & background images
│   ├── indian_market_painting_*.png # Home page background
│   ├── flower.png                   # Negotiation page background
│   ├── indian_veg_pushcart_*.png   # Price Discovery background
│   └── ...
├── src/
│   ├── app/
│   │   ├── api/                    # API routes
│   │   │   ├── negotiation/        # Negotiation AI endpoint
│   │   │   ├── price-discovery/    # Price discovery endpoint
│   │   │   └── signboard-translate/# OCR & translation endpoint
│   │   ├── features/               # Feature pages
│   │   │   ├── calculator/         # Smart calculator
│   │   │   ├── camera/             # Signboard translator
│   │   │   ├── negotiation/        # Negotiation assistant
│   │   │   ├── price-discovery/    # Price discovery
│   │   │   ├── speak-with-vendor/  # Real-time translation
│   │   │   └── vendor-rating/      # Vendor rating system
│   │   ├── globals.css             # Global styles
│   │   ├── layout.js               # Root layout
│   │   └── page.js                 # Home page
│   └── lib/
│       ├── aws-services.js         # AWS service wrappers
│       └── language-context.js     # Language state management
├── .env.local                      # Environment variables (not in repo)
├── .gitignore
├── amplify.yml                     # AWS Amplify config
├── next.config.ts                  # Next.js configuration
├── package.json
└── README.md
```

---

## 🎨 Design Features

- **Indian-themed color palette**: Saffron, turmeric, indigo, green
- **Unique backgrounds** for each feature page
- **Text visibility**: White glow effect on headings for readability
- **Responsive design**: Works on mobile and desktop
- **Artistic cards**: Hand-drawn style borders and shadows

---

## 🔑 Key Features Implementation

### Real-time Translation
Uses AWS Translate API to convert text between 6 Indian languages instantly.

### Voice Input/Output
- Speech recognition for English and Hindi
- AWS Polly for text-to-speech in all languages

### Price Discovery
- Fetches real data from Agmarknet API
- Falls back to AI estimates using AWS Bedrock
- Converts quintal prices to per kg prices

### OCR Translation
- AWS Rekognition extracts text from images
- Automatic language detection using Unicode ranges
- AWS Translate converts to user's language

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is open source and available under the MIT License.

---

## 👥 Author

**Deepika Sidda**
- GitHub: [@DeepikaSidda](https://github.com/DeepikaSidda)

---

## 🙏 Acknowledgments

- AWS for AI/ML services
- data.gov.in for Agmarknet API
- Next.js team for the amazing framework
- Indian market vendors for inspiration

---

## 📞 Support

For issues or questions, please open an issue on GitHub or contact the maintainer.

---

**Made with ❤️ for Indian markets**
