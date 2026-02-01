
"use client";
import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/lib/language-context';
import { VoiceService } from '@/lib/aws-services';
import Link from 'next/link';

export default function SignboardTranslator() {
    const { t, language, setLanguage } = useLanguage();
    const [imageSrc, setImageSrc] = useState(null);
    const [extractedText, setExtractedText] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [detectedLanguage, setDetectedLanguage] = useState('');
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);

    // Set background image for this page
    useEffect(() => {
        document.body.style.backgroundImage = "url('/indian_market_fruits_1769918574082.png')";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundAttachment = "fixed";
        document.body.style.backgroundPosition = "center";
        return () => {
            document.body.style.backgroundImage = "url('/indian_market_painting_1769918395003.png')";
        };
    }, []);

    const getText = (key) => {
        const texts = {
            title: {
                en: "Signboard Translator",
                hi: "साइनबोर्ड अनुवादक",
                te: "సైన్‌బోర్డ్ అనువాదకుడు",
                ta: "பலகை மொழிபெயர்ப்பாளர்",
                kn: "ಸೈನ್‌ಬೋರ್ಡ್ ಅನುವಾದಕ",
                ml: "സൈൻബോർഡ് വിവർത്തകൻ"
            },
            tapToTake: {
                en: "📸 Take Photo of Signboard",
                hi: "📸 साइनबोर्ड की फोटो लें",
                te: "📸 సైన్‌బోర్డ్ ఫోటో తీయండి",
                ta: "📸 பலகையின் புகைப்படம் எடுக்கவும்",
                kn: "📸 ಸೈನ್‌ಬೋರ್ಡ್ ಫೋಟೋ ತೆಗೆಯಿರಿ",
                ml: "📸 സൈൻബോർഡിന്റെ ഫോട്ടോ എടുക്കുക"
            },
            hint: {
                en: "Point camera at vendor's price board or signboard",
                hi: "विक्रेता के मूल्य बोर्ड या साइनबोर्ड पर कैमरा लगाएं",
                te: "విక్రేత ధర బోర్డ్ లేదా సైన్‌బోర్డ్‌పై కెమెరా చూపించండి",
                ta: "விற்பனையாளரின் விலை பலகை அல்லது பலகையில் கேமராவை காட்டவும்",
                kn: "ಮಾರಾಟಗಾರರ ಬೆಲೆ ಬೋರ್ಡ್ ಅಥವಾ ಸೈನ್‌ಬೋರ್ಡ್‌ನಲ್ಲಿ ಕ್ಯಾಮೆರಾ ತೋರಿಸಿ",
                ml: "വിൽപ്പനക്കാരന്റെ വില ബോർഡിലോ സൈൻബോർഡിലോ ക്യാമറ ചൂണ്ടുക"
            },
            retake: {
                en: "Retake",
                hi: "फिर से लें",
                te: "మళ్లీ తీయండి",
                ta: "மீண்டும் எடுக்கவும்",
                kn: "ಮತ್ತೆ ತೆಗೆಯಿರಿ",
                ml: "വീണ്ടും എടുക്കുക"
            },
            reading: {
                en: "Reading text...",
                hi: "पाठ पढ़ रहे हैं...",
                te: "టెక్స్ట్ చదువుతోంది...",
                ta: "உரையைப் படிக்கிறது...",
                kn: "ಪಠ್ಯ ಓದುತ್ತಿದೆ...",
                ml: "ടെക്സ്റ്റ് വായിക്കുന്നു..."
            },
            translating: {
                en: "Translating...",
                hi: "अनुवाद कर रहे हैं...",
                te: "అనువదిస్తోంది...",
                ta: "மொழிபெயர்க்கிறது...",
                kn: "ಅನುವಾದಿಸಲಾಗುತ್ತಿದೆ...",
                ml: "വിവർത്തനം ചെയ്യുന്നു..."
            },
            originalText: {
                en: "Original Text",
                hi: "मूल पाठ",
                te: "అసలు టెక్స్ట్",
                ta: "அசல் உரை",
                kn: "ಮೂಲ ಪಠ್ಯ",
                ml: "യഥാർത്ഥ ടെക്സ്റ്റ്"
            },
            translatedText: {
                en: "Translated Text",
                hi: "अनुवादित पाठ",
                te: "అనువదించిన టెక్స్ట్",
                ta: "மொழிபெயர்க்கப்பட்ட உரை",
                kn: "ಅನುವಾದಿತ ಪಠ್ಯ",
                ml: "വിവർത്തനം ചെയ്ത ടെക്സ്റ്റ്"
            },
            detectedLang: {
                en: "Detected Language",
                hi: "पहचानी गई भाषा",
                te: "గుర్తించిన భాష",
                ta: "கண்டறியப்பட்ட மொழி",
                kn: "ಪತ್ತೆಯಾದ ಭಾಷೆ",
                ml: "കണ്ടെത്തിയ ഭാഷ"
            },
            speakTranslation: {
                en: "🔊 Speak Translation",
                hi: "🔊 अनुवाद बोलें",
                te: "🔊 అనువాదం మాట్లాడండి",
                ta: "🔊 மொழிபெயர்ப்பு பேசுங்கள்",
                kn: "🔊 ಅನುವಾದ ಮಾತನಾಡಿ",
                ml: "🔊 വിവർത്തനം സംസാരിക്കുക"
            },
            noText: {
                en: "No text detected. Try taking a clearer photo.",
                hi: "कोई पाठ नहीं मिला। स्पष्ट फोटो लेने का प्रयास करें।",
                te: "టెక్స్ట్ కనుగొనబడలేదు. స్పష్టమైన ఫోటో తీయడానికి ప్రయత్నించండి।",
                ta: "உரை கண்டறியப்படவில்லை. தெளிவான புகைப்படம் எடுக்க முயற்சிக்கவும்.",
                kn: "ಯಾವುದೇ ಪಠ್ಯ ಪತ್ತೆಯಾಗಿಲ್ಲ. ಸ್ಪಷ್ಟ ಫೋಟೋ ತೆಗೆಯಲು ಪ್ರಯತ್ನಿಸಿ.",
                ml: "ടെക്സ്റ്റ് കണ്ടെത്തിയില്ല. വ്യക്തമായ ഫോട്ടോ എടുക്കാൻ ശ്രമിക്കുക."
            }
        };
        return texts[key]?.[language] || texts[key]?.en || key;
    };

    const languageNames = {
        en: { en: "English", hi: "अंग्रेज़ी", te: "ఇంగ్లీష్", ta: "ஆங்கிலம்", kn: "ಇಂಗ್ಲಿಷ್", ml: "ഇംഗ്ലീഷ്" },
        hi: { en: "Hindi", hi: "हिंदी", te: "హిందీ", ta: "இந்தி", kn: "ಹಿಂದಿ", ml: "ഹിന്ദി" },
        te: { en: "Telugu", hi: "तेलुगु", te: "తెలుగు", ta: "தெலுங்கு", kn: "ತೆಲುಗು", ml: "തെലുങ്ക്" },
        ta: { en: "Tamil", hi: "तमिल", te: "తమిళం", ta: "தமிழ்", kn: "ತಮಿಳು", ml: "തമിഴ്" },
        kn: { en: "Kannada", hi: "कन्नड़", te: "కన్నడ", ta: "கன்னடம்", kn: "ಕನ್ನಡ", ml: "കന്നഡ" },
        ml: { en: "Malayalam", hi: "मलयालम", te: "మలయాళం", ta: "மலையாளம்", kn: "ಮಲಯಾಳಂ", ml: "മലയാളം" }
    };

    const handleCapture = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setImageSrc(url);
            setLoading(true);
            setExtractedText('');
            setTranslatedText('');
            setDetectedLanguage('');

            try {
                // Send image to API for OCR and translation
                const formData = new FormData();
                formData.append('image', file);
                formData.append('targetLanguage', language);

                const response = await fetch('/api/signboard-translate', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    throw new Error('Translation failed');
                }

                const data = await response.json();
                setExtractedText(data.originalText);
                setTranslatedText(data.translatedText);
                setDetectedLanguage(data.detectedLanguage);
            } catch (error) {
                console.error('Error:', error);
                alert('Failed to process image. Please try again.');
            } finally {
                setLoading(false);
            }
        }
    };

    const speakTranslation = async () => {
        if (translatedText) {
            const audioUrl = await VoiceService.speak(translatedText, language);
            if (audioUrl) {
                new Audio(audioUrl).play();
            }
        }
    };

    return (
        <div className="p-4" style={{ maxWidth: '600px', margin: '0 auto' }}>
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

            <div className="artistic-card">
                {!imageSrc ? (
                    <div
                        onClick={() => fileInputRef.current.click()}
                        style={{ 
                            padding: '60px 20px', 
                            border: '3px dashed var(--color-earth)', 
                            borderRadius: '15px', 
                            cursor: 'pointer',
                            textAlign: 'center',
                            background: 'var(--color-cream)'
                        }}
                    >
                        <div style={{ fontSize: '4rem', marginBottom: '15px' }}>📸</div>
                        <h3 style={{ marginBottom: '10px', color: 'var(--color-indigo)' }}>{getText('tapToTake')}</h3>
                        <p style={{ fontSize: '0.9rem', color: '#666' }}>{getText('hint')}</p>
                        <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleCapture}
                        />
                    </div>
                ) : (
                    <div>
                        <div style={{ position: 'relative', marginBottom: '20px' }}>
                            <img src={imageSrc} style={{ width: '100%', borderRadius: '10px', border: '3px solid var(--color-earth)' }} alt="Captured signboard" />
                            <button
                                onClick={() => { 
                                    setImageSrc(null); 
                                    setExtractedText(''); 
                                    setTranslatedText('');
                                    setDetectedLanguage('');
                                }}
                                className="btn-paint"
                                style={{ 
                                    position: 'absolute', 
                                    top: '10px', 
                                    right: '10px', 
                                    background: '#ff5252', 
                                    color: 'white', 
                                    padding: '8px 15px'
                                }}
                            >
                                {getText('retake')}
                            </button>
                        </div>

                        {loading && (
                            <div style={{ textAlign: 'center', padding: '30px' }}>
                                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>⏳</div>
                                <div style={{ fontSize: '1.1rem', color: 'var(--color-indigo)' }}>
                                    {getText('reading')}
                                </div>
                                <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '5px' }}>
                                    {getText('translating')}
                                </div>
                            </div>
                        )}

                        {!loading && extractedText && (
                            <div>
                                {/* Detected Language */}
                                {detectedLanguage && (
                                    <div style={{ marginBottom: '15px', padding: '10px', background: '#e3f2fd', borderRadius: '8px', textAlign: 'center' }}>
                                        <span style={{ fontSize: '0.9rem', color: '#666' }}>{getText('detectedLang')}: </span>
                                        <span style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--color-indigo)' }}>
                                            {languageNames[detectedLanguage]?.[language] || detectedLanguage.toUpperCase()}
                                        </span>
                                    </div>
                                )}

                                {/* Side-by-Side Text Display */}
                                <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
                                    {/* Original Text */}
                                    <div style={{ flex: '1', minWidth: '250px', padding: '15px', background: 'var(--color-cream)', borderRadius: '10px', border: '2px solid var(--color-earth)' }}>
                                        <h3 style={{ marginBottom: '10px', color: 'var(--color-earth)', fontSize: '1rem', textAlign: 'center' }}>
                                            {getText('originalText')}
                                        </h3>
                                        <div style={{ 
                                            fontSize: '1rem', 
                                            lineHeight: '1.8', 
                                            whiteSpace: 'pre-wrap',
                                            fontFamily: 'inherit'
                                        }}>
                                            {extractedText}
                                        </div>
                                    </div>

                                    {/* Translated Text */}
                                    <div style={{ flex: '1', minWidth: '250px', padding: '15px', background: 'var(--color-indigo)', color: 'white', borderRadius: '10px' }}>
                                        <h3 style={{ marginBottom: '10px', fontSize: '1rem', textAlign: 'center' }}>
                                            {getText('translatedText')}
                                        </h3>
                                        <div style={{ 
                                            fontSize: '1rem', 
                                            lineHeight: '1.8', 
                                            whiteSpace: 'pre-wrap',
                                            fontWeight: '500',
                                            fontFamily: 'inherit'
                                        }}>
                                            {translatedText}
                                        </div>
                                    </div>
                                </div>

                                {/* Speak Button */}
                                <button
                                    onClick={speakTranslation}
                                    className="btn-paint"
                                    style={{
                                        width: '100%',
                                        background: 'var(--color-green)',
                                        color: 'white',
                                        padding: '15px',
                                        fontSize: '1.2rem'
                                    }}
                                >
                                    {getText('speakTranslation')}
                                </button>
                            </div>
                        )}

                        {!loading && !extractedText && (
                            <div style={{ textAlign: 'center', padding: '30px', background: '#fff9c4', borderRadius: '10px' }}>
                                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>⚠️</div>
                                <p style={{ fontSize: '1rem', color: '#666' }}>{getText('noText')}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Info Section */}
            {!imageSrc && (
                <div style={{ marginTop: '20px', padding: '15px', background: '#e8f5e9', borderRadius: '10px' }}>
                    <h4 style={{ marginBottom: '10px', color: 'var(--color-green)' }}>💡 How it works:</h4>
                    <ul style={{ fontSize: '0.9rem', lineHeight: '1.8', paddingLeft: '20px' }}>
                        <li>Take a photo of any signboard or price board</li>
                        <li>App reads all text from the image</li>
                        <li>Translates to your preferred language</li>
                        <li>Preserves prices, items, and quantities</li>
                        <li>Hear the translation spoken aloud</li>
                    </ul>
                </div>
            )}
        </div>
    );
}
