'use client'
import { createContext, useContext, useEffect, useState } from 'react'

const LangContext = createContext({ lang: 'en', setLang: () => {} })

export function LangProvider({ children }) {
  const [lang, setLangState] = useState('en')

  useEffect(() => {
    const stored = localStorage.getItem('fs_lang') || 'en'
    setLangState(stored)
    document.documentElement.lang = stored
    document.documentElement.dir  = stored === 'ar' ? 'rtl' : 'ltr'
  }, [])

  const setLang = (l) => {
    setLangState(l)
    localStorage.setItem('fs_lang', l)
    document.documentElement.lang = l
    document.documentElement.dir  = l === 'ar' ? 'rtl' : 'ltr'
  }

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  )
}

export const useLang = () => useContext(LangContext)

// t(obj, lang) — returns Arabic string when lang==='ar', falls back to English
export const t = (obj, lang) =>
  (lang === 'ar' && obj?.ar) ? obj.ar : (obj?.en ?? obj ?? '')

// ─── All UI strings ────────────────────────────────────────────────────────
export const ui = {

  // ── Navigation ────────────────────────────────────────────────────────────
  nav: {
    home:     { en: 'Home',     ar: 'الرئيسية' },
    products: { en: 'Products', ar: 'المنتجات' },
    about:    { en: 'About',    ar: 'من نحن' },
    services: { en: 'Services', ar: 'خدماتنا' },
    projects: { en: 'Projects', ar: 'مشاريعنا' },
    clients:  { en: 'Clients',  ar: 'عملاؤنا' },
    contact:  { en: 'Contact',  ar: 'تواصل معنا' },
    langToggle: { en: 'عربي',   ar: 'EN' },
  },

  // ── Filters & search toolbar ──────────────────────────────────────────────
  filters: {
    filters:    { en: 'Filters',            ar: 'تصفية' },
    clearAll:   { en: 'Clear all',          ar: 'مسح الكل' },
    search:     { en: 'Search products…',   ar: 'البحث في المنتجات…' },
    searchShort:{ en: 'Search…',            ar: 'بحث...' },
    perPage:    { en: 'Per page',           ar: 'لكل صفحة' },
    noResults:  { en: 'No products found.', ar: 'لا توجد منتجات.' },
    noResultsShort: { en: 'No results found', ar: 'لا توجد نتائج' },
    loading:    { en: 'Loading…',           ar: 'جارٍ التحميل…' },
  },

  // ── Product spec field labels (used in detail page & filter sidebar) ──────
  specs: {
    composition:      { en: 'Composition',       ar: 'التركيب' },
    background:       { en: 'Background',         ar: 'الخلفية' },
    width:            { en: 'Width',              ar: 'العرض' },
    oz:               { en: 'OZ',                 ar: 'الوزن' },
    weight:           { en: 'Weight',             ar: 'الوزن' },
    match:            { en: 'Match',              ar: 'التطابق' },
    removeType:       { en: 'Remove Type',        ar: 'نوع الإزالة' },
    orderType:        { en: 'Order Type',         ar: 'نوع الطلب' },
    maintenance:      { en: 'Maintenance',        ar: 'الصيانة' },
    lightFastness:    { en: 'Light Fastness',     ar: 'ثبات اللون' },
    material:         { en: 'Material',           ar: 'المادة' },
    usage:            { en: 'Usage',              ar: 'الاستخدام' },
    horizontalRepeat: { en: 'Horizontal Repeat',  ar: 'تكرار أفقي' },
    verticalRepeat:   { en: 'Vertical Repeat',    ar: 'تكرار عمودي' },
    notes:            { en: 'Notes',              ar: 'ملاحظات' },
    colors:           { en: 'Colors',             ar: 'الألوان' },
  },

  // ── Product card / detail chrome ─────────────────────────────────────────
  product: {
    viewAll:        { en: 'View All Products',  ar: 'عرض جميع المنتجات' },
    featured:       { en: 'Featured',           ar: 'مميز' },
    itemCode:       { en: 'Item Code:',         ar: 'كود المنتج:' },
    backToProducts: { en: 'Products',           ar: 'المنتجات' },
    // legacy keys kept for ProductsPage which still references them
    sku:            { en: 'SKU',                ar: 'رمز المنتج' },
  },

  // ── Hero section ─────────────────────────────────────────────────────────
  hero: {
    eyebrow: { en: 'Premium Textiles & Surfaces',  ar: 'منسوجات ومساطح راقية' },
    heading: { en: 'Where Threads \nBecome Art.',  ar: 'حيث تتحول الخيوط\nإلى فن' },
    sub:     { en: "Curated upholstery, leather, wallcovering, and more — sourced from the world's finest ateliers.", ar: 'تنجيد وجلود وأغطية جدران منتقاة بعناية — من أرقى مراسم العالم.' },
    cta:     { en: 'Explore Collection',           ar: 'استكشف المجموعة' },
  },

  // ── Categories / collection pages ────────────────────────────────────────
  categories: {
    heading:       { en: 'Our Collections',    ar: 'مجموعاتنا' },
    browseBy:      { en: 'Browse by Category', ar: 'تصفح حسب الفئة' },
    theCollection: { en: 'The Collection',     ar: 'المجموعة' },
    all:           { en: 'All',                ar: 'الكل' },
    ourProducts:   { en: 'Our Products',       ar: 'منتجاتنا' },
    exploreRange:  { en: 'Explore our full range of wall coverings, upholstery, curtains, and tassels', ar: 'اكتشف مجموعتنا الكاملة من أغطية الجدران والتنجيد والستائر والشراريب' },
  },

  // ── Home page ─────────────────────────────────────────────────────────────
  home: {
    handpicked:     { en: 'Handpicked',              ar: 'منتجات مختارة' },
    featuredHead:   { en: 'Featured Products',       ar: 'المنتجات المميزة' },
    noFeatured:     { en: 'No featured products yet', ar: 'لا توجد منتجات مميزة' },
    allProducts:    { en: 'All Products',             ar: 'جميع المنتجات' },
    brandStatement: {
      en: 'Providing bespoke solutions in the supply and execution of high-end curtain fabrics, upholstery, and luxury wall coverings, tailored to elevate interiors with elegance, comfort, and timeless sophistication',
      ar: 'نقدّم خدمات متكاملة في توريد وتنفيذ الأقمشة الفاخرة الخاصة بالستائر، وورق الجدران، والمفروشات، مع اهتمام دقيق بالتفاصيل وجودة التنفيذ، لنخلق مساحات تجمع بين الأناقة والهوية والراحة',
    },
  },

  // ── Footer ────────────────────────────────────────────────────────────────
  footer: {
    description: { en: 'Premium textiles and surfaces for discerning designers and specifiers worldwide.', ar: 'مواد نسيج ومفروشات فاخرة للمصممين والمختصين المميزين حول العالم.' },
    collections: { en: 'Collections',         ar: 'المجموعات' },
    company:     { en: 'Company',             ar: 'الشركة' },
    aboutUs:     { en: 'About Us',            ar: 'من نحن' },
    services:    { en: 'Services',            ar: 'خدماتنا' },
    projects:    { en: 'Projects',            ar: 'مشاريعنا' },
    clients:     { en: 'Clients',             ar: 'عملاؤنا' },
    contact:     { en: 'Contact',             ar: 'تواصل معنا' },
    rights:      { en: 'All rights reserved.', ar: 'جميع الحقوق محفوظة.' },
    crafted:     { en: 'Crafted with care.',   ar: 'صُنع بعناية.' },
  },

  // ── About page ────────────────────────────────────────────────────────────
  about: {
    eyebrow:       { en: 'About Us',                                ar: 'من نحن' },
    heading:       { en: 'A Story of Craft\nand Material Excellence', ar: 'حكاية الحرفية\nوالمواد الراقية' },
    sub:           { en: "We have created a very good reputation for providing unique products, quality materials, and professional services. We credit this success to a combination of talent, integrity, and creativity within the art of fabrics, wallpapers, and curtains. \n \n Our understanding of the proper materials, professional quality, and industry fashion trends became our development strategy. In alignment with international industry standards, professional know-how, and eco-friendly partners, our aim is to improve the quality of life and reduce our environmental footprint through the provision of sound, eco-friendly, professional, and leading-edge interior services.", ar: 'منذ عام 2008، نختار بعناية أرقى الأقمشة والأسطح من أفضل مراسم العالم لتلهم مصممي الديكور والمنشآت في المنطقة.' },
    missionLabel:  { en: 'Our Mission',                             ar: 'مهمتنا' },
    missionHead:   { en: 'Making Excellence Accessible',            ar: 'نجعل التميّز في المتناول' },
    missionP1:     { en: "Our Logo reflects philosophy in the domain of interior decoration and furniture; it reflects the fashion, colors and art of decoration", ar: 'شعارنا يعكس فلسفة في مجال تزيين الداخل والأثاث؛ فهو يعكس الأزياء والألوان والفن في التزيين' },
    missionP2:     { en: "Our team of specialists understands designers' language and knows project challenges — from initial specification to final delivery.", ar: 'فريقنا من المتخصصين يفهم لغة المصممين ويعرف تحديات المشاريع — من المواصفات الأولية حتى التسليم النهائي.' },
    journeyLabel:  { en: 'Our Journey',                             ar: 'مسيرتنا' },
    journeyHead:   { en: 'Decades of Growth',                       ar: 'عقود من التطور' },
    valuesLabel:   { en: 'Our Values',                              ar: 'قيمنا' },
    valuesHead:    { en: 'What Drives Us',                          ar: 'ما يقودنا' },
    statsDesign:   { en: 'Design Studios',                          ar: 'استوديو تصميم' },
    statsYears:    { en: 'Years Experience',                        ar: 'سنة خبرة' },
    statsProducts: { en: 'Products Curated',                        ar: 'منتج منتقى' },
    statsPartners: { en: 'Global Mill Partners',                    ar: 'شريك مصنع عالمي' },
  },

  // ── Services page ─────────────────────────────────────────────────────────
  services: {
    eyebrow:    { en: 'What We Offer',                               ar: 'ما نقدمه' },
    heading:    { en: 'Complete Services\nFor Every Project',        ar: 'خدمات متكاملة\nلكل مشروع' },
    sub:        { en: 'From initial consultation to final delivery, we offer complete support to interior designers, contractors, and developers across the region.', ar: 'من الاستشارة الأولى إلى التسليم النهائي، نقدم دعماً شاملاً لمصممي الديكور والمقاولين والمطورين في المنطقة.' },
    ctaLabel:   { en: 'Start Your Project',                          ar: 'ابدأ مشروعك' },
    ctaHead:    { en: 'Need Expert Guidance?',                       ar: 'هل تحتاج مساعدة متخصصة؟' },
    ctaBody:    { en: "Reach out to our specialist team and we'll help you find the perfect solution for your project.", ar: 'تواصل مع فريقنا المتخصص وسنساعدك في إيجاد الحل المثالي لمشروعك.' },
    ctaContact: { en: 'Get in Touch',                                ar: 'تواصل معنا' },
    ctaBrowse:  { en: 'Browse Products',                             ar: 'تصفح المنتجات' },
  },

  // ── Projects page ─────────────────────────────────────────────────────────
  projects: {
    eyebrow: { en: 'Our Projects',                              ar: 'مشاريعنا' },
    heading: { en: 'Projects That\nSpeak for Themselves',      ar: 'مشاريع تتحدث\nعن نفسها' },
    sub:     { en: 'From five-star hotels to private villas, we are proud to contribute to shaping exceptional spaces across the region.', ar: 'من فنادق خمس نجوم إلى فلل خاصة، نفخر بمساهمتنا في تشكيل المساحات الاستثنائية عبر المنطقة.' },
  },

  // ── Clients page ─────────────────────────────────────────────────────────
  clients: {
    eyebrow:           { en: 'Our Clients',                 ar: 'عملاؤنا' },
    heading:           { en: 'Partners in Success\nAcross the Region', ar: 'شركاء النجاح\nعبر المنطقة' },
    sub:               { en: 'We are proud to serve over 500 interior designers, contractors, and real estate developers across the GCC and MENA region.', ar: 'نفخر بخدمة أكثر من 500 مصمم داخلي وشركة مقاولات ومطور عقاري في منطقة الخليج والشرق الأوسط.' },
    trustedBy:         { en: 'Trusted by',                  ar: 'موثوق من قِبل' },
    industriesLabel:   { en: 'Industries Served',           ar: 'القطاعات' },
    industriesHead:    { en: 'We Serve Every Sector',       ar: 'نخدم جميع القطاعات' },
    testimonialsLabel: { en: 'What They Say',               ar: 'ماذا يقولون' },
    testimonialsHead:  { en: 'Client Testimonials',         ar: 'آراء عملائنا' },
  },

  // ── Contact page ─────────────────────────────────────────────────────────
  contact: {
    eyebrow:     { en: 'Get in Touch',                ar: 'تواصل معنا' },
    heading:     { en: "Let's Start\na Conversation", ar: 'لنبدأ\nحواراً' },
    sub:         { en: "Whether you're looking for a specific product, need samples, or want a consultation for your project — our team is ready to help.", ar: 'سواء كنت تبحث عن منتج محدد، تحتاج عينات، أو تريد استشارة لمشروعك — فريقنا مستعد للمساعدة.' },
    infoLabel:   { en: 'Contact Information',         ar: 'معلومات الاتصال' },
    infoHead:    { en: "We're Here to Help",          ar: 'نحن هنا لمساعدتك' },
    tradeLabel:  { en: 'Trade Accounts',              ar: 'حسابات تجارية' },
    tradeBody:   { en: 'Interior designers, fit-out contractors, and distributors qualify for special trade terms. Contact us to learn more.', ar: 'مصممو الديكور ومقاولو الداخلية والموزعون مؤهلون لشروط تجارية خاصة. تواصل معنا لمزيد من المعلومات.' },
    thankHead:   { en: 'Thank you for reaching out',  ar: 'شكراً لتواصلك' },
    thankBody:   { en: 'A member of our team will get back to you within one business day.', ar: 'سيقوم أحد أعضاء فريقنا بالرد عليك خلال يوم عمل واحد.' },
    fieldName:   { en: 'Name *',                      ar: 'الاسم *' },
    fieldEmail:  { en: 'Email *',                     ar: 'البريد الإلكتروني *' },
    fieldCompany:{ en: 'Company',                     ar: 'الشركة' },
    fieldSubject:{ en: 'Subject *',                   ar: 'الموضوع *' },
    fieldMessage:{ en: 'Message *',                   ar: 'رسالتك *' },
    phName:      { en: 'Your full name',              ar: 'اسمك الكامل' },
    phEmail:     { en: 'your@email.com',              ar: 'بريدك الإلكتروني' },
    phCompany:   { en: 'Your company or studio name', ar: 'اسم شركتك أو استوديوك' },
    phSubject:   { en: 'Select a subject',            ar: 'اختر موضوعاً' },
    phMessage:   { en: 'Tell us about your project or enquiry…', ar: 'أخبرنا عن مشروعك أو استفسارك...' },
    sendBtn:     { en: 'Send Message',                ar: 'إرسال الرسالة' },
    privacy:     { en: 'We respond within one business day. Your data is safe with us.', ar: 'سنرد خلال يوم عمل واحد. بياناتك آمنة معنا.' },
  },
}
