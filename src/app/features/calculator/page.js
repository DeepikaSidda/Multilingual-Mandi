
"use client";
import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/language-context';
import { VoiceService } from '@/lib/aws-services';
import Link from 'next/link';

export default function Calculator() {
    const { t, language, setLanguage } = useLanguage();
    const [pricePerKg, setPricePerKg] = useState('');
    const [weight, setWeight] = useState('');
    const [unit, setUnit] = useState('kg');
    const [itemName, setItemName] = useState('');
    const [voiceInput, setVoiceInput] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [discount, setDiscount] = useState(0);
    const [items, setItems] = useState([]);
    const [history, setHistory] = useState([]);

    // Set background image for this page
    useEffect(() => {
        document.body.style.backgroundImage = "url('/indian_village_market_tree_1769918608823.png')";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundAttachment = "fixed";
        document.body.style.backgroundPosition = "center";
        return () => {
            document.body.style.backgroundImage = "url('/bg-market.png')";
        };
    }, []);

    const getText = (key) => {
        const texts = {
            title: {
                en: "Smart Calculator",
                hi: "स्मार्ट कैलकुलेटर",
                te: "స్మార్ట్ కాలిక్యులేటర్",
                ta: "ஸ்மார்ட் கால்குலேட்டர்",
                kn: "ಸ್ಮಾರ್ಟ್ ಕ್ಯಾಲ್ಕುಲೇಟರ್",
                ml: "സ്മാർട്ട് കാൽക്കുലേറ്റർ"
            },
            priceLabel: {
                en: "Price (₹/kg)",
                hi: "मूल्य (₹/किलो)",
                te: "ధర (₹/కిలో)",
                ta: "விலை (₹/கிலோ)",
                kn: "ಬೆಲೆ (₹/ಕೆಜಿ)",
                ml: "വില (₹/കിലോ)"
            },
            weightLabel: {
                en: "Weight",
                hi: "वजन",
                te: "బరువు",
                ta: "எடை",
                kn: "ತೂಕ",
                ml: "ഭാരം"
            },
            itemName: {
                en: "Item Name (Optional)",
                hi: "वस्तु का नाम (वैकल्पिक)",
                te: "వస్తువు పేరు (ఐచ్ఛికం)",
                ta: "பொருள் பெயர் (விருப்பமானது)",
                kn: "ವಸ್ತುವಿನ ಹೆಸರು (ಐಚ್ಛಿಕ)",
                ml: "ഇനത്തിന്റെ പേര് (ഓപ്ഷണൽ)"
            },
            grams: {
                en: "grams",
                hi: "ग्राम",
                te: "గ్రాములు",
                ta: "கிராம்",
                kn: "ಗ್ರಾಂ",
                ml: "ഗ്രാം"
            },
            totalAmount: {
                en: "Total Amount",
                hi: "कुल राशि",
                te: "మొత్తం మొత్తం",
                ta: "மொத்த தொகை",
                kn: "ಒಟ್ಟು ಮೊತ್ತ",
                ml: "ആകെ തുക"
            },
            voiceInput: {
                en: "Voice Input",
                hi: "आवाज इनपुट",
                te: "వాయిస్ ఇన్‌పుట్",
                ta: "குரல் உள்ளீடு",
                kn: "ಧ್ವನಿ ಇನ್‌ಪುಟ್",
                ml: "വോയ്സ് ഇൻപുട്ട്"
            },
            voiceHint: {
                en: "Say: '10 kilos at 28 rupees'",
                hi: "बोलें: '10 किलो 28 रुपये में'",
                te: "చెప్పండి: '10 కిలోలు 28 రూపాయలు'",
                ta: "சொல்லுங்கள்: '10 கிலோ 28 ரூபாய்'",
                kn: "ಹೇಳಿ: '10 ಕಿಲೋ 28 ರೂಪಾಯಿ'",
                ml: "പറയൂ: '10 കിലോ 28 രൂപ'"
            },
            bulkDiscount: {
                en: "Bulk Discount",
                hi: "थोक छूट",
                te: "బల్క్ డిస్కౌంట్",
                ta: "மொத்த தள்ளுபடி",
                kn: "ಬೃಹತ್ ರಿಯಾಯಿತಿ",
                ml: "ബൾക്ക് കിഴിവ്"
            },
            subtotal: {
                en: "Subtotal",
                hi: "उप-योग",
                te: "ఉప మొత్తం",
                ta: "துணை மொத்தம்",
                kn: "ಉಪ ಮೊತ್ತ",
                ml: "ഉപ ആകെ"
            },
            finalAmount: {
                en: "Final Amount",
                hi: "अंतिम राशि",
                te: "చివరి మొత్తం",
                ta: "இறுதி தொகை",
                kn: "ಅಂತಿಮ ಮೊತ್ತ",
                ml: "അവസാന തുക"
            },
            addItem: {
                en: "Add Item",
                hi: "वस्तु जोड़ें",
                te: "వస్తువు జోడించండి",
                ta: "பொருளைச் சேர்க்கவும்",
                kn: "ವಸ್ತು ಸೇರಿಸಿ",
                ml: "ഇനം ചേർക്കുക"
            },
            cartItems: {
                en: "Cart Items",
                hi: "कार्ट आइटम",
                te: "కార్ట్ వస్తువులు",
                ta: "வண்டி பொருட்கள்",
                kn: "ಕಾರ್ಟ್ ವಸ್ತುಗಳು",
                ml: "കാർട്ട് ഇനങ്ങൾ"
            },
            grandTotal: {
                en: "Grand Total",
                hi: "कुल योग",
                te: "గ్రాండ్ టోటల్",
                ta: "மொத்த தொகை",
                kn: "ಗ್ರಾಂಡ್ ಟೋಟಲ್",
                ml: "ഗ്രാൻഡ് ടോട്ടൽ"
            },
            clearCart: {
                en: "Clear Cart",
                hi: "कार्ट साफ़ करें",
                te: "కార్ట్ క్లియర్ చేయండి",
                ta: "வண்டியை அழிக்கவும்",
                kn: "ಕಾರ್ಟ್ ತೆರವುಗೊಳಿಸಿ",
                ml: "കാർട്ട് മായ്ക്കുക"
            },
            quickCalc: {
                en: "Quick Calculations",
                hi: "त्वरित गणना",
                te: "త్వరిత లెక్కలు",
                ta: "விரைவு கணக்கீடுகள்",
                kn: "ತ್ವರಿತ ಲೆಕ್ಕಾಚಾರಗಳು",
                ml: "പെട്ടെന്നുള്ള കണക്കുകൂട്ടലുകൾ"
            }
        };
        return texts[key]?.[language] || texts[key]?.en || key;
    };

    // Calculate bulk discount
    useEffect(() => {
        const w = parseFloat(weight) || 0;
        const weightInKg = unit === 'kg' ? w : w / 1000;
        
        if (weightInKg >= 50) {
            setDiscount(10);
        } else if (weightInKg >= 20) {
            setDiscount(5);
        } else if (weightInKg >= 10) {
            setDiscount(2);
        } else {
            setDiscount(0);
        }
    }, [weight, unit]);

    // Parse voice input
    const parseVoiceInput = (text) => {
        const lowerText = text.toLowerCase();
        const numbers = lowerText.match(/\d+/g);
        if (!numbers || numbers.length < 2) return;

        const [weightNum, priceNum] = numbers.map(n => parseFloat(n));
        
        if (lowerText.includes('kilo') || lowerText.includes('kg')) {
            setUnit('kg');
            setWeight(weightNum.toString());
        } else if (lowerText.includes('gram') || lowerText.includes('g')) {
            setUnit('g');
            setWeight(weightNum.toString());
        } else {
            setUnit('kg');
            setWeight(weightNum.toString());
        }
        
        setPricePerKg(priceNum.toString());
    };

    const startVoiceInput = () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert('Voice input not supported in this browser');
            return;
        }

        const recognition = new webkitSpeechRecognition();
        recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
            setIsListening(true);
            setVoiceInput('Listening...');
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setVoiceInput(transcript);
            parseVoiceInput(transcript);
        };

        recognition.onerror = () => {
            setIsListening(false);
            setVoiceInput('Error. Please try again.');
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.start();
    };

    const subtotal = (() => {
        const p = parseFloat(pricePerKg) || 0;
        const w = parseFloat(weight) || 0;
        if (unit === 'kg') return p * w;
        return (p * w) / 1000;
    })();

    const discountAmount = (subtotal * discount) / 100;
    const total = subtotal - discountAmount;

    const addItemToCart = () => {
        if (!pricePerKg || !weight) {
            alert('Please enter price and weight');
            return;
        }

        const newItem = {
            id: Date.now(),
            name: itemName || `Item ${items.length + 1}`,
            price: parseFloat(pricePerKg),
            weight: parseFloat(weight),
            unit,
            subtotal,
            discount,
            discountAmount,
            total
        };

        setItems([...items, newItem]);
        
        // Clear form
        setItemName('');
        setPricePerKg('');
        setWeight('');
        setDiscount(0);
        setVoiceInput('');
    };

    const removeItem = (id) => {
        setItems(items.filter(item => item.id !== id));
    };

    const clearCart = () => {
        if (items.length > 0) {
            setHistory([...history, { items, grandTotal, timestamp: new Date() }]);
        }
        setItems([]);
    };

    const grandTotal = items.reduce((sum, item) => sum + item.total, 0);

    const speakTotal = async () => {
        const amount = items.length > 0 ? grandTotal : total;
        const text = `${getText('finalAmount')} ${Math.round(amount)} ${language === 'en' ? 'rupees' : language === 'hi' ? 'रुपये' : language === 'te' ? 'రూపాయలు' : language === 'ta' ? 'ரூபாய்' : language === 'kn' ? 'ರೂಪಾಯಿ' : 'രൂപ'}`;
        const audioUrl = await VoiceService.speak(text, language);
        if (audioUrl) {
            new Audio(audioUrl).play();
        }
    };

    // Quick calculation presets
    const quickCalcs = [
        { weight: 1, unit: 'kg', label: '1 kg' },
        { weight: 5, unit: 'kg', label: '5 kg' },
        { weight: 10, unit: 'kg', label: '10 kg' },
        { weight: 500, unit: 'g', label: '500g' }
    ];

    const applyQuickCalc = (calc) => {
        setWeight(calc.weight.toString());
        setUnit(calc.unit);
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
                {/* Voice Input Section */}
                <div style={{ marginBottom: '20px', padding: '15px', background: '#e3f2fd', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                        <button
                            onClick={startVoiceInput}
                            disabled={isListening}
                            className="btn-paint"
                            style={{
                                background: isListening ? 'var(--color-saffron)' : 'var(--color-indigo)',
                                color: 'white',
                                padding: '12px 20px',
                                fontSize: '1.2rem'
                            }}
                        >
                            🎤 {getText('voiceInput')}
                        </button>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#666', fontStyle: 'italic' }}>
                        {getText('voiceHint')}
                    </div>
                    {voiceInput && (
                        <div style={{ marginTop: '10px', padding: '10px', background: 'white', borderRadius: '5px', fontSize: '0.9rem' }}>
                            "{voiceInput}"
                        </div>
                    )}
                </div>

                {/* Item Name */}
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '0.9rem' }}>{getText('itemName')}</label>
                    <input
                        type="text"
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                        placeholder="Tomato, Onion, etc."
                        style={{ width: '100%', fontSize: '1rem', padding: '10px', borderRadius: '8px', border: '2px solid var(--color-earth)' }}
                    />
                </div>

                {/* Price */}
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>{getText('priceLabel')}</label>
                    <input
                        type="number"
                        value={pricePerKg}
                        onChange={(e) => setPricePerKg(e.target.value)}
                        placeholder="50"
                        style={{ width: '100%', fontSize: '2rem', padding: '10px', borderRadius: '8px', border: '2px solid var(--color-earth)' }}
                    />
                </div>

                {/* Weight with Quick Calc */}
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>{getText('weightLabel')}</label>
                    
                    {/* Quick Calc Buttons */}
                    <div style={{ display: 'flex', gap: '5px', marginBottom: '10px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.85rem', color: '#666', width: '100%', marginBottom: '5px' }}>{getText('quickCalc')}:</span>
                        {quickCalcs.map((calc, idx) => (
                            <button
                                key={idx}
                                onClick={() => applyQuickCalc(calc)}
                                className="btn-paint"
                                style={{
                                    padding: '8px 12px',
                                    fontSize: '0.85rem',
                                    background: 'var(--color-turmeric-light)',
                                    border: '2px solid var(--color-turmeric)'
                                }}
                            >
                                {calc.label}
                            </button>
                        ))}
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input
                            type="number"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            placeholder="10"
                            style={{ flex: 1, fontSize: '2rem', padding: '10px', borderRadius: '8px', border: '2px solid var(--color-earth)' }}
                        />
                        <select
                            value={unit}
                            onChange={(e) => setUnit(e.target.value)}
                            style={{ fontSize: '1.5rem', padding: '10px', background: 'var(--color-saffron)', color: 'white', border: 'none', borderRadius: '8px', minWidth: '100px' }}
                        >
                            <option value="kg">kg</option>
                            <option value="g">{getText('grams')}</option>
                        </select>
                    </div>
                </div>

                {/* Calculation Breakdown */}
                {pricePerKg && weight && (
                    <div style={{ background: 'var(--color-cream)', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '1.1rem' }}>
                            <span>{getText('subtotal')}:</span>
                            <span style={{ fontWeight: 'bold' }}>₹{subtotal.toFixed(2)}</span>
                        </div>
                        
                        {discount > 0 && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '1.1rem', color: 'var(--color-green)' }}>
                                <span>{getText('bulkDiscount')} ({discount}%):</span>
                                <span style={{ fontWeight: 'bold' }}>-₹{discountAmount.toFixed(2)}</span>
                            </div>
                        )}
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.3rem', fontWeight: 'bold', borderTop: '2px solid var(--color-earth)', paddingTop: '10px' }}>
                            <span>{getText('finalAmount')}:</span>
                            <span style={{ color: 'var(--color-indigo)' }}>₹{Math.round(total)}</span>
                        </div>
                    </div>
                )}

                {/* Add to Cart Button */}
                <button
                    onClick={addItemToCart}
                    className="btn-paint"
                    style={{
                        width: '100%',
                        background: 'var(--color-green)',
                        color: 'white',
                        padding: '15px',
                        fontSize: '1.1rem',
                        marginBottom: '15px'
                    }}
                >
                    ➕ {getText('addItem')}
                </button>

                {/* Cart Items */}
                {items.length > 0 && (
                    <div style={{ marginTop: '20px', padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <h3 style={{ margin: 0 }}>{getText('cartItems')} ({items.length})</h3>
                            <button
                                onClick={clearCart}
                                className="btn-paint"
                                style={{
                                    padding: '8px 15px',
                                    fontSize: '0.9rem',
                                    background: '#ff5252',
                                    color: 'white'
                                }}
                            >
                                🗑️ {getText('clearCart')}
                            </button>
                        </div>

                        {items.map((item) => (
                            <div key={item.id} style={{ background: 'white', padding: '12px', borderRadius: '8px', marginBottom: '10px', border: '2px solid var(--color-earth)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '5px' }}>{item.name}</div>
                                        <div style={{ fontSize: '0.9rem', color: '#666' }}>
                                            ₹{item.price}/kg × {item.weight}{item.unit}
                                            {item.discount > 0 && <span style={{ color: 'var(--color-green)', marginLeft: '10px' }}>(-{item.discount}%)</span>}
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--color-indigo)' }}>₹{Math.round(item.total)}</div>
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            style={{ fontSize: '0.8rem', color: '#ff5252', background: 'none', border: 'none', cursor: 'pointer', marginTop: '5px' }}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Grand Total */}
                        <div style={{ background: 'var(--color-indigo)', color: 'white', padding: '20px', borderRadius: '10px', textAlign: 'center', marginTop: '15px' }}>
                            <div style={{ fontSize: '1.2rem', marginBottom: '10px' }}>{getText('grandTotal')}</div>
                            <div style={{ fontSize: '3.5rem', fontWeight: 'bold', marginBottom: '15px' }}>₹{Math.round(grandTotal)}</div>
                            <button
                                onClick={speakTotal}
                                className="btn-paint"
                                style={{
                                    background: 'white',
                                    color: 'var(--color-indigo)',
                                    padding: '10px 20px',
                                    fontSize: '1rem'
                                }}
                            >
                                🔊 Speak Total
                            </button>
                        </div>
                    </div>
                )}

                {/* Single Item Total (when no cart items) */}
                {items.length === 0 && pricePerKg && weight && (
                    <div style={{ background: 'var(--color-indigo)', color: 'white', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
                        <div style={{ fontSize: '1.2rem', marginBottom: '10px' }}>{getText('finalAmount')}</div>
                        <div style={{ fontSize: '3.5rem', fontWeight: 'bold', marginBottom: '15px' }}>₹{Math.round(total)}</div>
                        <button
                            onClick={speakTotal}
                            className="btn-paint"
                            style={{
                                background: 'white',
                                color: 'var(--color-indigo)',
                                padding: '10px 20px',
                                fontSize: '1rem'
                            }}
                        >
                            🔊 Speak Total
                        </button>
                    </div>
                )}

                {/* Bulk Discount Info */}
                {discount === 0 && parseFloat(weight) > 0 && items.length === 0 && (
                    <div style={{ marginTop: '15px', padding: '10px', background: '#fff9c4', borderRadius: '8px', fontSize: '0.9rem', textAlign: 'center' }}>
                        💡 Buy 10kg+ for 2% off, 20kg+ for 5% off, 50kg+ for 10% off!
                    </div>
                )}
            </div>
        </div>
    );
}
