"use client";
import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/language-context';
import Link from 'next/link';

export default function VendorRating() {
    const { language, setLanguage } = useLanguage();
    const [mode, setMode] = useState('view'); // 'view' or 'rate'
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState([]);
    const [submitted, setSubmitted] = useState(false);

    // Set background image for this page
    useEffect(() => {
        document.body.style.backgroundImage = "url('/indian_market_spices_1769918591343.png')";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundAttachment = "fixed";
        document.body.style.backgroundPosition = "center";
        return () => {
            document.body.style.backgroundImage = "url('/indian_market_painting_1769918395003.png')";
        };
    }, []);

    // Mock vendor data (in real app, this would come from a database)
    const [vendors, setVendors] = useState([
        {
            id: 1,
            name: "Ravi Kumar",
            language: "te",
            rating: 4.5,
            totalRatings: 127,
            trustBadge: "trusted",
            items: ["Tomato", "Onion", "Potato"],
            feedbackStats: { fairPrice: 95, goodQuality: 92, honestDealing: 98 }
        },
        {
            id: 2,
            name: "Lakshmi Devi",
            language: "kn",
            rating: 4.8,
            totalRatings: 203,
            trustBadge: "top",
            items: ["Rice", "Wheat", "Pulses"],
            feedbackStats: { fairPrice: 98, goodQuality: 96, honestDealing: 99 }
        },
        {
            id: 3,
            name: "Murugan",
            language: "ta",
            rating: 3.9,
            totalRatings: 45,
            trustBadge: "new",
            items: ["Banana", "Coconut", "Mango"],
            feedbackStats: { fairPrice: 78, goodQuality: 82, honestDealing: 85 }
        },
        {
            id: 4,
            name: "Suresh Reddy",
            language: "te",
            rating: 4.6,
            totalRatings: 156,
            trustBadge: "trusted",
            items: ["Vegetables", "Fruits"],
            feedbackStats: { fairPrice: 93, goodQuality: 94, honestDealing: 96 }
        }
    ]);

    const getText = (key) => {
        const texts = {
            title: {
                en: "Vendor Rating & Trust",
                hi: "विक्रेता रेटिंग और विश्वास",
                te: "విక్రేత రేటింగ్ మరియు నమ్మకం",
                ta: "விற்பனையாளர் மதிப்பீடு மற்றும் நம்பிக்கை",
                kn: "ಮಾರಾಟಗಾರ ರೇಟಿಂಗ್ ಮತ್ತು ನಂಬಿಕೆ",
                ml: "വിൽപ്പനക്കാരൻ റേറ്റിംഗും വിശ്വാസവും"
            },
            viewVendors: {
                en: "View Vendors",
                hi: "विक्रेता देखें",
                te: "విక్రేతలను చూడండి",
                ta: "விற்பனையாளர்களைக் காண்க",
                kn: "ಮಾರಾಟಗಾರರನ್ನು ವೀಕ್ಷಿಸಿ",
                ml: "വിൽപ്പനക്കാരെ കാണുക"
            },
            rateVendor: {
                en: "Rate a Vendor",
                hi: "विक्रेता को रेट करें",
                te: "విక్రేతకు రేటింగ్ ఇవ్వండి",
                ta: "விற்பனையாளரை மதிப்பிடுங்கள்",
                kn: "ಮಾರಾಟಗಾರರಿಗೆ ರೇಟಿಂಗ್ ನೀಡಿ",
                ml: "വിൽപ്പനക്കാരനെ റേറ്റ് ചെയ്യുക"
            },
            speaks: {
                en: "Speaks",
                hi: "बोलते हैं",
                te: "మాట్లాడతారు",
                ta: "பேசுகிறார்",
                kn: "ಮಾತನಾಡುತ್ತಾರೆ",
                ml: "സംസാരിക്കുന്നു"
            },
            sells: {
                en: "Sells",
                hi: "बेचते हैं",
                te: "అమ్ముతారు",
                ta: "விற்கிறார்",
                kn: "ಮಾರಾಟ ಮಾಡುತ್ತಾರೆ",
                ml: "വിൽക്കുന്നു"
            },
            ratings: {
                en: "ratings",
                hi: "रेटिंग",
                te: "రేటింగ్‌లు",
                ta: "மதிப்பீடுகள்",
                kn: "ರೇಟಿಂಗ್‌ಗಳು",
                ml: "റേറ്റിംഗുകൾ"
            },
            selectVendor: {
                en: "Select Vendor to Rate",
                hi: "रेट करने के लिए विक्रेता चुनें",
                te: "రేటింగ్ ఇవ్వడానికి విక్రేతను ఎంచుకోండి",
                ta: "மதிப்பிட விற்பனையாளரைத் தேர்ந்தெடுக்கவும்",
                kn: "ರೇಟಿಂಗ್ ನೀಡಲು ಮಾರಾಟಗಾರರನ್ನು ಆಯ್ಕೆಮಾಡಿ",
                ml: "റേറ്റ് ചെയ്യാൻ വിൽപ്പനക്കാരനെ തിരഞ്ഞെടുക്കുക"
            },
            yourRating: {
                en: "Your Rating",
                hi: "आपकी रेटिंग",
                te: "మీ రేటింగ్",
                ta: "உங்கள் மதிப்பீடு",
                kn: "ನಿಮ್ಮ ರೇಟಿಂಗ್",
                ml: "നിങ്ങളുടെ റേറ്റിംഗ്"
            },
            quickFeedback: {
                en: "Quick Feedback (Optional)",
                hi: "त्वरित प्रतिक्रिया (वैकल्पिक)",
                te: "త్వరిత అభిప్రాయం (ఐచ్ఛికం)",
                ta: "விரைவு கருத்து (விருப்பமானது)",
                kn: "ತ್ವರಿತ ಪ್ರತಿಕ್ರಿಯೆ (ಐಚ್ಛಿಕ)",
                ml: "വേഗത്തിലുള്ള ഫീഡ്‌ബാക്ക് (ഓപ്ഷണൽ)"
            },
            fairPrice: {
                en: "Fair Price",
                hi: "सही भाव",
                te: "సరైన ధర",
                ta: "நியாயமான விலை",
                kn: "ನ್ಯಾಯಯುತ ಬೆಲೆ",
                ml: "ന്യായമായ വില"
            },
            goodQuality: {
                en: "Good Quality",
                hi: "अच्छी गुणवत्ता",
                te: "మంచి నాణ్యత",
                ta: "நல்ல தரம்",
                kn: "ಉತ್ತಮ ಗುಣಮಟ್ಟ",
                ml: "നല്ല ഗുണനിലവാരം"
            },
            honestDealing: {
                en: "Honest Dealing",
                hi: "ईमानदार व्यवहार",
                te: "నిజాయితీ వ్యవహారం",
                ta: "நேர்மையான கையாளுதல்",
                kn: "ಪ್ರಾಮಾಣಿಕ ವ್ಯವಹಾರ",
                ml: "സത്യസന്ധമായ ഇടപാട്"
            },
            submitRating: {
                en: "Submit Rating",
                hi: "रेटिंग जमा करें",
                te: "రేటింగ్ సమర్పించండి",
                ta: "மதிப்பீட்டைச் சமர்ப்பிக்கவும்",
                kn: "ರೇಟಿಂಗ್ ಸಲ್ಲಿಸಿ",
                ml: "റേറ്റിംഗ് സമർപ്പിക്കുക"
            },
            thankYou: {
                en: "Thank you for your feedback!",
                hi: "आपकी प्रतिक्रिया के लिए धन्यवाद!",
                te: "మీ అభిప్రాయానికి ధన్యవాదాలు!",
                ta: "உங்கள் கருத்துக்கு நன்றி!",
                kn: "ನಿಮ್ಮ ಪ್ರತಿಕ್ರಿಯೆಗೆ ಧನ್ಯವಾದಗಳು!",
                ml: "നിങ്ങളുടെ ഫീഡ്‌ബാക്കിന് നന്ദി!"
            }
        };
        return texts[key]?.[language] || texts[key]?.en || key;
    };

    const languageNames = {
        en: "English", hi: "हिंदी", te: "తెలుగు", 
        ta: "தமிழ்", kn: "ಕನ್ನಡ", ml: "മലയാളം"
    };

    const getTrustBadge = (badge) => {
        const badges = {
            top: { icon: "🔵", text: { en: "Top Rated", hi: "शीर्ष रेटेड", te: "టాప్ రేటెడ్", ta: "சிறந்த மதிப்பீடு", kn: "ಉನ್ನತ ರೇಟೆಡ್", ml: "ടോപ്പ് റേറ്റഡ്" }, color: "#2196f3" },
            trusted: { icon: "🟢", text: { en: "Trusted Vendor", hi: "विश्वसनीय विक्रेता", te: "నమ్మకమైన విక్రేత", ta: "நம்பகமான விற்பனையாளர்", kn: "ವಿಶ್ವಾಸಾರ್ಹ ಮಾರಾಟಗಾರ", ml: "വിശ്വസ്ത വിൽപ്പനക്കാരൻ" }, color: "#4caf50" },
            new: { icon: "🟡", text: { en: "New Vendor", hi: "नया विक्रेता", te: "కొత్త విక్రేత", ta: "புதிய விற்பனையாளர்", kn: "ಹೊಸ ಮಾರಾಟಗಾರ", ml: "പുതിയ വിൽപ്പനക്കാരൻ" }, color: "#ff9800" }
        };
        const b = badges[badge] || badges.new;
        return { ...b, text: b.text[language] || b.text.en };
    };

    const handleRatingSubmit = () => {
        if (!selectedVendor || rating === 0) return;

        // Update vendor rating (in real app, this would update database)
        const updatedVendors = vendors.map(v => {
            if (v.id === selectedVendor.id) {
                const newTotal = v.totalRatings + 1;
                const newRating = ((v.rating * v.totalRatings) + rating) / newTotal;
                return {
                    ...v,
                    rating: parseFloat(newRating.toFixed(1)),
                    totalRatings: newTotal,
                    feedbackStats: {
                        fairPrice: feedback.includes('fairPrice') ? v.feedbackStats.fairPrice + 1 : v.feedbackStats.fairPrice,
                        goodQuality: feedback.includes('goodQuality') ? v.feedbackStats.goodQuality + 1 : v.feedbackStats.goodQuality,
                        honestDealing: feedback.includes('honestDealing') ? v.feedbackStats.honestDealing + 1 : v.feedbackStats.honestDealing
                    }
                };
            }
            return v;
        });

        setVendors(updatedVendors);
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setRating(0);
            setFeedback([]);
            setSelectedVendor(null);
            setMode('view');
        }, 2000);
    };

    const toggleFeedback = (item) => {
        setFeedback(prev => 
            prev.includes(item) ? prev.filter(f => f !== item) : [...prev, item]
        );
    };

    return (
        <div className="p-4" style={{ maxWidth: '800px', margin: '0 auto' }}>
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
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <button
                    onClick={() => setMode('view')}
                    className="btn-paint"
                    style={{
                        flex: 1,
                        background: mode === 'view' ? 'var(--color-indigo)' : 'var(--color-cream)',
                        color: mode === 'view' ? 'white' : 'var(--color-earth)'
                    }}
                >
                    {getText('viewVendors')}
                </button>
                <button
                    onClick={() => setMode('rate')}
                    className="btn-paint"
                    style={{
                        flex: 1,
                        background: mode === 'rate' ? 'var(--color-indigo)' : 'var(--color-cream)',
                        color: mode === 'rate' ? 'white' : 'var(--color-earth)'
                    }}
                >
                    {getText('rateVendor')}
                </button>
            </div>

            {/* View Vendors Mode */}
            {mode === 'view' && (
                <div>
                    {vendors.map(vendor => {
                        const badge = getTrustBadge(vendor.trustBadge);
                        return (
                            <div key={vendor.id} className="artistic-card" style={{ marginBottom: '15px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                                    <div>
                                        <h3 style={{ margin: '0 0 5px 0', color: 'var(--color-indigo)' }}>{vendor.name}</h3>
                                        <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '5px' }}>
                                            {getText('speaks')}: {languageNames[vendor.language]}
                                        </div>
                                    </div>
                                    <div style={{ 
                                        padding: '5px 12px', 
                                        background: badge.color, 
                                        color: 'white', 
                                        borderRadius: '20px',
                                        fontSize: '0.85rem',
                                        fontWeight: 'bold'
                                    }}>
                                        {badge.icon} {badge.text}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                    <div style={{ fontSize: '2rem', color: '#ffa726' }}>
                                        {'⭐'.repeat(Math.round(vendor.rating))}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-indigo)' }}>
                                            {vendor.rating}/5
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: '#666' }}>
                                            {vendor.totalRatings} {getText('ratings')}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ marginBottom: '10px' }}>
                                    <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '5px' }}>
                                        {getText('sells')}: {vendor.items.join(', ')}
                                    </div>
                                </div>

                                {/* Feedback Stats */}
                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                    <div style={{ flex: '1', minWidth: '100px', padding: '8px', background: '#e8f5e9', borderRadius: '6px', textAlign: 'center' }}>
                                        <div style={{ fontSize: '0.75rem', color: '#666' }}>{getText('fairPrice')}</div>
                                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#4caf50' }}>
                                            {vendor.feedbackStats.fairPrice}%
                                        </div>
                                    </div>
                                    <div style={{ flex: '1', minWidth: '100px', padding: '8px', background: '#e3f2fd', borderRadius: '6px', textAlign: 'center' }}>
                                        <div style={{ fontSize: '0.75rem', color: '#666' }}>{getText('goodQuality')}</div>
                                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#2196f3' }}>
                                            {vendor.feedbackStats.goodQuality}%
                                        </div>
                                    </div>
                                    <div style={{ flex: '1', minWidth: '100px', padding: '8px', background: '#fff3e0', borderRadius: '6px', textAlign: 'center' }}>
                                        <div style={{ fontSize: '0.75rem', color: '#666' }}>{getText('honestDealing')}</div>
                                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#ff9800' }}>
                                            {vendor.feedbackStats.honestDealing}%
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Rate Vendor Mode */}
            {mode === 'rate' && (
                <div>
                    {!selectedVendor ? (
                        <div>
                            <h3 style={{ marginBottom: '15px', color: 'var(--color-earth)' }}>{getText('selectVendor')}</h3>
                            {vendors.map(vendor => (
                                <div 
                                    key={vendor.id} 
                                    className="artistic-card" 
                                    onClick={() => setSelectedVendor(vendor)}
                                    style={{ 
                                        marginBottom: '10px', 
                                        cursor: 'pointer',
                                        transition: 'transform 0.2s',
                                        ':hover': { transform: 'scale(1.02)' }
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <h4 style={{ margin: '0 0 5px 0', color: 'var(--color-indigo)' }}>{vendor.name}</h4>
                                            <div style={{ fontSize: '0.85rem', color: '#666' }}>
                                                ⭐ {vendor.rating}/5 • {languageNames[vendor.language]}
                                            </div>
                                        </div>
                                        <div style={{ fontSize: '1.5rem' }}>→</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : submitted ? (
                        <div className="artistic-card" style={{ textAlign: 'center', padding: '40px' }}>
                            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>✅</div>
                            <h3 style={{ color: 'var(--color-green)', marginBottom: '10px' }}>{getText('thankYou')}</h3>
                            <p style={{ color: '#666' }}>{selectedVendor.name}</p>
                        </div>
                    ) : (
                        <div className="artistic-card">
                            <div style={{ marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid var(--color-earth)' }}>
                                <h3 style={{ margin: '0 0 5px 0', color: 'var(--color-indigo)' }}>{selectedVendor.name}</h3>
                                <div style={{ fontSize: '0.9rem', color: '#666' }}>
                                    {getText('speaks')}: {languageNames[selectedVendor.language]}
                                </div>
                            </div>

                            {/* Star Rating */}
                            <div style={{ marginBottom: '25px' }}>
                                <h4 style={{ marginBottom: '10px', color: 'var(--color-earth)' }}>{getText('yourRating')}</h4>
                                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <button
                                            key={star}
                                            onClick={() => setRating(star)}
                                            style={{
                                                fontSize: '3rem',
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                padding: '5px',
                                                transition: 'transform 0.2s'
                                            }}
                                            onMouseEnter={(e) => e.target.style.transform = 'scale(1.2)'}
                                            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                        >
                                            {star <= rating ? '⭐' : '☆'}
                                        </button>
                                    ))}
                                </div>
                                {rating > 0 && (
                                    <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-indigo)' }}>
                                        {rating}/5
                                    </div>
                                )}
                            </div>

                            {/* Quick Feedback */}
                            <div style={{ marginBottom: '25px' }}>
                                <h4 style={{ marginBottom: '10px', color: 'var(--color-earth)' }}>{getText('quickFeedback')}</h4>
                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                    <button
                                        onClick={() => toggleFeedback('fairPrice')}
                                        className="btn-paint"
                                        style={{
                                            flex: '1',
                                            minWidth: '120px',
                                            background: feedback.includes('fairPrice') ? '#4caf50' : 'var(--color-cream)',
                                            color: feedback.includes('fairPrice') ? 'white' : 'var(--color-earth)',
                                            border: `2px solid ${feedback.includes('fairPrice') ? '#4caf50' : 'var(--color-earth)'}`
                                        }}
                                    >
                                        {feedback.includes('fairPrice') ? '✓ ' : ''}{getText('fairPrice')}
                                    </button>
                                    <button
                                        onClick={() => toggleFeedback('goodQuality')}
                                        className="btn-paint"
                                        style={{
                                            flex: '1',
                                            minWidth: '120px',
                                            background: feedback.includes('goodQuality') ? '#2196f3' : 'var(--color-cream)',
                                            color: feedback.includes('goodQuality') ? 'white' : 'var(--color-earth)',
                                            border: `2px solid ${feedback.includes('goodQuality') ? '#2196f3' : 'var(--color-earth)'}`
                                        }}
                                    >
                                        {feedback.includes('goodQuality') ? '✓ ' : ''}{getText('goodQuality')}
                                    </button>
                                    <button
                                        onClick={() => toggleFeedback('honestDealing')}
                                        className="btn-paint"
                                        style={{
                                            flex: '1',
                                            minWidth: '120px',
                                            background: feedback.includes('honestDealing') ? '#ff9800' : 'var(--color-cream)',
                                            color: feedback.includes('honestDealing') ? 'white' : 'var(--color-earth)',
                                            border: `2px solid ${feedback.includes('honestDealing') ? '#ff9800' : 'var(--color-earth)'}`
                                        }}
                                    >
                                        {feedback.includes('honestDealing') ? '✓ ' : ''}{getText('honestDealing')}
                                    </button>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button
                                    onClick={() => {
                                        setSelectedVendor(null);
                                        setRating(0);
                                        setFeedback([]);
                                    }}
                                    className="btn-paint"
                                    style={{
                                        flex: '1',
                                        background: 'var(--color-cream)',
                                        color: 'var(--color-earth)'
                                    }}
                                >
                                    ← Back
                                </button>
                                <button
                                    onClick={handleRatingSubmit}
                                    className="btn-paint"
                                    disabled={rating === 0}
                                    style={{
                                        flex: '2',
                                        background: rating === 0 ? '#ccc' : 'var(--color-green)',
                                        color: 'white',
                                        cursor: rating === 0 ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    {getText('submitRating')}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Info Section */}
            {mode === 'view' && (
                <div style={{ marginTop: '20px', padding: '15px', background: '#e8f5e9', borderRadius: '10px' }}>
                    <h4 style={{ marginBottom: '10px', color: 'var(--color-green)' }}>💡 Why Trust Scores Matter:</h4>
                    <ul style={{ fontSize: '0.9rem', lineHeight: '1.8', paddingLeft: '20px' }}>
                        <li>See vendor ratings before negotiating</li>
                        <li>Know vendor's preferred language</li>
                        <li>Check what items they sell</li>
                        <li>View feedback from other buyers</li>
                        <li>Build trust in the marketplace</li>
                    </ul>
                </div>
            )}
        </div>
    );
}
