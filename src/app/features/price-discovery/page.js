
"use client";
import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/language-context';
import { VoiceService, TranslationService } from '@/lib/aws-services';
import Link from 'next/link';

export default function PriceDiscovery() {
    const { t, language, setLanguage } = useLanguage();
    const [commodity, setCommodity] = useState('tomato');
    const [location, setLocation] = useState('bangalore');
    const [quantity, setQuantity] = useState('10');
    const [priceData, setPriceData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Set background image for this page
    useEffect(() => {
        document.body.style.backgroundImage = "url('/indian_veg_pushcart_1769918988085.png')";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundAttachment = "fixed";
        document.body.style.backgroundPosition = "center";
        return () => {
            document.body.style.backgroundImage = "url('/bg-market.png')";
        };
    }, []);

    const checkPrice = async () => {
        setLoading(true);
        setError(null);
        
        try {
            // Call our API route to get price data
            const response = await fetch('/api/price-discovery', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    commodity,
                    location,
                    quantity,
                    language
                })
            });

            if (!response.ok) {
                throw new Error('Failed to fetch price data');
            }

            const data = await response.json();
            setPriceData(data);

            // Speak the result
            const audioUrl = await VoiceService.speak(data.spokenText, language);
            if (audioUrl) {
                new Audio(audioUrl).play();
            }
        } catch (err) {
            console.error('Price discovery error:', err);
            setError('Unable to fetch price data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

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
            commodity: {
                en: "Select Commodity",
                hi: "वस्तु चुनें",
                te: "వస్తువును ఎంచుకోండి",
                ta: "பொருளைத் தேர்ந்தெடுக்கவும்",
                kn: "ಸರಕು ಆಯ್ಕೆಮಾಡಿ",
                ml: "ചരക്ക് തിരഞ്ഞെടുക്കുക"
            },
            location: {
                en: "Location",
                hi: "स्थान",
                te: "స్థానం",
                ta: "இடம்",
                kn: "ಸ್ಥಳ",
                ml: "സ്ഥലം"
            },
            quantity: {
                en: "Quantity (kg)",
                hi: "मात्रा (किलो)",
                te: "పరిమాణం (కిలో)",
                ta: "அளவு (கிலோ)",
                kn: "ಪ್ರಮಾಣ (ಕೆಜಿ)",
                ml: "അളവ് (കിലോ)"
            },
            checkPrice: {
                en: "Check Fair Price",
                hi: "सही भाव देखें",
                te: "సరైన ధర తనిఖీ చేయండి",
                ta: "சரியான விலையைச் சரிபார்க்கவும்",
                kn: "ಸರಿಯಾದ ಬೆಲೆ ಪರಿಶೀಲಿಸಿ",
                ml: "ശരിയായ വില പരിശോധിക്കുക"
            },
            avgPrice: {
                en: "Average Market Price",
                hi: "औसत बाजार भाव",
                te: "సగటు మార్కెట్ ధర",
                ta: "சராசரி சந்தை விலை",
                kn: "ಸರಾಸರಿ ಮಾರುಕಟ್ಟೆ ಬೆಲೆ",
                ml: "ശരാശരി വിപണി വില"
            },
            suggestedPrice: {
                en: "Suggested Fair Price",
                hi: "सुझाया गया सही भाव",
                te: "సూచించిన సరైన ధర",
                ta: "பரிந்துரைக்கப்பட்ட சரியான விலை",
                kn: "ಸೂಚಿಸಲಾದ ಸರಿಯಾದ ಬೆಲೆ",
                ml: "നിർദ്ദേശിച്ച ശരിയായ വില"
            },
            totalPrice: {
                en: "Total Price",
                hi: "कुल भाव",
                te: "మొత్తం ధర",
                ta: "மொத்த விலை",
                kn: "ಒಟ್ಟು ಬೆಲೆ",
                ml: "മൊത്തം വില"
            },
            forQuantity: {
                en: "for",
                hi: "के लिए",
                te: "కోసం",
                ta: "க்கு",
                kn: "ಗಾಗಿ",
                ml: "ന്"
            },
            explanation: {
                en: "Explanation",
                hi: "व्याख्या",
                te: "వివరణ",
                ta: "விளக்கம்",
                kn: "ವಿವರಣೆ",
                ml: "വിശദീകരണം"
            }
        };
        return texts[key]?.[language] || texts[key]?.en || key;
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
                        <optgroup label="Vegetables">
                            <option value="tomato">🍅 Tomato</option>
                            <option value="onion">🧅 Onion</option>
                            <option value="potato">🥔 Potato</option>
                            <option value="carrot">🥕 Carrot</option>
                            <option value="cabbage">🥬 Cabbage</option>
                            <option value="cauliflower">🥦 Cauliflower</option>
                            <option value="brinjal">🍆 Brinjal (Eggplant)</option>
                            <option value="ladyfinger">Lady Finger (Okra)</option>
                            <option value="capsicum">🫑 Capsicum</option>
                            <option value="cucumber">🥒 Cucumber</option>
                            <option value="pumpkin">🎃 Pumpkin</option>
                            <option value="beetroot">Beetroot</option>
                            <option value="radish">Radish</option>
                            <option value="beans">Beans</option>
                            <option value="peas">Peas</option>
                            <option value="spinach">🥬 Spinach</option>
                            <option value="coriander">🌿 Coriander Leaves</option>
                            <option value="ginger">Ginger</option>
                            <option value="garlic">🧄 Garlic</option>
                            <option value="greenchilli">🌶️ Green Chilli</option>
                        </optgroup>
                        <optgroup label="Fruits">
                            <option value="apple">🍎 Apple</option>
                            <option value="banana">🍌 Banana</option>
                            <option value="mango">🥭 Mango</option>
                            <option value="orange">🍊 Orange</option>
                            <option value="grapes">🍇 Grapes</option>
                            <option value="pomegranate">Pomegranate</option>
                            <option value="papaya">Papaya</option>
                            <option value="watermelon">🍉 Watermelon</option>
                            <option value="pineapple">🍍 Pineapple</option>
                            <option value="guava">Guava</option>
                            <option value="lemon">🍋 Lemon</option>
                        </optgroup>
                        <optgroup label="Grains & Pulses">
                            <option value="rice">🍚 Rice</option>
                            <option value="wheat">🌾 Wheat</option>
                            <option value="maize">🌽 Maize (Corn)</option>
                            <option value="bajra">Bajra (Pearl Millet)</option>
                            <option value="jowar">Jowar (Sorghum)</option>
                            <option value="ragi">Ragi (Finger Millet)</option>
                            <option value="tur">Tur Dal (Pigeon Pea)</option>
                            <option value="moong">Moong Dal (Green Gram)</option>
                            <option value="urad">Urad Dal (Black Gram)</option>
                            <option value="masoor">Masoor Dal (Red Lentil)</option>
                            <option value="chana">Chana (Chickpea)</option>
                        </optgroup>
                        <optgroup label="Spices & Others">
                            <option value="turmeric">Turmeric</option>
                            <option value="redchilli">🌶️ Red Chilli</option>
                            <option value="corianderseed">Coriander Seed</option>
                            <option value="cumin">Cumin</option>
                            <option value="blackpepper">Black Pepper</option>
                            <option value="cardamom">Cardamom</option>
                            <option value="coconut">🥥 Coconut</option>
                            <option value="groundnut">🥜 Groundnut (Peanut)</option>
                            <option value="soyabean">Soyabean</option>
                            <option value="cotton">Cotton</option>
                            <option value="sugarcane">🎋 Sugarcane</option>
                        </optgroup>
                    </select>
                </div>

                {/* Location Selection */}
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                        {getText('location')}
                    </label>
                    <select
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        style={{ width: '100%', padding: '12px', fontSize: '1rem', borderRadius: '8px' }}
                    >
                        <optgroup label="South India">
                            <option value="bangalore">Bangalore (Karnataka)</option>
                            <option value="mysore">Mysore (Karnataka)</option>
                            <option value="mangalore">Mangalore (Karnataka)</option>
                            <option value="hubli">Hubli (Karnataka)</option>
                            <option value="belgaum">Belgaum (Karnataka)</option>
                            <option value="davangere">Davangere (Karnataka)</option>
                            <option value="bellary">Bellary (Karnataka)</option>
                            <option value="gulbarga">Gulbarga (Karnataka)</option>
                            <option value="tumkur">Tumkur (Karnataka)</option>
                            <option value="shimoga">Shimoga (Karnataka)</option>
                            
                            <option value="hyderabad">Hyderabad (Telangana)</option>
                            <option value="warangal">Warangal (Telangana)</option>
                            <option value="nizamabad">Nizamabad (Telangana)</option>
                            <option value="karimnagar">Karimnagar (Telangana)</option>
                            <option value="khammam">Khammam (Telangana)</option>
                            <option value="mahbubnagar">Mahbubnagar (Telangana)</option>
                            <option value="nalgonda">Nalgonda (Telangana)</option>
                            <option value="adilabad">Adilabad (Telangana)</option>
                            
                            <option value="vijayawada">Vijayawada (Andhra Pradesh)</option>
                            <option value="visakhapatnam">Visakhapatnam (Andhra Pradesh)</option>
                            <option value="guntur">Guntur (Andhra Pradesh)</option>
                            <option value="nellore">Nellore (Andhra Pradesh)</option>
                            <option value="kurnool">Kurnool (Andhra Pradesh)</option>
                            <option value="kakinada">Kakinada (Andhra Pradesh)</option>
                            <option value="rajahmundry">Rajahmundry (Andhra Pradesh)</option>
                            <option value="tirupati">Tirupati (Andhra Pradesh)</option>
                            <option value="anantapur">Anantapur (Andhra Pradesh)</option>
                            <option value="kadapa">Kadapa (Andhra Pradesh)</option>
                            <option value="eluru">Eluru (Andhra Pradesh)</option>
                            <option value="ongole">Ongole (Andhra Pradesh)</option>
                            
                            <option value="chennai">Chennai (Tamil Nadu)</option>
                            <option value="coimbatore">Coimbatore (Tamil Nadu)</option>
                            <option value="madurai">Madurai (Tamil Nadu)</option>
                            <option value="tiruchirappalli">Tiruchirappalli (Tamil Nadu)</option>
                            <option value="salem">Salem (Tamil Nadu)</option>
                            <option value="tirunelveli">Tirunelveli (Tamil Nadu)</option>
                            <option value="erode">Erode (Tamil Nadu)</option>
                            <option value="vellore">Vellore (Tamil Nadu)</option>
                            <option value="thoothukudi">Thoothukudi (Tamil Nadu)</option>
                            <option value="thanjavur">Thanjavur (Tamil Nadu)</option>
                            <option value="dindigul">Dindigul (Tamil Nadu)</option>
                            <option value="kanchipuram">Kanchipuram (Tamil Nadu)</option>
                            <option value="karur">Karur (Tamil Nadu)</option>
                            
                            <option value="kochi">Kochi (Kerala)</option>
                            <option value="thiruvananthapuram">Thiruvananthapuram (Kerala)</option>
                        </optgroup>
                        <optgroup label="West India">
                            <option value="mumbai">Mumbai (Maharashtra)</option>
                            <option value="pune">Pune (Maharashtra)</option>
                            <option value="ahmedabad">Ahmedabad (Gujarat)</option>
                            <option value="surat">Surat (Gujarat)</option>
                            <option value="nagpur">Nagpur (Maharashtra)</option>
                            <option value="nashik">Nashik (Maharashtra)</option>
                            <option value="rajkot">Rajkot (Gujarat)</option>
                        </optgroup>
                        <optgroup label="North India">
                            <option value="delhi">Delhi</option>
                            <option value="jaipur">Jaipur (Rajasthan)</option>
                            <option value="lucknow">Lucknow (Uttar Pradesh)</option>
                            <option value="kanpur">Kanpur (Uttar Pradesh)</option>
                            <option value="agra">Agra (Uttar Pradesh)</option>
                            <option value="chandigarh">Chandigarh</option>
                            <option value="amritsar">Amritsar (Punjab)</option>
                            <option value="ludhiana">Ludhiana (Punjab)</option>
                        </optgroup>
                        <optgroup label="East India">
                            <option value="kolkata">Kolkata (West Bengal)</option>
                            <option value="patna">Patna (Bihar)</option>
                            <option value="bhubaneswar">Bhubaneswar (Odisha)</option>
                            <option value="ranchi">Ranchi (Jharkhand)</option>
                            <option value="guwahati">Guwahati (Assam)</option>
                        </optgroup>
                        <optgroup label="Central India">
                            <option value="bhopal">Bhopal (Madhya Pradesh)</option>
                            <option value="indore">Indore (Madhya Pradesh)</option>
                            <option value="raipur">Raipur (Chhattisgarh)</option>
                        </optgroup>
                    </select>
                </div>

                {/* Quantity Input */}
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                        {getText('quantity')}
                    </label>
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        min="1"
                        style={{ width: '100%', padding: '12px', fontSize: '1rem', borderRadius: '8px', border: '2px solid var(--color-earth)' }}
                    />
                </div>

                <button
                    onClick={checkPrice}
                    className="btn-paint"
                    disabled={loading}
                    style={{ width: '100%' }}
                >
                    {loading ? '...' : getText('checkPrice')}
                </button>
            </div>

            {/* Error Display */}
            {error && (
                <div className="artistic-card mt-4" style={{ background: '#ffebee', border: '2px solid #f44336' }}>
                    <p style={{ color: '#c62828', margin: 0 }}>{error}</p>
                </div>
            )}

            {/* Price Results */}
            {priceData && (
                <div className="artistic-card mt-4" style={{ background: 'var(--color-cream)' }}>
                    {/* Data Source Badge */}
                    <div style={{ 
                        marginBottom: '15px', 
                        padding: '8px 12px', 
                        background: priceData.marketData?.source?.includes('Agmarknet') 
                            ? '#e8f5e9' 
                            : priceData.marketData?.source?.includes('AI-Powered')
                            ? '#e3f2fd'
                            : '#fff3e0',
                        borderRadius: '6px',
                        fontSize: '0.85rem',
                        color: priceData.marketData?.source?.includes('Agmarknet') 
                            ? '#2e7d32' 
                            : priceData.marketData?.source?.includes('AI-Powered')
                            ? '#1565c0'
                            : '#e65100',
                        border: `2px solid ${priceData.marketData?.source?.includes('Agmarknet') 
                            ? '#4caf50' 
                            : priceData.marketData?.source?.includes('AI-Powered')
                            ? '#2196f3'
                            : '#ff9800'}`
                    }}>
                        <strong>
                            {priceData.marketData?.source?.includes('Agmarknet') 
                                ? '✅ Real Data' 
                                : priceData.marketData?.source?.includes('AI-Powered')
                                ? '🤖 AI Estimate'
                                : '📊 Estimated'}:
                        </strong> {priceData.marketData?.source || 'Estimated'}
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <h3 style={{ color: 'var(--color-earth)', marginBottom: '5px' }}>{getText('avgPrice')}</h3>
                        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-indigo)' }}>
                            ₹{priceData.averagePrice}/kg
                        </p>
                    </div>

                    <div style={{ marginBottom: '15px', padding: '15px', background: 'var(--color-turmeric-light)', borderRadius: '8px' }}>
                        <h3 style={{ color: 'var(--color-green)', marginBottom: '5px' }}>{getText('suggestedPrice')}</h3>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-green)' }}>
                            ₹{priceData.suggestedPrice}/kg
                        </p>
                    </div>

                    {/* Total Price Display */}
                    <div style={{ marginBottom: '15px', padding: '20px', background: 'var(--color-indigo)', color: 'white', borderRadius: '8px', textAlign: 'center' }}>
                        <h3 style={{ marginBottom: '10px', fontSize: '1.2rem' }}>
                            {getText('totalPrice')} {getText('forQuantity')} {quantity} kg
                        </h3>
                        <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '10px 0' }}>
                            ₹{(priceData.suggestedPrice * parseFloat(quantity)).toFixed(2)}
                        </p>
                        <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                            ({quantity} kg × ₹{priceData.suggestedPrice}/kg)
                        </p>
                    </div>

                    <div>
                        <h4 style={{ color: 'var(--color-earth)', marginBottom: '8px' }}>{getText('explanation')}</h4>
                        <p style={{ fontSize: '1rem', lineHeight: '1.5', color: 'var(--color-earth)' }}>
                            {priceData.explanation}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
