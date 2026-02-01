
"use client";
import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/language-context';
import { VoiceService } from '@/lib/aws-services';
import Link from 'next/link';

export default function Negotiation() {
    const { language, setLanguage } = useLanguage();
    const [mode, setMode] = useState('vendor'); // 'vendor' or 'buyer'
    const [commodity, setCommodity] = useState('tomato');
    const [vendorPrice, setVendorPrice] = useState('');
    const [buyerOffer, setBuyerOffer] = useState('');
    const [marketPrice, setMarketPrice] = useState('');
    const [negotiationResult, setNegotiationResult] = useState(null);
    const [loading, setLoading] = useState(false);

    // Set background image for this page
    useEffect(() => {
        document.body.style.backgroundImage = "url('/flower.png')";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundAttachment = "fixed";
        document.body.style.backgroundPosition = "center";
        return () => {
            document.body.style.backgroundImage = "url('/indian_market_painting_1769918395003.png')";
        };
    }, []);

    const handleNegotiate = async () => {
        if (!vendorPrice || !buyerOffer) {
            alert('Please enter both vendor price and buyer offer');
            return;
        }

        setLoading(true);
        
        try {
            const response = await fetch('/api/negotiation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    mode,
                    commodity,
                    vendorPrice: parseFloat(vendorPrice),
                    buyerOffer: parseFloat(buyerOffer),
                    marketPrice: marketPrice ? parseFloat(marketPrice) : null,
                    language
                })
            });

            if (!response.ok) {
                throw new Error('Negotiation failed');
            }

            const data = await response.json();
            setNegotiationResult(data);

            // Speak the negotiation sentence
            if (data.negotiationSentence) {
                const audioUrl = await VoiceService.speak(data.negotiationSentence, language);
                if (audioUrl) {
                    new Audio(audioUrl).play();
                }
            }
        } catch (error) {
            console.error('Negotiation error:', error);
            alert('Failed to get negotiation advice. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getText = (key) => {
        const texts = {
            title: {
                en: "Negotiation Assistant",
                hi: "बातचीत सहायक",
                te: "చర్చ సహాయకుడు",
                ta: "பேச்சுவார்த்தை உதவியாளர்",
                kn: "ಚರ್ಚೆ ಸಹಾಯಕ",
                ml: "ചർച്ച സഹായി"
            },
            commodity: {
                en: "Select Commodity",
                hi: "वस्तु चुनें",
                te: "వస్తువును ఎంచుకోండి",
                ta: "பொருளைத் தேர்ந்தெடுக்கவும்",
                kn: "ಸರಕು ಆಯ್ಕೆಮಾಡಿ",
                ml: "ചരക്ക് തിരഞ്ഞെടുക്കുക"
            },
            vendorPrice: {
                en: "Your Asking Price (₹/kg)",
                hi: "आपका मांगा गया भाव (₹/किलो)",
                te: "మీ అడిగే ధర (₹/కిలో)",
                ta: "உங்கள் கேட்கும் விலை (₹/கிலோ)",
                kn: "ನಿಮ್ಮ ಕೇಳುವ ಬೆಲೆ (₹/ಕೆಜಿ)",
                ml: "നിങ്ങളുടെ ചോദിക്കുന്ന വില (₹/കിലോ)"
            },
            buyerOffer: {
                en: "Buyer's Offer (₹/kg)",
                hi: "खरीदार का प्रस्ताव (₹/किलो)",
                te: "కొనుగోలుదారు ఆఫర్ (₹/కిలో)",
                ta: "வாங்குபவரின் சலுகை (₹/கிலோ)",
                kn: "ಖರೀದಿದಾರರ ಆಫರ್ (₹/ಕೆಜಿ)",
                ml: "വാങ്ങുന്നയാളുടെ ഓഫർ (₹/കിലോ)"
            },
            marketPrice: {
                en: "Market Average (₹/kg) - Optional",
                hi: "बाजार औसत (₹/किलो) - वैकल्पिक",
                te: "మార్కెట్ సగటు (₹/కిలో) - ఐచ్ఛికం",
                ta: "சந்தை சராசரி (₹/கிலோ) - விருப்பமானது",
                kn: "ಮಾರುಕಟ್ಟೆ ಸರಾಸರಿ (₹/ಕೆಜಿ) - ಐಚ್ಛಿಕ",
                ml: "വിപണി ശരാശരി (₹/കിലോ) - ഓപ്ഷണൽ"
            },
            getNegotiationAdvice: {
                en: "Get Negotiation Advice",
                hi: "बातचीत सलाह प्राप्त करें",
                te: "చర్చ సలహా పొందండి",
                ta: "பேச்சுவார்த்தை ஆலோசனை பெறுங்கள்",
                kn: "ಚರ್ಚೆ ಸಲಹೆ ಪಡೆಯಿರಿ",
                ml: "ചർച്ച ഉപദേശം നേടുക"
            },
            mode: {
                en: "I am a:",
                hi: "मैं हूं:",
                te: "నేను:",
                ta: "நான்:",
                kn: "ನಾನು:",
                ml: "ഞാൻ:"
            },
            vendor: {
                en: "Vendor (Seller)",
                hi: "विक्रेता (बेचने वाला)",
                te: "విక్రేత (అమ్మేవాడు)",
                ta: "விற்பனையாளர்",
                kn: "ಮಾರಾಟಗಾರ",
                ml: "വിൽപ്പനക്കാരൻ"
            },
            buyer: {
                en: "Buyer (Customer)",
                hi: "खरीदार (ग्राहक)",
                te: "కొనుగోలుదారు (కస్టమర్)",
                ta: "வாங்குபவர் (வாடிக்கையாளர்)",
                kn: "ಖರೀದಿದಾರ (ಗ್ರಾಹಕ)",
                ml: "വാങ്ങുന്നയാൾ (ഉപഭോക്താവ്)"
            },
            fairnessAssessment: {
                en: "Fairness Assessment",
                hi: "निष्पक्षता मूल्यांकन",
                te: "న్యాయ అంచనా",
                ta: "நியாய மதிப்பீடு",
                kn: "ನ್ಯಾಯ ಮೌಲ್ಯಮಾಪನ",
                ml: "നീതി വിലയിരുത്തൽ"
            },
            suggestedCounter: {
                en: "Suggested Counter-Offer",
                hi: "सुझाया गया जवाबी प्रस्ताव",
                te: "సూచించిన ప్రతి-ఆఫర్",
                ta: "பரிந்துரைக்கப்பட்ட எதிர் சலுகை",
                kn: "ಸೂಚಿಸಲಾದ ಪ್ರತಿ-ಆಫರ್",
                ml: "നിർദ്ദേശിച്ച എതിർ ഓഫർ"
            },
            whatToSay: {
                en: "What to Say",
                hi: "क्या कहें",
                te: "ఏమి చెప్పాలి",
                ta: "என்ன சொல்ல வேண்டும்",
                kn: "ಏನು ಹೇಳಬೇಕು",
                ml: "എന്ത് പറയണം"
            }
        };
        return texts[key]?.[language] || texts[key]?.en || key;
    };

    const speakTip = async (text) => {
        const audioUrl = await VoiceService.speak(text, language);
        if (audioUrl) {
            new Audio(audioUrl).play();
        }
    };

    const vendorTips = [
        { en: "Quality is excellent, worth the price", hi: "गुणवत्ता उत्कृष्ट है, कीमत के लायक है", te: "నాణ్యత అద్భుతమైనది, ధరకు విలువైనది", ta: "தரம் சிறந்தது, விலைக்கு மதிப்பு", kn: "ಗುಣಮಟ್ಟ ಅತ್ಯುತ್ತಮವಾಗಿದೆ, ಬೆಲೆಗೆ ಯೋಗ್ಯವಾಗಿದೆ", ml: "ഗുണനിലവാരം മികച്ചതാണ്, വിലയ്ക്ക് യോഗ്യം" },
        { en: "Fresh stock just arrived today", hi: "ताजा माल आज ही आया है", te: "తాజా స్టాక్ ఈరోజే వచ్చింది", ta: "புதிய பொருள் இன்று வந்தது", kn: "ತಾಜಾ ಸ್ಟಾಕ್ ಇಂದು ಬಂದಿದೆ", ml: "പുതിയ സ്റ്റോക്ക് ഇന്ന് വന്നു" },
        { en: "Market price is higher elsewhere", hi: "बाजार में कीमत और ज्यादा है", te: "మార్కెట్ ధర ఇతర చోట్ల ఎక్కువ", ta: "சந்தை விலை வேறு இடங்களில் அதிகம்", kn: "ಮಾರುಕಟ್ಟೆ ಬೆಲೆ ಬೇರೆಡೆ ಹೆಚ್ಚು", ml: "മാർക്കറ്റ് വില മറ്റിടങ്ങളിൽ കൂടുതലാണ്" },
        { en: "I can give small discount for bulk", hi: "थोक में थोड़ी छूट दे सकता हूं", te: "బల్క్‌కు చిన్న డిస్కౌంట్ ఇవ్వగలను", ta: "மொத்தமாக வாங்கினால் சிறிய தள்ளுபடி தரலாம்", kn: "ಬೃಹತ್ ಪ್ರಮಾಣಕ್ಕೆ ಸಣ್ಣ ರಿಯಾಯಿತಿ ನೀಡಬಹುದು", ml: "ബൾക്കിന് ചെറിയ കിഴിവ് നൽകാം" },
        { en: "This is my best price", hi: "यह मेरा सबसे अच्छा भाव है", te: "ఇది నా ఉత్తమ ధర", ta: "இது என் சிறந்த விலை", kn: "ಇದು ನನ್ನ ಅತ್ಯುತ್ತಮ ಬೆಲೆ", ml: "ഇത് എന്റെ മികച്ച വില" },
        { en: "I brought this from farm directly", hi: "मैं यह खेत से सीधे लाया हूं", te: "నేను దీన్ని నేరుగా పొలం నుండి తెచ్చాను", ta: "நான் இதை நேரடியாக பண்ணையிலிருந்து கொண்டு வந்தேன்", kn: "ನಾನು ಇದನ್ನು ನೇರವಾಗಿ ಹೊಲದಿಂದ ತಂದಿದ್ದೇನೆ", ml: "ഞാൻ ഇത് നേരിട്ട് കൃഷിയിടത്തിൽ നിന്ന് കൊണ്ടുവന്നു" },
        { en: "No middleman, direct from source", hi: "कोई बिचौलिया नहीं, सीधे स्रोत से", te: "మధ్యవర్తి లేదు, నేరుగా మూలం నుండి", ta: "இடைத்தரகர் இல்லை, நேரடியாக மூலத்திலிருந்து", kn: "ಯಾವುದೇ ಮಧ್ಯವರ್ತಿ ಇಲ್ಲ, ನೇರವಾಗಿ ಮೂಲದಿಂದ", ml: "ഇടനിലക്കാരനില്ല, നേരിട്ട് ഉറവിടത്തിൽ നിന്ന്" },
        { en: "I have been selling here for years", hi: "मैं यहां सालों से बेच रहा हूं", te: "నేను ఇక్కడ సంవత్సరాలుగా అమ్ముతున్నాను", ta: "நான் இங்கே பல ஆண்டுகளாக விற்று வருகிறேன்", kn: "ನಾನು ಇಲ್ಲಿ ವರ್ಷಗಳಿಂದ ಮಾರಾಟ ಮಾಡುತ್ತಿದ್ದೇನೆ", ml: "ഞാൻ ഇവിടെ വർഷങ്ങളായി വിൽക്കുന്നു" },
        { en: "Check the quality yourself", hi: "गुणवत्ता खुद देख लीजिए", te: "నాణ్యతను మీరే తనిఖీ చేయండి", ta: "தரத்தை நீங்களே சரிபார்க்கவும்", kn: "ಗುಣಮಟ್ಟವನ್ನು ನೀವೇ ಪರಿಶೀಲಿಸಿ", ml: "ഗുണനിലവാരം നിങ്ങൾ തന്നെ പരിശോധിക്കൂ" },
        { en: "My customers always come back", hi: "मेरे ग्राहक हमेशा वापस आते हैं", te: "నా కస్టమర్లు ఎల్లప్పుడూ తిరిగి వస్తారు", ta: "என் வாடிக்கையாளர்கள் எப்போதும் திரும்பி வருவார்கள்", kn: "ನನ್ನ ಗ್ರಾಹಕರು ಯಾವಾಗಲೂ ಹಿಂತಿರುಗುತ್ತಾರೆ", ml: "എന്റെ ഉപഭോക്താക്കൾ എപ്പോഴും തിരിച്ചുവരുന്നു" }
    ];

    const buyerTips = [
        { en: "Market rate is lower than this", hi: "बाजार भाव इससे कम है", te: "మార్కెట్ రేటు దీని కంటే తక్కువ", ta: "சந்தை விலை இதை விட குறைவு", kn: "ಮಾರುಕಟ್ಟೆ ದರ ಇದಕ್ಕಿಂತ ಕಡಿಮೆ", ml: "മാർക്കറ്റ് നിരക്ക് ഇതിനേക്കാൾ കുറവാണ്" },
        { en: "I am a regular customer", hi: "मैं नियमित ग्राहक हूं", te: "నేను రెగ్యులర్ కస్టమర్‌ని", ta: "நான் வழக்கமான வாடிக்கையாளர்", kn: "ನಾನು ನಿಯಮಿತ ಗ್ರಾಹಕ", ml: "ഞാൻ സ്ഥിരം ഉപഭോക്താവാണ്" },
        { en: "Can you reduce a little?", hi: "थोड़ा कम कर सकते हैं?", te: "కొంచెం తగ్గించగలరా?", ta: "கொஞ்சம் குறைக்க முடியுமா?", kn: "ಸ್ವಲ್ಪ ಕಡಿಮೆ ಮಾಡಬಹುದೇ?", ml: "കുറച്ച് കുറയ്ക്കാമോ?" },
        { en: "I will buy more if price is good", hi: "अच्छा भाव हो तो ज्यादा लूंगा", te: "ధర బాగుంటే ఎక్కువ కొంటాను", ta: "விலை நன்றாக இருந்தால் அதிகம் வாங்குவேன்", kn: "ಬೆಲೆ ಚೆನ್ನಾಗಿದ್ದರೆ ಹೆಚ್ಚು ಖರೀದಿಸುತ್ತೇನೆ", ml: "വില നല്ലതാണെങ്കിൽ കൂടുതൽ വാങ്ങും" },
        { en: "Other vendors are cheaper", hi: "दूसरे दुकानदार सस्ते हैं", te: "ఇతర విక్రేతలు చౌకగా ఉన్నారు", ta: "மற்ற விற்பனையாளர்கள் மலிவானவர்கள்", kn: "ಇತರ ಮಾರಾಟಗಾರರು ಅಗ್ಗವಾಗಿದ್ದಾರೆ", ml: "മറ്റ് വിൽപ്പനക്കാർ വിലകുറഞ്ഞവരാണ്" },
        { en: "I buy in bulk every week", hi: "मैं हर हफ्ते थोक में खरीदता हूं", te: "నేను ప్రతి వారం బల్క్‌లో కొంటాను", ta: "நான் ஒவ்வொரு வாரமும் மொத்தமாக வாங்குகிறேன்", kn: "ನಾನು ಪ್ರತಿ ವಾರ ಬೃಹತ್ ಪ್ರಮಾಣದಲ್ಲಿ ಖರೀದಿಸುತ್ತೇನೆ", ml: "ഞാൻ എല്ലാ ആഴ്ചയും ബൾക്കിൽ വാങ്ങുന്നു" },
        { en: "Quality doesn't look that fresh", hi: "गुणवत्ता इतनी ताजी नहीं लग रही", te: "నాణ్యత అంత తాజాగా కనిపించడం లేదు", ta: "தரம் அவ்வளவு புதியதாக தெரியவில்லை", kn: "ಗುಣಮಟ್ಟ ಅಷ್ಟು ತಾಜಾವಾಗಿ ಕಾಣುತ್ತಿಲ್ಲ", ml: "ഗുണനിലവാരം അത്ര പുതിയതായി തോന്നുന്നില്ല" },
        { en: "Last time you gave better price", hi: "पिछली बार आपने बेहतर भाव दिया था", te: "చివరిసారి మీరు మంచి ధర ఇచ్చారు", ta: "கடைசி முறை நீங்கள் சிறந்த விலை கொடுத்தீர்கள்", kn: "ಕೊನೆಯ ಬಾರಿ ನೀವು ಉತ್ತಮ ಬೆಲೆ ನೀಡಿದ್ದೀರಿ", ml: "കഴിഞ്ഞ തവണ നിങ്ങൾ മികച്ച വില നൽകി" },
        { en: "I need it for my shop", hi: "मुझे अपनी दुकान के लिए चाहिए", te: "నాకు నా దుకాణం కోసం కావాలి", ta: "எனக்கு என் கடைக்கு வேண்டும்", kn: "ನನಗೆ ನನ್ನ ಅಂಗಡಿಗೆ ಬೇಕು", ml: "എനിക്ക് എന്റെ കടയ്ക്ക് വേണം" },
        { en: "Can we settle on a fair price?", hi: "क्या हम उचित भाव पर तय कर सकते हैं?", te: "మనం న్యాయమైన ధరపై సెటిల్ చేయగలమా?", ta: "நியாயமான விலையில் தீர்வு காணலாமா?", kn: "ನಾವು ನ್ಯಾಯಯುತ ಬೆಲೆಯಲ್ಲಿ ಇತ್ಯರ್ಥಗೊಳಿಸಬಹುದೇ?", ml: "നമുക്ക് ന്യായമായ വിലയിൽ തീർപ്പാക്കാമോ?" }
    ];

    return (
        <div className="p-4" style={{ display: 'flex', gap: '20px', maxWidth: '1400px', margin: '0 auto' }}>
            {/* Left Side - Negotiation Tips */}
            <div style={{ flex: '0 0 280px', paddingTop: '60px' }}>
                <h3 style={{ 
                    marginBottom: '15px', 
                    fontSize: '1.3rem', 
                    color: '#000000',
                    fontWeight: 'bold',
                    textShadow: '2px 2px 6px rgba(255, 255, 255, 0.9), -2px -2px 6px rgba(255, 255, 255, 0.9), 2px -2px 6px rgba(255, 255, 255, 0.9), -2px 2px 6px rgba(255, 255, 255, 0.9)'
                }}>
                    {mode === 'vendor' ? '🏪 Vendor Tips' : '🛒 Buyer Tips'}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {(mode === 'vendor' ? vendorTips : buyerTips).map((tip, index) => (
                        <button
                            key={index}
                            onClick={() => speakTip(tip[language])}
                            className="btn-paint"
                            style={{
                                padding: '12px',
                                fontSize: '0.9rem',
                                textAlign: 'left',
                                background: 'var(--color-cream)',
                                color: 'var(--color-earth)',
                                border: '2px solid var(--color-earth)',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.background = 'var(--color-turmeric-light)';
                                e.target.style.transform = 'translateX(5px)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.background = 'var(--color-cream)';
                                e.target.style.transform = 'translateX(0)';
                            }}
                        >
                            🔊 {tip[language]}
                        </button>
                    ))}
                </div>
            </div>

            {/* Center - Main Form */}
            <div style={{ flex: '1', maxWidth: '600px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <Link href="/" style={{ 
                        color: '#000000',
                        textDecoration: 'none',
                        fontSize: '1.3rem',
                        fontWeight: 'bold',
                        background: 'rgba(255, 255, 255, 0.9)',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        border: '2px solid var(--color-indigo)',
                        textShadow: 'none'
                    }}>← Home</Link>
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        style={{
                            padding: '5px',
                            fontSize: '0.9rem',
                            border: '2px solid var(--color-earth)',
                            borderRadius: '5px',
                            background: 'var(--color-cream)'
                        }}
                    >
                        <option value="en">English</option>
                        <option value="hi">हिंदी</option>
                        <option value="te">తెలుగు</option>
                        <option value="ta">தமிழ்</option>
                        <option value="kn">ಕನ್ನಡ</option>
                        <option value="ml">മലയാളം</option>
                    </select>
                </div>

                <h2 style={{ 
                    marginTop: '10px', 
                    textAlign: 'center', 
                    marginBottom: '20px',
                    fontSize: '2.5rem',
                    color: '#000000',
                    fontWeight: 'bold',
                    textShadow: '2px 2px 8px rgba(255, 255, 255, 0.9), -2px -2px 8px rgba(255, 255, 255, 0.9), 2px -2px 8px rgba(255, 255, 255, 0.9), -2px 2px 8px rgba(255, 255, 255, 0.9)'
                }}>{getText('title')}</h2>

            {/* Mode Toggle */}
            <div style={{ marginBottom: '15px' }}>
                <div style={{ textAlign: 'center', marginBottom: '10px', fontSize: '0.9rem', fontWeight: 'bold' }}>
                    {getText('mode')}
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={() => {
                            setMode('vendor');
                            setNegotiationResult(null);
                        }}
                        className="btn-paint"
                        style={{
                            flex: 1,
                            background: mode === 'vendor' ? 'var(--color-saffron)' : 'var(--color-earth)',
                            color: 'white',
                            padding: '12px'
                        }}
                    >
                        🏪 {getText('vendor')}
                    </button>
                    <button
                        onClick={() => {
                            setMode('buyer');
                            setNegotiationResult(null);
                        }}
                        className="btn-paint"
                        style={{
                            flex: 1,
                            background: mode === 'buyer' ? 'var(--color-indigo)' : 'var(--color-earth)',
                            color: 'white',
                            padding: '12px'
                        }}
                    >
                        🛒 {getText('buyer')}
                    </button>
                </div>
            </div>

            <div className="artistic-card">
                {/* Commodity Selection */}
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                        {getText('commodity')}
                    </label>
                    <select
                        value={commodity}
                        onChange={(e) => setCommodity(e.target.value)}
                        style={{ width: '100%', padding: '12px', fontSize: '1rem', borderRadius: '8px' }}
                    >
                        <optgroup label="🥬 Vegetables">
                            <option value="tomato">🍅 Tomato</option>
                            <option value="onion">🧅 Onion</option>
                            <option value="potato">🥔 Potato</option>
                            <option value="carrot">🥕 Carrot</option>
                            <option value="cabbage">🥬 Cabbage</option>
                            <option value="cauliflower">🥦 Cauliflower</option>
                            <option value="brinjal">🍆 Brinjal</option>
                            <option value="ladyfinger">🌱 Lady Finger</option>
                            <option value="capsicum">🫑 Capsicum</option>
                            <option value="cucumber">🥒 Cucumber</option>
                            <option value="pumpkin">🎃 Pumpkin</option>
                            <option value="beetroot">🥕 Beetroot</option>
                            <option value="radish">🥕 Radish</option>
                            <option value="beans">🫘 Beans</option>
                            <option value="peas">🫛 Peas</option>
                            <option value="spinach">🥬 Spinach</option>
                            <option value="coriander">🌿 Coriander Leaves</option>
                            <option value="ginger">🫚 Ginger</option>
                            <option value="garlic">🧄 Garlic</option>
                            <option value="greenchilli">🌶️ Green Chilli</option>
                        </optgroup>
                        <optgroup label="🍎 Fruits">
                            <option value="apple">🍎 Apple</option>
                            <option value="banana">🍌 Banana</option>
                            <option value="mango">🥭 Mango</option>
                            <option value="orange">🍊 Orange</option>
                            <option value="grapes">🍇 Grapes</option>
                            <option value="pomegranate">🍎 Pomegranate</option>
                            <option value="papaya">🍈 Papaya</option>
                            <option value="watermelon">🍉 Watermelon</option>
                            <option value="pineapple">🍍 Pineapple</option>
                            <option value="guava">🍐 Guava</option>
                            <option value="lemon">🍋 Lemon</option>
                        </optgroup>
                        <optgroup label="🌾 Grains & Pulses">
                            <option value="rice">🍚 Rice</option>
                            <option value="wheat">🌾 Wheat</option>
                            <option value="maize">🌽 Maize</option>
                            <option value="bajra">🌾 Bajra</option>
                            <option value="jowar">🌾 Jowar</option>
                            <option value="ragi">🌾 Ragi</option>
                            <option value="tur">🫘 Tur Dal</option>
                            <option value="moong">🫘 Moong Dal</option>
                            <option value="urad">🫘 Urad Dal</option>
                            <option value="masoor">🫘 Masoor Dal</option>
                            <option value="chana">🫘 Chana/Gram</option>
                        </optgroup>
                        <optgroup label="🌶️ Spices & Others">
                            <option value="turmeric">🟡 Turmeric</option>
                            <option value="redchilli">🌶️ Red Chilli</option>
                            <option value="corianderseed">🌿 Coriander Seed</option>
                            <option value="cumin">🌿 Cumin Seed</option>
                            <option value="blackpepper">⚫ Black Pepper</option>
                            <option value="cardamom">🟢 Cardamom</option>
                            <option value="coconut">🥥 Coconut</option>
                            <option value="groundnut">🥜 Groundnut</option>
                            <option value="soyabean">🫘 Soyabean</option>
                            <option value="cotton">☁️ Cotton</option>
                            <option value="sugarcane">🎋 Sugarcane</option>
                        </optgroup>
                    </select>
                </div>

                {/* Vendor Price */}
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                        {getText('vendorPrice')}
                    </label>
                    <input
                        type="number"
                        value={vendorPrice}
                        onChange={(e) => setVendorPrice(e.target.value)}
                        placeholder="50"
                        style={{ width: '100%', padding: '12px', fontSize: '1rem', borderRadius: '8px', border: '2px solid var(--color-earth)' }}
                    />
                </div>

                {/* Buyer Offer */}
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                        {getText('buyerOffer')}
                    </label>
                    <input
                        type="number"
                        value={buyerOffer}
                        onChange={(e) => setBuyerOffer(e.target.value)}
                        placeholder="40"
                        style={{ width: '100%', padding: '12px', fontSize: '1rem', borderRadius: '8px', border: '2px solid var(--color-earth)' }}
                    />
                </div>

                {/* Market Price (Optional) */}
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                        {getText('marketPrice')}
                    </label>
                    <input
                        type="number"
                        value={marketPrice}
                        onChange={(e) => setMarketPrice(e.target.value)}
                        placeholder="45"
                        style={{ width: '100%', padding: '12px', fontSize: '1rem', borderRadius: '8px', border: '2px solid var(--color-earth)' }}
                    />
                </div>

                <button
                    onClick={handleNegotiate}
                    className="btn-paint"
                    disabled={loading}
                    style={{ width: '100%' }}
                >
                    {loading ? '...' : getText('getNegotiationAdvice')}
                </button>
            </div>

            {/* Negotiation Results */}
            {negotiationResult && (
                <div className="artistic-card mt-4" style={{ background: 'var(--color-cream)' }}>
                    {/* Fairness Assessment */}
                    <div style={{ marginBottom: '20px', padding: '15px', background: negotiationResult.fairnessColor, borderRadius: '8px' }}>
                        <h3 style={{ marginBottom: '10px' }}>{getText('fairnessAssessment')}</h3>
                        <p style={{ fontSize: '1rem', lineHeight: '1.5' }}>{negotiationResult.fairnessAssessment}</p>
                    </div>

                    {/* Suggested Counter-Offer */}
                    <div style={{ marginBottom: '20px', padding: '15px', background: 'var(--color-turmeric-light)', borderRadius: '8px' }}>
                        <h3 style={{ marginBottom: '10px', color: 'var(--color-green)' }}>{getText('suggestedCounter')}</h3>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-green)' }}>
                            ₹{negotiationResult.counterOffer}/kg
                        </p>
                    </div>

                    {/* What to Say */}
                    <div style={{ padding: '15px', background: '#e3f2fd', borderRadius: '8px' }}>
                        <h3 style={{ marginBottom: '10px', color: 'var(--color-indigo)' }}>{getText('whatToSay')}</h3>
                        <p style={{ fontSize: '1.1rem', lineHeight: '1.6', fontStyle: 'italic' }}>
                            "{negotiationResult.negotiationSentence}"
                        </p>
                    </div>
                </div>
            )}
        </div>

        {/* Right Side - More Tips */}
        <div style={{ flex: '0 0 280px', paddingTop: '60px' }}>
            <h3 style={{ 
                marginBottom: '15px', 
                fontSize: '1.3rem', 
                color: '#000000',
                fontWeight: 'bold',
                textShadow: '2px 2px 6px rgba(255, 255, 255, 0.9), -2px -2px 6px rgba(255, 255, 255, 0.9), 2px -2px 6px rgba(255, 255, 255, 0.9), -2px 2px 6px rgba(255, 255, 255, 0.9)'
            }}>
                💡 Quick Phrases
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {mode === 'vendor' ? (
                    <>
                        <button onClick={() => speakTip(language === 'en' ? 'Please understand my situation' : language === 'hi' ? 'कृपया मेरी स्थिति समझें' : language === 'te' ? 'దయచేసి నా పరిస్థితిని అర్థం చేసుకోండి' : language === 'ta' ? 'தயவுசெய்து என் நிலைமையைப் புரிந்து கொள்ளுங்கள்' : language === 'kn' ? 'ದಯವಿಟ್ಟು ನನ್ನ ಪರಿಸ್ಥಿತಿಯನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ' : 'ദയവായി എന്റെ സാഹചര്യം മനസ്സിലാക്കുക')} className="btn-paint" style={{ padding: '10px', fontSize: '0.85rem', background: '#e8f5e9', border: '2px solid var(--color-green)' }}>🙏 {language === 'en' ? 'Please understand' : language === 'hi' ? 'कृपया समझें' : language === 'te' ? 'దయచేసి అర్థం చేసుకోండి' : language === 'ta' ? 'தயவுசெய்து புரிந்து கொள்ளுங்கள்' : language === 'kn' ? 'ದಯವಿಟ್ಟು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ' : 'ദയവായി മനസ്സിലാക്കുക'}</button>
                        <button onClick={() => speakTip(language === 'en' ? 'I have family to feed' : language === 'hi' ? 'मुझे परिवार पालना है' : language === 'te' ? 'నాకు కుటుంబం పోషించాలి' : language === 'ta' ? 'எனக்கு குடும்பம் பராமரிக்க வேண்டும்' : language === 'kn' ? 'ನನಗೆ ಕುಟುಂಬವನ್ನು ಪೋಷಿಸಬೇಕು' : 'എനിക്ക് കുടുംബം പോറ്റണം')} className="btn-paint" style={{ padding: '10px', fontSize: '0.85rem', background: '#fff9c4', border: '2px solid var(--color-turmeric)' }}>👨‍👩‍👧 {language === 'en' ? 'Family to feed' : language === 'hi' ? 'परिवार पालना है' : language === 'te' ? 'కుటుంబం పోషించాలి' : language === 'ta' ? 'குடும்பம் பராமரிக்க' : language === 'kn' ? 'ಕುಟುಂಬ ಪೋಷಣೆ' : 'കുടുംബം പോറ്റണം'}</button>
                        <button onClick={() => speakTip(language === 'en' ? 'Let us meet halfway' : language === 'hi' ? 'बीच में मिलते हैं' : language === 'te' ? 'మధ్యలో కలుద్దాం' : language === 'ta' ? 'நடுவில் சந்திப்போம்' : language === 'kn' ? 'ಮಧ್ಯದಲ್ಲಿ ಭೇಟಿಯಾಗೋಣ' : 'നടുവിൽ കണ്ടുമുട്ടാം')} className="btn-paint" style={{ padding: '10px', fontSize: '0.85rem', background: '#e3f2fd', border: '2px solid var(--color-indigo)' }}>🤝 {language === 'en' ? 'Meet halfway' : language === 'hi' ? 'बीच में मिलें' : language === 'te' ? 'మధ్యలో కలుద్దాం' : language === 'ta' ? 'நடுவில் சந்திப்போம்' : language === 'kn' ? 'ಮಧ್ಯದಲ್ಲಿ ಭೇಟಿ' : 'നടുവിൽ കണ്ടുമുട്ടാം'}</button>
                        <button onClick={() => speakTip(language === 'en' ? 'Come back tomorrow for better price' : language === 'hi' ? 'कल आइए बेहतर भाव के लिए' : language === 'te' ? 'మంచి ధర కోసం రేపు రండి' : language === 'ta' ? 'நல்ல விலைக்கு நாளை வாருங்கள்' : language === 'kn' ? 'ಉತ್ತಮ ಬೆಲೆಗಾಗಿ ನಾಳೆ ಬನ್ನಿ' : 'നല്ല വിലയ്ക്ക് നാളെ വരൂ')} className="btn-paint" style={{ padding: '10px', fontSize: '0.85rem', background: '#fce4ec', border: '2px solid #e91e63' }}>📅 {language === 'en' ? 'Come tomorrow' : language === 'hi' ? 'कल आइए' : language === 'te' ? 'రేపు రండి' : language === 'ta' ? 'நாளை வாருங்கள்' : language === 'kn' ? 'ನಾಳೆ ಬನ್ನಿ' : 'നാളെ വരൂ'}</button>
                        <button onClick={() => speakTip(language === 'en' ? 'Thank you for understanding' : language === 'hi' ? 'समझने के लिए धन्यवाद' : language === 'te' ? 'అర్థం చేసుకున్నందుకు ధన్యవాదాలు' : language === 'ta' ? 'புரிந்து கொண்டதற்கு நன்றி' : language === 'kn' ? 'ಅರ್ಥಮಾಡಿಕೊಂಡಿದ್ದಕ್ಕಾಗಿ ಧನ್ಯವಾದಗಳು' : 'മനസ്സിലാക്കിയതിന് നന്ദി')} className="btn-paint" style={{ padding: '10px', fontSize: '0.85rem', background: '#f3e5f5', border: '2px solid #9c27b0' }}>🙏 {language === 'en' ? 'Thank you' : language === 'hi' ? 'धन्यवाद' : language === 'te' ? 'ధన్యవాదాలు' : language === 'ta' ? 'நன்றி' : language === 'kn' ? 'ಧನ್ಯವಾದಗಳು' : 'നന്ദി'}</button>
                    </>
                ) : (
                    <>
                        <button onClick={() => speakTip(language === 'en' ? 'I have limited budget' : language === 'hi' ? 'मेरा बजट सीमित है' : language === 'te' ? 'నా బడ్జెట్ పరిమితం' : language === 'ta' ? 'என் பட்ஜெட் குறைவு' : language === 'kn' ? 'ನನ್ನ ಬಜೆಟ್ ಸೀಮಿತವಾಗಿದೆ' : 'എന്റെ ബഡ്ജറ്റ് പരിമിതമാണ്')} className="btn-paint" style={{ padding: '10px', fontSize: '0.85rem', background: '#e8f5e9', border: '2px solid var(--color-green)' }}>💰 {language === 'en' ? 'Limited budget' : language === 'hi' ? 'सीमित बजट' : language === 'te' ? 'పరిమిత బడ్జెట్' : language === 'ta' ? 'குறைந்த பட்ஜெட்' : language === 'kn' ? 'ಸೀಮಿತ ಬಜೆಟ್' : 'പരിമിത ബഡ്ജറ്റ്'}</button>
                        <button onClick={() => speakTip(language === 'en' ? 'I will buy regularly if price is good' : language === 'hi' ? 'अच्छा भाव हो तो नियमित लूंगा' : language === 'te' ? 'ధర బాగుంటే రెగ్యులర్‌గా కొంటాను' : language === 'ta' ? 'விலை நன்றாக இருந்தால் தொடர்ந்து வாங்குவேன்' : language === 'kn' ? 'ಬೆಲೆ ಚೆನ್ನಾಗಿದ್ದರೆ ನಿಯಮಿತವಾಗಿ ಖರೀದಿಸುತ್ತೇನೆ' : 'വില നല്ലതാണെങ്കിൽ പതിവായി വാങ്ങും')} className="btn-paint" style={{ padding: '10px', fontSize: '0.85rem', background: '#fff9c4', border: '2px solid var(--color-turmeric)' }}>🔄 {language === 'en' ? 'Regular buyer' : language === 'hi' ? 'नियमित खरीदार' : language === 'te' ? 'రెగ్యులర్ కొనుగోలుదారు' : language === 'ta' ? 'வழக்கமான வாங்குபவர்' : language === 'kn' ? 'ನಿಯಮಿತ ಖರೀದಿದಾರ' : 'സ്ഥിരം വാങ്ങുന്നയാൾ'}</button>
                        <button onClick={() => speakTip(language === 'en' ? 'Can you give me your best price?' : language === 'hi' ? 'अपना सबसे अच्छा भाव बताइए?' : language === 'te' ? 'మీ ఉత్తమ ధర చెప్పగలరా?' : language === 'ta' ? 'உங்கள் சிறந்த விலையைச் சொல்ல முடியுமா?' : language === 'kn' ? 'ನಿಮ್ಮ ಅತ್ಯುತ್ತಮ ಬೆಲೆಯನ್ನು ಹೇಳಬಹುದೇ?' : 'നിങ്ങളുടെ മികച്ച വില പറയാമോ?')} className="btn-paint" style={{ padding: '10px', fontSize: '0.85rem', background: '#e3f2fd', border: '2px solid var(--color-indigo)' }}>💵 {language === 'en' ? 'Best price?' : language === 'hi' ? 'सबसे अच्छा भाव?' : language === 'te' ? 'ఉత్తమ ధర?' : language === 'ta' ? 'சிறந்த விலை?' : language === 'kn' ? 'ಅತ್ಯುತ್ತಮ ಬೆಲೆ?' : 'മികച്ച വില?'}</button>
                        <button onClick={() => speakTip(language === 'en' ? 'Let me check other shops' : language === 'hi' ? 'मुझे दूसरी दुकानें देखने दीजिए' : language === 'te' ? 'నేను ఇతర దుకాణాలు చూస్తాను' : language === 'ta' ? 'நான் மற்ற கடைகளைப் பார்க்கிறேன்' : language === 'kn' ? 'ನಾನು ಇತರ ಅಂಗಡಿಗಳನ್ನು ನೋಡುತ್ತೇನೆ' : 'ഞാൻ മറ്റ് കടകൾ നോക്കട്ടെ')} className="btn-paint" style={{ padding: '10px', fontSize: '0.85rem', background: '#fce4ec', border: '2px solid #e91e63' }}>🚶 {language === 'en' ? 'Check others' : language === 'hi' ? 'दूसरे देखूं' : language === 'te' ? 'ఇతరులను చూస్తాను' : language === 'ta' ? 'மற்றவற்றைப் பார்க்கிறேன்' : language === 'kn' ? 'ಇತರರನ್ನು ನೋಡುತ್ತೇನೆ' : 'മറ്റുള്ളവരെ നോക്കാം'}</button>
                        <button onClick={() => speakTip(language === 'en' ? 'Okay, I will take it' : language === 'hi' ? 'ठीक है, मैं ले लूंगा' : language === 'te' ? 'సరే, నేను తీసుకుంటాను' : language === 'ta' ? 'சரி, நான் எடுத்துக்கொள்கிறேன்' : language === 'kn' ? 'ಸರಿ, ನಾನು ತೆಗೆದುಕೊಳ್ಳುತ್ತೇನೆ' : 'ശരി, ഞാൻ എടുക്കാം')} className="btn-paint" style={{ padding: '10px', fontSize: '0.85rem', background: '#f3e5f5', border: '2px solid #9c27b0' }}>✅ {language === 'en' ? 'I will take it' : language === 'hi' ? 'ले लूंगा' : language === 'te' ? 'తీసుకుంటాను' : language === 'ta' ? 'எடுத்துக்கொள்கிறேன்' : language === 'kn' ? 'ತೆಗೆದುಕೊಳ್ಳುತ್ತೇನೆ' : 'എടുക്കാം'}</button>
                    </>
                )}
            </div>
        </div>
    </div>
    );
}
