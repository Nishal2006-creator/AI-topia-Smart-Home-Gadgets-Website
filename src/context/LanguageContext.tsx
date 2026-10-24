import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ta' | 'es' | 'hi';

interface Translations {
  [key: string]: {
    [K in Language]: string;
  };
}

const translations: Translations = {
  // Navigation
  'nav.home': { en: 'Home', ta: 'முகப்பு', es: 'Inicio', hi: 'होम' },
  'nav.hardware': { en: 'Hardware', ta: 'வன்பொருள்', es: 'Hardware', hi: 'हार्डवेयर' },
  'nav.consultant': { en: 'Robot Assistant', ta: 'AI உதவியாளர்', es: 'Asistente AI', hi: 'रोबोट सहायक' },
  'nav.orders': { en: 'Orders', ta: 'ஆர்டர்கள்', es: 'Pedidos', hi: 'आदेश' },
  'nav.workflows': { en: 'Workflows', ta: 'பணிப்பாய்வு', es: 'Flujos', hi: 'वर्कफ़्लो' },
  'nav.admin': { en: 'Admin Console', ta: 'நிர்வாக கன்சோல்', es: 'Consola Admin', hi: 'एडमिन पैनल' },
  'nav.logout': { en: 'Disconnect Node', ta: 'துண்டிப்பு', es: 'Desconectar', hi: 'डिस्कनेक्ट' },
  'nav.sync': { en: 'Sync', ta: 'இணைப்பு', es: 'Sincronizar', hi: 'सिंक' },
  'nav.feedback': { en: 'Feedback', ta: 'கருத்து', es: 'Comentarios', hi: 'फीडबैक' },
  'nav.support': { en: 'Support', ta: 'ஆதரவு', es: 'Soporte', hi: 'सहायता' },
  
  // Profile
  'profile.title': { en: 'Identity Configuration', ta: 'அடையாள கட்டமைப்பு', es: 'Configuración de Identidad', hi: 'पहचान विन्यास' },
  'profile.subtitle': { en: 'Manage your core data nodes.', ta: 'உங்கள் தரவு முனைகளை நிர்வகிக்கவும்.', es: 'Gestiona tus nodos de datos.', hi: 'अपने डेटा नोड्स प्रबंधित करें।' },
  'profile.name': { en: 'Display Name', ta: 'காட்சி பெயர்', es: 'Nombre', hi: 'प्रदर्शन नाम' },
  'profile.save': { en: 'Save Configuration', ta: 'கட்டமைப்பைச் சேமிக்கவும்', es: 'Guardar Configuración', hi: 'विन्यास सहेजें' },
  'profile.language': { en: 'Neural Linguistics', ta: 'மொழி அமைப்பு', es: 'Lingüística Neural', hi: 'भाषा विन्यास' },
  'profile.security': { en: 'Neural Shield Status', ta: 'பாதுகாப்பு நிலை', es: 'Estado de Escudo Neural', hi: 'सुरक्षा स्थिति' },
  'profile.test': { en: 'Test Notification Signal', ta: 'சோதனை அறிவிப்பு', es: 'Probar Señal de Notificación', hi: 'परीक्षण अधिसूचना' },
  
  // UI General
  'ui.loading': { en: 'Syncing...', ta: 'இணக்கப் படுகிறது...', es: 'Sincronizando...', hi: 'सिंक हो रहा है...' },
  'ui.active': { en: 'Active', ta: 'செயலில்', es: 'Activo', hi: 'सक्रिय' },
  'ui.verified': { en: 'Verified', ta: 'சரிபார்க்கப்பட்டது', es: 'Verificado', hi: 'सत्यापित' },
  'ui.config_req': { en: 'Configuration Required', ta: 'கட்டமைப்பு தேவை', es: 'Configuración Requerida', hi: 'विन्यास आवश्यक' },
  
  // Theme
  'theme.title': { en: 'Environment Config', ta: 'சுற்றுச்சூழல் கட்டமைப்பு', es: 'Configuración del Entorno', hi: 'पर्यावरण विन्यास' },
  'theme.subtitle': { en: 'Modify the neural interface parameters to match your aesthetic signature.', ta: 'உங்கள் அழகியல் கையொப்பத்துடன் பொருந்தக்கூடிய நரம்பு இடைமுக அளவுருக்களை மாற்றவும்.', es: 'Modifica los parámetros de la interfaz para que coincidan con tu estética.', hi: 'अपनी पसंद के अनुसार इंटरफ़ेस मापदंडों को बदलें।' },
  'theme.presets': { en: 'Neural Presets', ta: 'முன்னமைவுகள்', es: 'Preajustes Neurales', hi: 'प्रीसेट' },
  'theme.identity': { en: 'Identity', ta: 'அடையாளம்', es: 'Identidad', hi: 'पहचान' },
  'theme.architecture': { en: 'Architecture', ta: 'கட்டமைப்பு', es: 'Arquitectura', hi: 'संरचना' },
  'theme.neural_flow': { en: 'Neural Flow', ta: 'நரம்பு ஓட்டம்', es: 'Flujo Neural', hi: 'न्यूरल फ्लो' },
  'theme.publish': { en: 'Publish Global Theme', ta: 'உலகளாவிய கருப்பொருளை வெளியிடுங்கள்', es: 'Publicar Tema Global', hi: 'ग्लोबल थीम प्रकाशित करें' },
  'theme.reset': { en: 'Reset Defaults', ta: 'இயல்புநிலைக்கு மீட்டமைக்கவும்', es: 'Restablecer Valores', hi: 'रीसेट करें' }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('app_language') as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('app_language', lang);
    document.documentElement.lang = lang;
  };

  const t = (key: string) => {
    if (!translations[key]) return key;
    return translations[key][language] || translations[key]['en'];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
