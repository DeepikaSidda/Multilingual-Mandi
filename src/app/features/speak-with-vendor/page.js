"use client";
import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/lib/language-context';
import { TranslationService, VoiceService } from '@/lib/aws-services';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import 'react-simple-keyboard/build/css/index.css';

// Dynamically import keyboard to avoid SSR issues
const Keyboard = dynamic(() => import('react-simple-keyboard').then(mod => mod.default), { ssr: false });

export default function SpeakWithVendor() {
    const { language, setLanguage } = useLanguage();
    const [userLanguage, setUserLanguage] = useState('en');
    const [vendorLanguage, setVendorLanguage] = useState('hi');
    const [currentSpeaker, setCurrentSpeaker] = useState('user'); // 'user' or 'vendor'
    const [messages, setMessages] = useState([]); // Array of {speaker, originalText, translatedText, originalLang, translatedLang}
    const [inputText, setInputText] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isTranslating, setIsTranslating] = useState(false);

    // Set background image for this page
    useEffect(() => {
        document.body.style.backgroundImage = "url('/indian_art_background_1769918011194.png')";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundAttachment = "fixed";
        document.body.style.backgroundPosition = "center";
        return () => {
            document.body.style.backgroundImage = "url('/bg-market.png')";
        };
    }, []);
    const [recognition, setRecognition] = useState(null);
    const [showKeyboard, setShowKeyboard] = useState(false);
    const messagesEndRef = useRef(null);
    const keyboardRef = useRef(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        // Initialize speech recognition
        if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognitionInstance = new SpeechRecognition();
            recognitionInstance.continuous = false;
            recognitionInstance.interimResults = false;
            
            recognitionInstance.onresult = async (event) => {
                const transcript = event.results[0][0].transcript;
                setInputText(transcript);
                setIsListening(false);
                
                // Auto-send after speech
                await handleSendMessage(transcript);
            };

            recognitionInstance.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setIsListening(false);
            };

            recognitionInstance.onend = () => {
                setIsListening(false);
            };

            setRecognition(recognitionInstance);
        }
    }, [currentSpeaker, userLanguage, vendorLanguage]);

    const startListening = () => {
        if (recognition) {
            setInputText('');
            
            // Set recognition language based on current speaker's language
            const langMap = {
                'en': 'en-US',
                'hi': 'hi-IN',
                'te': 'te-IN',
                'ta': 'ta-IN',
                'kn': 'kn-IN',
                'ml': 'ml-IN'
            };
            
            const speakerLang = currentSpeaker === 'user' ? userLanguage : vendorLanguage;
            const selectedLang = langMap[speakerLang] || 'en-US';
            recognition.lang = selectedLang;
            
            // Check if language is supported
            const supportedLangs = ['en-US', 'hi-IN'];
            if (!supportedLangs.includes(selectedLang)) {
                alert(`Speech recognition for ${speakerLang.toUpperCase()} may not be fully supported. Please use the text input instead or switch to English/Hindi for voice input.`);
                return;
            }
            
            setIsListening(true);
            recognition.start();
        } else {
            alert('Speech recognition is not supported in your browser. Please use Chrome or Edge, or use the text input option.');
        }
    };

    const handleSendMessage = async (textToSend = inputText) => {
        if (!textToSend.trim()) return;

        setIsTranslating(true);
        
        try {
            const sourceLang = currentSpeaker === 'user' ? userLanguage : vendorLanguage;
            const targetLang = currentSpeaker === 'user' ? vendorLanguage : userLanguage;
            
            // Translate text
            const translated = await TranslationService.translate(
                textToSend,
                sourceLang,
                targetLang
            );

            // Add message to chat
            const newMessage = {
                speaker: currentSpeaker,
                originalText: textToSend,
                translatedText: translated,
                originalLang: sourceLang,
                translatedLang: targetLang,
                timestamp: new Date()
            };
            
            setMessages(prev => [...prev, newMessage]);
            setInputText('');
            if (keyboardRef.current) {
                keyboardRef.current.clearInput();
            }

            // Speak translated text
            const audioUrl = await VoiceService.speak(translated, targetLang);
            if (audioUrl) {
                new Audio(audioUrl).play();
            }
        } catch (error) {
            console.error('Translation error:', error);
            alert('Translation failed. Please try again.');
        } finally {
            setIsTranslating(false);
        }
    };

    const onKeyboardChange = (input) => {
        setInputText(input);
    };

    const onKeyPress = (button) => {
        if (button === "{enter}") {
            handleSendMessage();
        }
    };

    const getKeyboardLayout = () => {
        const speakerLang = currentSpeaker === 'user' ? userLanguage : vendorLanguage;
        
        // Custom layouts for Indian languages
        const layouts = {
            'hi': {
                default: [
                    'अ आ इ ई उ ऊ ए ऐ ओ औ {bksp}',
                    'क ख ग घ ङ च छ ज झ ञ',
                    'ट ठ ड ढ ण त थ द ध न',
                    'प फ ब भ म य र ल व',
                    'श ष स ह क्ष त्र ज्ञ',
                    'ा ि ी ु ू े ै ो ौ ं ः ँ ्',
                    '{space}'
                ]
            },
            'te': {
                default: [
                    'అ ఆ ఇ ఈ ఉ ఊ ఋ ౠ ఎ ఏ ఐ ఒ ఓ ఔ {bksp}',
                    'క ఖ గ ఘ ఙ చ ఛ జ ఝ ఞ',
                    'ట ఠ డ ఢ ణ త థ ద ధ న',
                    'ప ఫ బ భ మ య ర ల వ',
                    'శ ష స హ ళ క్ష',
                    'ా ి ీ ు ూ ృ ౄ ె ే ై ొ ో ౌ ం ః ్',
                    '{space}'
                ]
            },
            'ta': {
                default: [
                    'அ ஆ இ ஈ உ ஊ எ ஏ ஐ ஒ ஓ ஔ {bksp}',
                    'க ங ச ஞ ட ண த ந ப ம',
                    'ய ர ல வ ழ ள ற ன',
                    'ஷ ஸ ஹ க்ஷ',
                    'ா ி ீ ு ூ ெ ே ை ொ ோ ௌ ் ஂ ஃ',
                    '{space}'
                ]
            },
            'kn': {
                default: [
                    'ಅ ಆ ಇ ಈ ಉ ಊ ಋ ೠ ಎ ಏ ಐ ಒ ಓ ಔ {bksp}',
                    'ಕ ಖ ಗ ಘ ಙ ಚ ಛ ಜ ಝ ಞ',
                    'ಟ ಠ ಡ ಢ ಣ ತ ಥ ದ ಧ ನ',
                    'ಪ ಫ ಬ ಭ ಮ ಯ ರ ಲ ವ',
                    'ಶ ಷ ಸ ಹ ಳ ಕ್ಷ',
                    'ಾ ಿ ೀ ು ೂ ೃ ೄ ೆ ೇ ೈ ೊ ೋ ೌ ಂ ಃ ್',
                    '{space}'
                ]
            },
            'ml': {
                default: [
                    'അ ആ ഇ ഈ ഉ ഊ ഋ ൠ ഌ ൡ എ ഏ ഐ ഒ ഓ ഔ {bksp}',
                    'ക ഖ ഗ ഘ ങ ച ഛ ജ ഝ ഞ',
                    'ട ഠ ഡ ഢ ണ ത ഥ ദ ധ ന',
                    'പ ഫ ബ ഭ മ യ ര ല വ',
                    'ശ ഷ സ ഹ ള ഴ റ ക്ഷ',
                    'ാ ി ീ ു ൂ ൃ ൄ െ േ ൈ ൊ ോ ൌ ം ഃ ്',
                    '{space}'
                ]
            },
            'en': {
                default: [
                    'q w e r t y u i o p {bksp}',
                    'a s d f g h j k l',
                    'z x c v b n m',
                    '{space}'
                ]
            }
        };
        
        return layouts[speakerLang] || layouts['en'];
    };

    const shouldShowKeyboard = () => {
        const speakerLang = currentSpeaker === 'user' ? userLanguage : vendorLanguage;
        return ['hi', 'te', 'ta', 'kn', 'ml'].includes(speakerLang);
    };

    const getText = (key) => {
        const texts = {
            title: {
                en: "Speak with Vendor",
                hi: "विक्रेता से बात करें",
                te: "విక్రేతతో మాట్లాడండి",
                ta: "விற்பனையாளருடன் பேசுங்கள்",
                kn: "ಮಾರಾಟಗಾರರೊಂದಿಗೆ ಮಾತನಾಡಿ",
                ml: "വിൽപ്പനക്കാരനുമായി സംസാരിക്കുക"
            },
            yourLanguage: {
                en: "Your Language",
                hi: "आपकी भाषा",
                te: "మీ భాష",
                ta: "உங்கள் மொழி",
                kn: "ನಿಮ್ಮ ಭಾಷೆ",
                ml: "നിങ്ങളുടെ ഭാഷ"
            },
            vendorLanguage: {
                en: "Vendor's Language",
                hi: "विक्रेता की भाषा",
                te: "విక్రేత భాష",
                ta: "விற்பனையாளரின் மொழி",
                kn: "ಮಾರಾಟಗಾರರ ಭಾಷೆ",
                ml: "വിൽപ്പനക്കാരന്റെ ഭാഷ"
            },
            speakingAs: {
                en: "Speaking as:",
                hi: "बोल रहे हैं:",
                te: "మాట్లాడుతున్నారు:",
                ta: "பேசுகிறது:",
                kn: "ಮಾತನಾಡುತ್ತಿದ್ದಾರೆ:",
                ml: "സംസാരിക്കുന്നു:"
            },
            user: {
                en: "You",
                hi: "आप",
                te: "మీరు",
                ta: "நீங்கள்",
                kn: "ನೀವು",
                ml: "നിങ്ങൾ"
            },
            vendor: {
                en: "Vendor",
                hi: "विक्रेता",
                te: "విక్రేత",
                ta: "விற்பனையாளர்",
                kn: "ಮಾರಾಟಗಾರ",
                ml: "വിൽപ്പനക്കാരൻ"
            },
            typeMessage: {
                en: "Type your message...",
                hi: "अपना संदेश लिखें...",
                te: "మీ సందేశాన్ని టైప్ చేయండి...",
                ta: "உங்கள் செய்தியை தட்டச்சு செய்யவும்...",
                kn: "ನಿಮ್ಮ ಸಂದೇಶವನ್ನು ಟೈಪ್ ಮಾಡಿ...",
                ml: "നിങ്ങളുടെ സന്ദേശം ടൈപ്പ് ചെയ്യുക..."
            },
            send: {
                en: "Send",
                hi: "भेजें",
                te: "పంపండి",
                ta: "அனுப்பு",
                kn: "ಕಳುಹಿಸಿ",
                ml: "അയയ്ക്കുക"
            },
            translatedTo: {
                en: "Translated to",
                hi: "अनुवाद किया गया",
                te: "అనువదించబడింది",
                ta: "மொழிபெயர்க்கப்பட்டது",
                kn: "ಅನುವಾದಿಸಲಾಗಿದೆ",
                ml: "വിവർത്തനം ചെയ്തു"
            },
            noMessages: {
                en: "No messages yet. Start a conversation!",
                hi: "अभी तक कोई संदेश नहीं। बातचीत शुरू करें!",
                te: "ఇంకా సందేశాలు లేవు. సంభాషణ ప్రారంభించండి!",
                ta: "இன்னும் செய்திகள் இல்லை. உரையாடலைத் தொடங்குங்கள்!",
                kn: "ಇನ್ನೂ ಸಂದೇಶಗಳಿಲ್ಲ. ಸಂಭಾಷಣೆ ಪ್ರಾರಂಭಿಸಿ!",
                ml: "ഇതുവരെ സന്ദേശങ്ങളൊന്നുമില്ല. സംഭാഷണം ആരംഭിക്കൂ!"
            }
        };
        return texts[key]?.[language] || texts[key]?.en || key;
    };

    const getLanguageName = (code) => {
        const names = {
            'en': 'English',
            'hi': 'हिंदी',
            'te': 'తెలుగు',
            'ta': 'தமிழ்',
            'kn': 'ಕನ್ನಡ',
            'ml': 'മലയാളം'
        };
        return names[code] || code;
    };

    return (
        <div className="p-4" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
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
                marginBottom: '15px',
                fontSize: '2.5rem',
                color: '#000000',
                fontWeight: 'bold',
                textShadow: '2px 2px 8px rgba(255, 255, 255, 0.9), -2px -2px 8px rgba(255, 255, 255, 0.9), 2px -2px 8px rgba(255, 255, 255, 0.9), -2px 2px 8px rgba(255, 255, 255, 0.9)'
            }}>{getText('title')}</h2>

            {/* Language Selection */}
            <div className="artistic-card" style={{ marginBottom: '15px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '0.9rem' }}>
                            {getText('yourLanguage')}
                        </label>
                        <select
                            value={userLanguage}
                            onChange={(e) => setUserLanguage(e.target.value)}
                            style={{ width: '100%', padding: '10px', fontSize: '1rem', borderRadius: '6px' }}
                        >
                            <option value="en">English</option>
                            <option value="hi">हिंदी</option>
                            <option value="te">తెలుగు</option>
                            <option value="ta">தமிழ்</option>
                            <option value="kn">ಕನ್ನಡ</option>
                            <option value="ml">മലയാളം</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '0.9rem' }}>
                            {getText('vendorLanguage')}
                        </label>
                        <select
                            value={vendorLanguage}
                            onChange={(e) => setVendorLanguage(e.target.value)}
                            style={{ width: '100%', padding: '10px', fontSize: '1rem', borderRadius: '6px' }}
                        >
                            <option value="en">English</option>
                            <option value="hi">हिंदी</option>
                            <option value="te">తెలుగు</option>
                            <option value="ta">தமிழ்</option>
                            <option value="kn">ಕನ್ನಡ</option>
                            <option value="ml">മലയാളം</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Speaker Toggle */}
            <div style={{ marginBottom: '15px' }}>
                <div style={{ textAlign: 'center', marginBottom: '10px', fontSize: '0.9rem', fontWeight: 'bold' }}>
                    {getText('speakingAs')}
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={() => setCurrentSpeaker('user')}
                        className="btn-paint"
                        style={{
                            flex: 1,
                            background: currentSpeaker === 'user' ? 'var(--color-indigo)' : 'var(--color-earth)',
                            color: 'white',
                            padding: '12px'
                        }}
                    >
                        👤 {getText('user')}
                    </button>
                    <button
                        onClick={() => setCurrentSpeaker('vendor')}
                        className="btn-paint"
                        style={{
                            flex: 1,
                            background: currentSpeaker === 'vendor' ? 'var(--color-saffron)' : 'var(--color-earth)',
                            color: 'white',
                            padding: '12px'
                        }}
                    >
                        🏪 {getText('vendor')}
                    </button>
                </div>
            </div>

            {/* Chat Messages */}
            <div 
                className="artistic-card" 
                style={{ 
                    flex: 1, 
                    overflowY: 'auto', 
                    marginBottom: '15px',
                    minHeight: '300px',
                    maxHeight: '400px',
                    background: 'var(--color-cream)'
                }}
            >
                {messages.length === 0 ? (
                    <div style={{ textAlign: 'center', color: 'var(--color-earth)', padding: '40px 20px' }}>
                        {getText('noMessages')}
                    </div>
                ) : (
                    messages.map((msg, index) => (
                        <div 
                            key={index} 
                            style={{ 
                                marginBottom: '15px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: msg.speaker === 'user' ? 'flex-end' : 'flex-start'
                            }}
                        >
                            {/* Original Message */}
                            <div 
                                style={{
                                    background: msg.speaker === 'user' ? 'var(--color-indigo)' : 'var(--color-saffron)',
                                    color: 'white',
                                    padding: '10px 15px',
                                    borderRadius: '12px',
                                    maxWidth: '80%',
                                    marginBottom: '5px'
                                }}
                            >
                                <div style={{ fontSize: '0.75rem', opacity: 0.9, marginBottom: '3px' }}>
                                    {msg.speaker === 'user' ? getText('user') : getText('vendor')} ({getLanguageName(msg.originalLang)})
                                </div>
                                <div style={{ fontSize: '1rem' }}>{msg.originalText}</div>
                            </div>

                            {/* Translated Message */}
                            <div 
                                style={{
                                    background: msg.speaker === 'user' ? 'rgba(63, 81, 181, 0.1)' : 'rgba(255, 152, 0, 0.1)',
                                    color: 'var(--color-earth)',
                                    padding: '8px 12px',
                                    borderRadius: '10px',
                                    maxWidth: '80%',
                                    border: `1px solid ${msg.speaker === 'user' ? 'var(--color-indigo)' : 'var(--color-saffron)'}`
                                }}
                            >
                                <div style={{ fontSize: '0.7rem', opacity: 0.7, marginBottom: '2px' }}>
                                    {getText('translatedTo')} {getLanguageName(msg.translatedLang)}
                                </div>
                                <div style={{ fontSize: '0.95rem' }}>{msg.translatedText}</div>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Info Note */}
            <div style={{ 
                background: 'var(--color-turmeric-light)', 
                padding: '10px', 
                borderRadius: '6px', 
                marginBottom: '10px',
                border: '1px solid var(--color-saffron)',
                fontSize: '0.8rem'
            }}>
                <strong>ℹ️ Note:</strong> Voice input works best with <strong>English</strong> and <strong>Hindi</strong>. 
                For other languages, use text input or click the keyboard button (⌨️).
            </div>

            {/* Input Area */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                <button
                    onClick={startListening}
                    disabled={isListening || isTranslating}
                    className="btn-paint"
                    style={{
                        padding: '15px 20px',
                        fontSize: '1.5rem',
                        background: isListening ? 'var(--color-green)' : 'var(--color-saffron)',
                        minWidth: '60px'
                    }}
                >
                    {isListening ? '🎤' : '🎤'}
                </button>

                {shouldShowKeyboard() && (
                    <button
                        onClick={() => setShowKeyboard(!showKeyboard)}
                        className="btn-paint"
                        style={{
                            padding: '15px 20px',
                            fontSize: '1.5rem',
                            background: showKeyboard ? 'var(--color-indigo)' : 'var(--color-earth)',
                            minWidth: '60px'
                        }}
                    >
                        ⌨️
                    </button>
                )}

                <textarea
                    value={inputText}
                    onChange={(e) => {
                        setInputText(e.target.value);
                        if (keyboardRef.current) {
                            keyboardRef.current.setInput(e.target.value);
                        }
                    }}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                        }
                    }}
                    placeholder={getText('typeMessage')}
                    style={{
                        flex: 1,
                        padding: '12px',
                        fontSize: '1rem',
                        borderRadius: '8px',
                        border: '2px solid var(--color-earth)',
                        minHeight: '50px',
                        maxHeight: '100px',
                        resize: 'vertical'
                    }}
                />

                <button
                    onClick={() => handleSendMessage()}
                    disabled={!inputText.trim() || isTranslating}
                    className="btn-paint"
                    style={{
                        padding: '15px 25px',
                        background: 'var(--color-indigo)',
                        color: 'white',
                        minWidth: '80px'
                    }}
                >
                    {isTranslating ? '...' : getText('send')}
                </button>
            </div>

            {/* Virtual Keyboard */}
            {showKeyboard && shouldShowKeyboard() && (
                <div style={{ marginTop: '15px' }}>
                    <Keyboard
                        keyboardRef={r => (keyboardRef.current = r)}
                        layout={getKeyboardLayout()}
                        onChange={onKeyboardChange}
                        onKeyPress={onKeyPress}
                        theme="hg-theme-default hg-layout-default"
                        display={{
                            '{bksp}': '⌫',
                            '{space}': 'Space'
                        }}
                        buttonTheme={[
                            {
                                class: "hg-functionBtn",
                                buttons: "{bksp} {space}"
                            }
                        ]}
                    />
                </div>
            )}
        </div>
    );
}
