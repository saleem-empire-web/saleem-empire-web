import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "en" | "ar";

type Translations = {
  [key in Language]: {
    [key: string]: string;
  };
};

const translations: Translations = {
  en: {
    home: "Home",
    products: "Products",
    categories: "Categories",
    about: "About",
    cart: "Cart",
    search: "Search products...",
    featured: "Featured Collection",
    newArrivals: "New Arrivals",
    bestSellers: "Best Sellers",
    addToCart: "Add to Cart",
    outOfStock: "Out of Stock",
    priceRange: "Price Range",
    viewAll: "View All",
    checkout: "Checkout",
    subtotal: "Subtotal",
    emptyCart: "Your cart is empty",
    shopNow: "Shop Now",
    reviews: "Reviews",
    description: "Description",
    relatedProducts: "Related Products",
    aboutText: "Welcome to Cloud Nine Smoke Shop. We offer a premium selection of high-quality glass, vapes, and accessories for the discerning adult. Our curated collection brings the sophisticated atmosphere of a high-end lounge directly to you.",
    heroTitle: "Elevate Your Experience",
    heroSubtitle: "Premium glass, vapes, and lifestyle accessories for the discerning enthusiast.",
    allProducts: "All Products",
    filterByCategory: "Filter by Category",
    clearFilters: "Clear Filters",
    quantity: "Quantity",
    remove: "Remove",
    total: "Total",
    contactUs: "Contact Us",
    location: "Location",
    phone: "Phone",
    unitedStates: "United States of America",
  },
  ar: {
    home: "الرئيسية",
    products: "المنتجات",
    categories: "الفئات",
    about: "عن المتجر",
    cart: "عربة التسوق",
    search: "البحث عن المنتجات...",
    featured: "المجموعة المميزة",
    newArrivals: "وصل حديثاً",
    bestSellers: "الأكثر مبيعاً",
    addToCart: "أضف إلى السلة",
    outOfStock: "نفذت الكمية",
    priceRange: "نطاق السعر",
    viewAll: "عرض الكل",
    checkout: "إتمام الشراء",
    subtotal: "المجموع الفرعي",
    emptyCart: "عربة التسوق فارغة",
    shopNow: "تسوق الآن",
    reviews: "المراجعات",
    description: "الوصف",
    relatedProducts: "منتجات ذات صلة",
    aboutText: "مرحباً بكم في متجر كلاود ناين. نقدم تشكيلة فاخرة من الزجاجيات، الفيب، والإكسسوارات عالية الجودة للبالغين ذوي الذوق الرفيع. مجموعتنا المختارة بعناية تجلب لك أجواء اللاونج الفاخر مباشرة.",
    heroTitle: "ارتقِ بتجربتك",
    heroSubtitle: "زجاجيات، فيب، وإكسسوارات فاخرة لعشاق الذوق الرفيع.",
    allProducts: "جميع المنتجات",
    filterByCategory: "تصفية حسب الفئة",
    clearFilters: "مسح الفلاتر",
    quantity: "الكمية",
    remove: "إزالة",
    total: "الإجمالي",
    contactUs: "تواصل معنا",
    location: "الموقع",
    phone: "الهاتف",
    unitedStates: "الولايات المتحدة الأمريكية",
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations.en) => string;
  dir: "ltr" | "rtl";
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: keyof typeof translations.en) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir: language === "ar" ? "rtl" : "ltr" }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
