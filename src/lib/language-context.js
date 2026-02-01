
"use client";
import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext({
    language: 'en',
    setLanguage: () => { },
    t: (key) => key
});

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('en'); // Start with English, let user choose
    const [mounted, setMounted] = useState(false);

    // Persist language selection
    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem('appLanguage');
        if (saved) {
            setLanguage(saved);
        }
    }, []);

    const handleSetLanguage = (lang) => {
        setLanguage(lang);
        if (mounted) {
            localStorage.setItem('appLanguage', lang);
        }
    };

    // Simple dictionary for UI labels
    const translations = {
        en: { 
            appName: "VyaparSathi", 
            welcome: "Welcome, Vendor!", 
            price: "Check Price", 
            negotiate: "Practice Talk", 
            calc: "Calculator", 
            profit: "My Profit", 
            photo: "Scan Item" 
        },
        hi: { 
            appName: "व्यापार साथी", 
            welcome: "नमस्ते व्यापारी भाई!", 
            price: "भाव पता करें", 
            negotiate: "बातचीत सीखें", 
            calc: "हिसाब किताब", 
            profit: "मेरा मुनाफा", 
            photo: "फोटो लो" 
        },
        te: { 
            appName: "వ్యాపార సాథీ", 
            welcome: "నమస్కారం వ్యాపారి!", 
            price: "ధర తనిఖీ చేయండి", 
            negotiate: "చర్చ నేర్చుకోండి", 
            calc: "లెక్కలు", 
            profit: "నా లాభం", 
            photo: "ఫోటో తీయండి" 
        },
        ta: { 
            appName: "வியாபார சாத்தி", 
            welcome: "வணக்கம் வியாபாரி!", 
            price: "விலை சரிபார்க்கவும்", 
            negotiate: "பேச்சுவார்த்தை கற்றுக்கொள்ளுங்கள்", 
            calc: "கணக்கு", 
            profit: "என் லாபம்", 
            photo: "புகைப்படம் எடுக்கவும்" 
        },
        kn: { 
            appName: "ವ್ಯಾಪಾರ ಸಾಥಿ", 
            welcome: "ನಮಸ್ಕಾರ ವ್ಯಾಪಾರಿ!", 
            price: "ಬೆಲೆ ಪರಿಶೀಲಿಸಿ", 
            negotiate: "ಚರ್ಚೆ ಕಲಿಯಿರಿ", 
            calc: "ಲೆಕ್ಕಾಚಾರ", 
            profit: "ನನ್ನ ಲಾಭ", 
            photo: "ಫೋಟೋ ತೆಗೆಯಿರಿ" 
        },
        ml: { 
            appName: "വ്യാപാര സാഥി", 
            welcome: "നമസ്കാരം വ്യാപാരി!", 
            price: "വില പരിശോധിക്കുക", 
            negotiate: "ചർച്ച പഠിക്കുക", 
            calc: "കണക്കുകൂട്ടൽ", 
            profit: "എന്റെ ലാഭം", 
            photo: "ഫോട്ടോ എടുക്കുക" 
        },
    };

    const t = (key) => {
        const translation = translations[language]?.[key] || translations['en'][key] || key;
        return translation;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        console.error("useLanguage must be used within LanguageProvider");
    }
    return context;
};
