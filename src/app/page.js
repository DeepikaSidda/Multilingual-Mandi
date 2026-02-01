
"use client";
import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';

export default function Home() {
    const { t, language, setLanguage } = useLanguage();

    const getText = (key) => {
        const texts = {
            title: {
                en: "The Multilingual Mandi",
                hi: "बहुभाषी मंडी",
                te: "బహుభాషా మార్కెట్",
                ta: "பன்மொழி சந்தை",
                kn: "ಬಹುಭಾಷಾ ಮಾರುಕಟ್ಟೆ",
                ml: "ബഹുഭാഷാ മാർക്കറ്റ്"
            },
            tagline: {
                en: "AI that speaks your market's language",
                hi: "AI जो आपके बाजार की भाषा बोलता है",
                te: "మీ మార్కెట్ భాషలో మాట్లాడే AI",
                ta: "உங்கள் சந்தையின் மொழியில் பேசும் AI",
                kn: "ನಿಮ್ಮ ಮಾರುಕಟ್ಟೆಯ ಭಾಷೆಯಲ್ಲಿ ಮಾತನಾಡುವ AI",
                ml: "നിങ്ങളുടെ മാർക്കറ്റിന്റെ ഭാഷ സംസാരിക്കുന്ന AI"
            },
            priceDiscovery: {
                en: "Price Discovery",
                hi: "भाव पता करें",
                te: "ధర కనుగొనండి",
                ta: "விலை கண்டுபிடிப்பு",
                kn: "ಬೆಲೆ ಕಂಡುಹಿಡಿಯುವಿಕೆ",
                ml: "വില കണ്ടെത്തൽ"
            },
            priceDesc: {
                en: "Get fair market prices",
                hi: "सही बाजार भाव पाएं",
                te: "సరైన మార్కెట్ ధరలు పొందండి",
                ta: "நியாயமான சந்தை விலைகளைப் பெறுங்கள்",
                kn: "ನ್ಯಾಯಯುತ ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳನ್ನು ಪಡೆಯಿರಿ",
                ml: "ന്യായമായ വിപണി വിലകൾ നേടുക"
            },
            negotiation: {
                en: "Negotiation Assistant",
                hi: "बातचीत सहायक",
                te: "చర్చల సహాయకుడు",
                ta: "பேச்சுவார்த்தை உதவியாளர்",
                kn: "ಮಾತುಕತೆ ಸಹಾಯಕ",
                ml: "ചർച്ച സഹായി"
            },
            negotiationDesc: {
                en: "Smart negotiation advice",
                hi: "स्मार्ट बातचीत सलाह",
                te: "స్మార్ట్ చర్చల సలహా",
                ta: "புத்திசாலித்தனமான பேச்சுவார்த்தை ஆலோசனை",
                kn: "ಸ್ಮಾರ್ಟ್ ಮಾತುಕತೆ ಸಲಹೆ",
                ml: "സ്മാർട്ട് ചർച്ച ഉപദേശം"
            },
            speakVendor: {
                en: "Speak with Vendor",
                hi: "विक्रेता से बात करें",
                te: "విక్రేతతో మాట్లాడండి",
                ta: "விற்பனையாளருடன் பேசுங்கள்",
                kn: "ಮಾರಾಟಗಾರರೊಂದಿಗೆ ಮಾತನಾಡಿ",
                ml: "വിൽപ്പനക്കാരനുമായി സംസാരിക്കുക"
            },
            speakDesc: {
                en: "Real-time translation",
                hi: "तत्काल अनुवाद",
                te: "రియల్-టైమ్ అనువాదం",
                ta: "நேரடி மொழிபெயர்ப்பு",
                kn: "ನೈಜ-ಸಮಯ ಅನುವಾದ",
                ml: "തത്സമയ വിവർത്തനം"
            },
            calculator: {
                en: "Smart Calculator",
                hi: "स्मार्ट कैलकुलेटर",
                te: "స్మార్ట్ కాలిక్యులేటర్",
                ta: "ஸ்மார்ட் கால்குலேட்டர்",
                kn: "ಸ್ಮಾರ್ಟ್ ಕ್ಯಾಲ್ಕುಲೇಟರ್",
                ml: "സ്മാർട്ട് കാൽക്കുലേറ്റർ"
            },
            calculatorDesc: {
                en: "Voice input & bulk discounts",
                hi: "आवाज इनपुट और थोक छूट",
                te: "వాయిస్ ఇన్‌పుట్ & బల్క్ డిస్కౌంట్‌లు",
                ta: "குரல் உள்ளீடு & மொத்த தள்ளுபடிகள்",
                kn: "ಧ್ವನಿ ಇನ್‌ಪುಟ್ ಮತ್ತು ಬೃಹತ್ ರಿಯಾಯಿತಿಗಳು",
                ml: "വോയ്‌സ് ഇൻപുട്ടും ബൾക്ക് കിഴിവുകളും"
            },
            signboard: {
                en: "Signboard Translator",
                hi: "साइनबोर्ड अनुवादक",
                te: "సైన్‌బోర్డ్ అనువాదకుడు",
                ta: "பலகை மொழிபெயர்ப்பாளர்",
                kn: "ಸೈನ್‌ಬೋರ್ಡ್ ಅನುವಾದಕ",
                ml: "സൈൻബോർഡ് വിവർത്തകൻ"
            },
            signboardDesc: {
                en: "Translate any signboard",
                hi: "किसी भी साइनबोर्ड का अनुवाद करें",
                te: "ఏదైనా సైన్‌బోర్డ్‌ను అనువదించండి",
                ta: "எந்த பலகையையும் மொழிபெயர்க்கவும்",
                kn: "ಯಾವುದೇ ಸೈನ್‌ಬೋರ್ಡ್ ಅನ್ನು ಅನುವಾದಿಸಿ",
                ml: "ഏതെങ്കിലും സൈൻബോർഡ് വിവർത്തനം ചെയ്യുക"
            },
            vendorRating: {
                en: "Vendor Rating",
                hi: "विक्रेता रेटिंग",
                te: "విక్రేత రేటింగ్",
                ta: "விற்பனையாளர் மதிப்பீடு",
                kn: "ಮಾರಾಟಗಾರ ರೇಟಿಂಗ್",
                ml: "വിൽപ്പനക്കാരൻ റേറ്റിംഗ്"
            },
            vendorDesc: {
                en: "Trust scores & reviews",
                hi: "विश्वास स्कोर और समीक्षा",
                te: "నమ్మకం స్కోర్లు & సమీక్షలు",
                ta: "நம்பிக்கை மதிப்பெண்கள் & விமர்சனங்கள்",
                kn: "ನಂಬಿಕೆ ಸ್ಕೋರ್‌ಗಳು ಮತ್ತು ವಿಮರ್ಶೆಗಳು",
                ml: "വിശ്വാസ സ്കോറുകളും അവലോകനങ്ങളും"
            }
        };
        return texts[key]?.[language] || texts[key]?.en || key;
    };

    return (
        <main style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }} key={language}>

            {/* Header */}
            <header style={{ textAlign: 'center', marginBottom: '30px' }}>
                <h1 style={{ 
                    fontSize: '3.5rem', 
                    color: '#000000', 
                    fontWeight: 'bold',
                    textShadow: '2px 2px 8px rgba(255, 255, 255, 0.9), -2px -2px 8px rgba(255, 255, 255, 0.9), 2px -2px 8px rgba(255, 255, 255, 0.9), -2px 2px 8px rgba(255, 255, 255, 0.9)'
                }}>{getText('title')}</h1>
                <p style={{ 
                    color: '#000000', 
                    fontSize: '2rem', 
                    fontWeight: '500', 
                    marginTop: '10px',
                    textShadow: '2px 2px 6px rgba(255, 255, 255, 0.9), -2px -2px 6px rgba(255, 255, 255, 0.9), 2px -2px 6px rgba(255, 255, 255, 0.9), -2px 2px 6px rgba(255, 255, 255, 0.9)'
                }}>{getText('tagline')}</p>

                {/* Simple Lang Switcher */}
                <div style={{ marginTop: '10px' }}>
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        style={{
                            padding: '8px',
                            fontSize: '1rem',
                            border: '2px solid var(--color-earth)',
                            borderRadius: '5px',
                            background: 'var(--color-cream)'
                        }}
                    >
                        <option value="en">English</option>
                        <option value="hi">हिंदी (Hindi)</option>
                        <option value="te">తెలుగు (Telugu)</option>
                        <option value="ta">தமிழ் (Tamil)</option>
                        <option value="kn">ಕನ್ನಡ (Kannada)</option>
                        <option value="ml">മലയാളം (Malayalam)</option>
                    </select>
                </div>
            </header>

            {/* Grid */}
            <div className="grid-features">
                <Link href="/features/price-discovery" style={{ textDecoration: 'none' }}>
                    <div className="artistic-card" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem' }}>💰</div>
                        <h3>{getText('priceDiscovery')}</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--color-earth)', marginTop: '5px' }}>
                            {getText('priceDesc')}
                        </p>
                    </div>
                </Link>

                <Link href="/features/negotiation" style={{ textDecoration: 'none' }}>
                    <div className="artistic-card" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem' }}>🤝</div>
                        <h3>{getText('negotiation')}</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--color-earth)', marginTop: '5px' }}>
                            {getText('negotiationDesc')}
                        </p>
                    </div>
                </Link>

                <Link href="/features/speak-with-vendor" style={{ textDecoration: 'none' }}>
                    <div className="artistic-card" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem' }}>🗣️</div>
                        <h3>{getText('speakVendor')}</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--color-earth)', marginTop: '5px' }}>
                            {getText('speakDesc')}
                        </p>
                    </div>
                </Link>

                <Link href="/features/calculator" style={{ textDecoration: 'none' }}>
                    <div className="artistic-card" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem' }}>🧮</div>
                        <h3>{getText('calculator')}</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--color-earth)', marginTop: '5px' }}>
                            {getText('calculatorDesc')}
                        </p>
                    </div>
                </Link>

                <Link href="/features/camera" style={{ textDecoration: 'none' }}>
                    <div className="artistic-card" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem' }}>📸</div>
                        <h3>{getText('signboard')}</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--color-earth)', marginTop: '5px' }}>
                            {getText('signboardDesc')}
                        </p>
                    </div>
                </Link>

                <Link href="/features/vendor-rating" style={{ textDecoration: 'none' }}>
                    <div className="artistic-card" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem' }}>⭐</div>
                        <h3>{getText('vendorRating')}</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--color-earth)', marginTop: '5px' }}>
                            {getText('vendorDesc')}
                        </p>
                    </div>
                </Link>
            </div>
        </main>
    );
}
