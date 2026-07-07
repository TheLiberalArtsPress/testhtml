// app.js
const { useState, useEffect, useMemo, useRef } = React;
const lib = window.lucideReact || window.LucideReact || {};
const FallbackIcon = () => <span className="inline-block w-4 h-4 bg-gray-300 rounded-full animate-pulse"></span>;

const BookOpen = lib.BookOpen || FallbackIcon;
const Globe = lib.Globe || FallbackIcon;
const ShoppingCart = lib.ShoppingCart || FallbackIcon;
const X = lib.X || FallbackIcon;
const MessageCircle = lib.MessageCircle || FallbackIcon;
const ChevronRight = lib.ChevronRight || FallbackIcon;
const ChevronLeft = lib.ChevronLeft || FallbackIcon;
const ChevronDown = lib.ChevronDown || FallbackIcon;
const ChevronUp = lib.ChevronUp || FallbackIcon;
const Database = lib.Database || FallbackIcon;
const Clock = lib.Clock || FallbackIcon;
const CheckCircle = lib.CheckCircle || FallbackIcon;
const Zap = lib.Zap || FallbackIcon;
const LayoutDashboard = lib.LayoutDashboard || FallbackIcon;
const Trash2 = lib.Trash2 || FallbackIcon;
const MapPin = lib.MapPin || FallbackIcon;
const Phone = lib.Phone || FallbackIcon;
const Printer = lib.Printer || FallbackIcon;
const Mail = lib.Mail || FallbackIcon;
const CreditCard = lib.CreditCard || FallbackIcon;
const LinkIcon = lib.Link || FallbackIcon;
const Compass = lib.Compass || FallbackIcon;
const User = lib.User || FallbackIcon;
const Search = lib.Search || FallbackIcon;
const FileText = lib.FileText || FallbackIcon;
const Plus = lib.Plus || FallbackIcon;
const Minus = lib.Minus || FallbackIcon;
const RefreshCw = lib.RefreshCw || FallbackIcon;
const Sparkles = lib.Sparkles || FallbackIcon;

const ModernLogo = ({ className = "w-8 h-8", color1 = "var(--dark-color)", color2 = "var(--primary-color)" }) => (
    <svg viewBox="0 0 40 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <polygon points="18,30 8,10 13,8 23,28" fill={color1} />
        <polygon points="22,30 32,10 27,8 17,28" fill={color2} />
    </svg>
);

const _0x4a21 = "aHR0cHM6Ly9zY3JpcHQuZ29vZ2xlLmNvbS9tYWNyb3Mvcy9BS2Z5Y2J4TTczVlJ3TmllbG5Ld2hHZmItY3cwV2tDY1N4bU9QbXI0cFg3YU1sLXgtX3lzaVFmZWhHMVBIT0pKdFZfeTdRVlcvZXhlYw==";

const GAS_URL = atob(_0x4a21); 
const SECRET_KEY = "cd6ca599bdbb083d34a3012b84071c848cc4bca0698a53c3cc65a2c296dd3ddf";

async function generateSignature(message, secret) {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const msgData = encoder.encode(message);
    const cryptoKey = await window.crypto.subtle.importKey(
        "raw", keyData, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
    );
    const signatureBuffer = await window.crypto.subtle.sign("HMAC", cryptoKey, msgData);
    const hashArray = Array.from(new Uint8Array(signatureBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

const formatImageUrl = (url) => {
    const transparentFallback = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
    if (!url) return transparentFallback;
    let strUrl = String(url).trim();
    if (!strUrl || strUrl === '') return transparentFallback;
    if (strUrl.startsWith('data:image')) return strUrl;
    
    let driveId = null;
    if (strUrl.includes('drive.google.com')) {
        const match = strUrl.match(/\/d\/([a-zA-Z0-9_-]+)/) || strUrl.match(/id=([a-zA-Z0-9_-]+)/);
        if (match) driveId = match[1];
    } else if (/^[a-zA-Z0-9_-]{20,}$/.test(strUrl) && !strUrl.includes("/")) {
        driveId = strUrl;
    }

    if (driveId) {
        return `https://drive.google.com/thumbnail?id=${driveId}&sz=w1000`;
    }
    return strUrl;
};

const fallbackCarousels = [
    { id: 'fb1', title: '傳承千年智慧', description: '致力於出版高品質文學、歷史、哲學著作。讓深厚底蘊更貼近當代讀者。', image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=1200' }
];

const fallbackBooks = [
    { id: 'fb_1', title: '正在向資料庫索取書籍', author: '讀取中', year: '讀取中', price: 0, category: '文學', stock: 10, cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400' }
];

function App() {
    // 🎯 讀取從外部 window 載入的 defaultUI
    const [ui, setUi] = useState(window.defaultUI || {});

    const [settings, setSettings] = useState({
        systemName: '文史哲出版社',
        systemSubName: 'The Liberal Arts Press'
    });

    const [carousels, setCarousels] = useState(() => {
        const cached = localStorage.getItem('lapen_carousels_v4');
        if (cached) { try { const p = JSON.parse(cached); if(p.length > 0) return p; } catch(e) {} }
        return fallbackCarousels;
    });
    const [carouselIndex, setCarouselIndex] = useState(0); 
    
    const [books, setBooks] = useState(() => {
        const cached = localStorage.getItem('lapen_books_v4');
        if (cached) { try { const p = JSON.parse(cached); if(p.length > 0) return p.sort(() => 0.5 - Math.random()); } catch(e) {} }
        return fallbackBooks;
    });

    const [choiceBooks, setChoiceBooks] = useState([]);
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isContactOpen, setIsContactOpen] = useState(false);
    const [notification, setNotification] = useState(null);
    const [isCartDetailsOpen, setIsCartDetailsOpen] = useState(true);
    const [selectedPayment, setSelectedPayment] = useState('店取付現金');

    const [isBooksLoading, setIsBooksLoading] = useState(true); 
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [isSubmittingCS, setIsSubmittingCS] = useState(false);

    const [selectedCategory, setSelectedCategory] = useState('全部');
    const [visibleCount, setVisibleCount] = useState(8); 
    
    const [iframeModal, setIframeModal] = useState({ isOpen: false, url: '', title: '' });
    const [isAboutOpen, setIsAboutOpen] = useState(false);

    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const [isRandomBooksOpen, setIsRandomBooksOpen] = useState(false);

    const [searchForm, setSearchForm] = useState({ code: '', title: '', author: '', year: '', category: '' });
    const [appliedSearch, setAppliedSearch] = useState({ code: '', title: '', author: '', year: '', category: '' });
    const [searchVisibleCount, setSearchVisibleCount] = useState(8);

    const [randomBooks, setRandomBooks] = useState([]);
    
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [isAllCategoriesExpanded, setIsAllCategoriesExpanded] = useState(false);
    
    const sliderRef = useRef(null);

    const showMsg = (text) => {
        setNotification(text);
        setTimeout(() => setNotification(null), 3000);
    };

    useEffect(() => {
        const handleScroll = () => { setShowBackToTop(window.scrollY > 300); };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const syncWithGAS = async (action, payloadData = null) => {
        try {
            const currentOrigin = window.location.origin;
            const safeOrigin = currentOrigin.includes("usercontent.goog") ? "https://candylovema.github.io" : currentOrigin;
            const payloadObj = { action: action, payload: payloadData, origin: safeOrigin };
            
            const jsonStr = JSON.stringify(payloadObj);
            const utf8Bytes = new TextEncoder().encode(jsonStr);
            const payloadBase64 = btoa(String.fromCharCode(...utf8Bytes));
            
            const timestamp = Date.now().toString();
            const messageToSign = payloadBase64 + timestamp;
            const signature = await generateSignature(messageToSign, SECRET_KEY);

            const response = await fetch(GAS_URL, {
                method: "POST",
                headers: { "Content-Type": "text/plain;charset=utf-8" },
                body: JSON.stringify({ payload: payloadBase64, timestamp: timestamp, signature: signature })
            });
            
            const data = await response.json();
            if (data.status === 'error') {
                console.error("後端拒絕請求:", data.msg);
                if(currentOrigin.includes("localhost") || currentOrigin.includes("usercontent.goog")) {
                     showMsg("API 執行失敗: " + data.msg);
                }
            }
            return data;
        } catch (e) {
            console.error("GAS Sync Error:", e);
            return { status: 'error', msg: e.toString() };
        }
    };

    useEffect(() => {
        syncWithGAS('FETCH_SETTINGS').then(resSettings => {
            if (resSettings && resSettings.data) {
                setSettings(prev => ({...prev, ...resSettings.data}));
                if (resSettings.data.systemName) document.title = `${resSettings.data.systemName} 有限公司｜台灣人文學術出版社（首頁）官網`;
            }
        }).catch(() => {});

        syncWithGAS('FETCH_UI').then(resUi => {
            if (resUi && resUi.data) {
                setUi(prev => ({...prev, ...resUi.data}));
                if (resUi.data.frontendName) document.title = `${resUi.data.frontendName} - 首頁`;
            }
        }).catch(() => {});

        syncWithGAS('FETCH_CAROUSELS').then(resCarousels => {
            if (resCarousels && Array.isArray(resCarousels.data)) {
                const published = resCarousels.data.filter(c => c.status === '已發佈');
                if (published.length > 0) {
                    setCarousels(published);
                    localStorage.setItem('lapen_carousels_v4', JSON.stringify(published));
                }
            }
        }).catch(() => {});

        syncWithGAS('FETCH_CHOICES').then(resChoices => {
            if (resChoices && Array.isArray(resChoices.data)) {
                const validChoices = resChoices.data.filter(b => b.title && b.title.trim() !== '' && b.title !== '未命名書籍');
                setChoiceBooks(validChoices);
            }
        }).catch(() => {});

        syncWithGAS('FETCH_BOOKS').then(resBooks => {
            if (resBooks && Array.isArray(resBooks.data)) {
                const validBooks = resBooks.data.filter(b => b.title && b.title.trim() !== '' && b.title !== '未命名書籍');
                const shuffledBooks = validBooks.sort(() => 0.5 - Math.random());
                setBooks(shuffledBooks);
                try { localStorage.setItem('lapen_books_v4', JSON.stringify(shuffledBooks.slice(0, 150))); } catch (e) {}
            }
        }).finally(() => {
            setIsBooksLoading(false);
        });
    }, []);

    useEffect(() => {
        if (carousels.length <= 1) return;
        const timer = setInterval(() => setCarouselIndex((prev) => (prev + 1) % carousels.length), 5000); 
        return () => clearInterval(timer);
    }, [carousels.length]);

    const dynamicCategories = useMemo(() => {
        const cats = books.map(b => b.category).filter(c => c && c.trim() !== "");
        const combined = ['全部', '文史哲學集成', ...cats.filter(c => c !== '文史哲學集成' && c !== '全部')];
        return [...new Set(combined)];
    }, [books]);

    const visibleCategories = useMemo(() => {
        return isAllCategoriesExpanded ? dynamicCategories : dynamicCategories.slice(0, 5);
    }, [dynamicCategories, isAllCategoriesExpanded]);

    const excelCategories = useMemo(() => {
        const cats = books.map(b => b.category).filter(c => c && c.trim() !== "");
        return [...new Set(cats)].sort();
    }, [books]);

    const filteredBooks = useMemo(() => {
        if (selectedCategory === '全部') return books;
        return books.filter(b => b.category === selectedCategory);
    }, [books, selectedCategory]);

    const visibleBooks = filteredBooks.slice(0, visibleCount);
    const displayChoiceBooks = choiceBooks.length > 0 ? choiceBooks : books.slice(0, 10);

    const openRandomBooksModal = () => {
        setIsMobileMenuOpen(false);
        if (books.length > 0) {
            const shuffled = [...books].sort(() => 0.5 - Math.random());
            setRandomBooks(shuffled.slice(0, 8));
        }
        setIsRandomBooksOpen(true);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setAppliedSearch(searchForm);
        setSearchVisibleCount(8);
    };

    const indexSearchBooks = useMemo(() => {
        return books.filter(b => {
            const matchCode = !appliedSearch.code || (b.id && b.id.toString().includes(appliedSearch.code));
            const matchTitle = !appliedSearch.title || (b.title && b.title.includes(appliedSearch.title));
            const matchAuthor = !appliedSearch.author || (b.author && b.author.includes(appliedSearch.author));
            const matchPage = !appliedSearch.year || (b.year && b.year.toString().includes(appliedSearch.year));
            const matchCat = !appliedSearch.category || appliedSearch.category === '全部' || b.category === appliedSearch.category;
            return matchCode && matchTitle && matchAuthor && matchPage && matchCat;
        });
    }, [books, appliedSearch]);

    const visibleSearchBooks = indexSearchBooks.slice(0, searchVisibleCount);

    const addToCart = (book) => {
        if (book.stock <= 0) return showMsg("抱歉，目前缺貨中！");
        setCart(prev => {
            const existing = prev.find(i => i.id === book.id);
            if (existing) {
                return prev.map(i => i.id === book.id ? {...i, qty: i.qty + 1} : i);
            }
            return [...prev, {...book, qty: 1}];
        });
        showMsg(`已加入書包: ${book.title}`);
    };

    const removeFromCart = (id) => { setCart(prev => prev.filter(i => i.id !== id)); };
    
    const updateCartQty = (id, delta) => {
        setCart(prev => {
            return prev.map(i => {
                if (i.id === id) {
                    const newQty = i.qty + delta;
                    if (newQty < 1) return null; 
                    if (newQty > i.stock) {
                        showMsg("已達該書目前庫存上限！");
                        return i;
                    }
                    return { ...i, qty: newQty };
                }
                return i;
            }).filter(Boolean); 
        });
    };

    const cartTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

    // 🛠️ 終極修復：對齊後端 processAction 期望的標準英文欄位名稱
    const handleCheckout = async (e) => {
        e.preventDefault();
        if (isCheckingOut) return;
        
        setIsCheckingOut(true);
        showMsg("訂單處理中，請稍候，請勿關閉視窗...");
        
        const formData = new FormData(e.target);
        const info = Object.fromEntries(formData);
        
        const now = new Date();
        const pad = (n) => n.toString().padStart(2, '0');
        const formattedDate = `${now.getFullYear()}/${pad(now.getMonth() + 1)}/${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
        
        const itemsStr = cart.map(i => `${i.title} x${i.qty}`).join(', ');
        
        let orderId = `ORD-${Math.floor(Math.random() * 10000)}`;
        try {
            const resOrders = await syncWithGAS('FETCH_ORDERS');
            if (resOrders && Array.isArray(resOrders.data)) {
                const nextNum = resOrders.data.length + 1;
                orderId = `ORD-${String(nextNum).padStart(4, '0')}`;
            }
        } catch(error) {}

        const newOrder = {
            id: orderId,
            customer: info.name,       // 對齊 payload.customer
            phone: info.phone,         // 對齊 payload.phone
            address: info.address,     // 對齊 payload.address
            email: info.email,         // 對齊 payload.email
            payment: selectedPayment,  // 對齊 payload.payment
            items: itemsStr,           // 對齊 payload.items
            total: cartTotal,          // 對齊 payload.total
            status: '處理中',          // 對齊 payload.status
            memo: info.memo || ''      // 對齊 payload.memo
        };
        
        const response = await syncWithGAS('CREATE_ORDER', newOrder);
        
        if (response && response.status !== 'error') {
            setBooks(books.map(b => {
                const ci = cart.find(c => c.id === b.id);
                return ci ? { ...b, stock: b.stock - ci.qty } : b;
            }));
            
            setCart([]); 
            setIsCartOpen(false);
            showMsg(`訂單已成功送出！您的單號為：${orderId}`);
        } else {
            showMsg(`訂單建立失敗：${response?.msg || '請檢查後台權限'}`);
        }
        setIsCheckingOut(false);
    };

    // 🛠️ 終極修復：格式完全吻合後端正則拆分公式
    const handleCSSubmit = async (e) => {
        e.preventDefault();
        if (isSubmittingCS) return;
        
        setIsSubmittingCS(true);
        showMsg("訊息傳送中，請稍候...");
        
        const name = e.target.name.value;
        const phone = e.target.phone.value;
        const email = e.target.email.value;
        const msg = e.target.message.value;
        
        const combinedQuery = `【聯絡電話】${phone}\n【Email信箱】${email}\n─────────────────\n【反映內容】\n${msg}`;
        
        const newLog = { 
            id: Date.now(), 
            platform: 'Web官網', 
            user: name, 
            query: combinedQuery 
        };
        
        const response = await syncWithGAS('NEW_CS_MSG', newLog);
        
        if (response && response.status !== 'error') {
            setIsContactOpen(false);
            showMsg("感謝您的反映，客服專員將盡快回覆！");
            e.target.reset();
        } else {
            showMsg(`留言失敗：${response?.msg || '請檢查後台權限'}`);
        }
        setIsSubmittingCS(false);
    };

    const scrollSlider = (direction) => {
        if (sliderRef.current) {
            const { scrollLeft, clientWidth } = sliderRef.current;
            const scrollTo = direction === 'left' ? scrollLeft - clientWidth * 0.8 : scrollLeft + clientWidth * 0.8;
            sliderRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    const renderListFromLines = (text, defaultLines) => {
        const lines = text ? text.split('\n').filter(l => l.trim() !== '') : defaultLines;
        return lines.map((line, idx) => <li key={idx}>{line}</li>);
    };

    const rootStyle = {
        '--primary-color': ui.themeColor,
        '--dark-color': ui.darkThemeColor,
        '--bg-color': ui.lightBgColor,
        '--bg-light': ui.bgLightColor,
        '--text-dark': ui.textDarkColor,
        '--border-color': ui.borderColor,
        '--accent-color': ui.accentColor,
        '--footer-bg': ui.footerBgColor,
        '--body-font': ui.bodyFont || 'Noto Sans TC',
        '--title-font': ui.titleFont || 'Noto Serif TC',
    };

    return (
        <div style={rootStyle} className="selection:bg-[var(--primary-color)] selection:text-white min-h-screen bg-[var(--bg-color)] font-serif transition-all duration-300 relative pb-10 scroll-smooth flex flex-col">
            {/* 導覽列 */}
            <nav className="p-4 md:px-8 border-b border-[var(--border-color)] flex justify-between items-center bg-white/95 backdrop-blur-md sticky top-0 z-40 shadow-sm relative">
                <div className="flex items-center space-x-2 md:space-x-4 cursor-pointer select-none" onClick={() => {
                    if (window.innerWidth < 1024) setIsMobileMenuOpen(!isMobileMenuOpen);
                    else window.scrollTo(0,0);
                }}>
                    {ui.frontendLogoUrl ? (
                        <img src={formatImageUrl(ui.frontendLogoUrl)} className="w-8 h-8 md:w-10 md:h-10 object-contain" alt="Logo" onError={(e)=>{e.target.style.display='none'}} />
                    ) : (
                        <ModernLogo className="w-8 h-8 md:w-10 md:h-10" />
                    )}
                    <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                            <h1 className="text-lg md:text-[22px] font-black text-[var(--dark-color)] tracking-[0.1em] font-sans">{ui.frontendName || settings.systemName}</h1>
                            <ChevronDown className={`lg:hidden transition-transform text-[var(--primary-color)] ${isMobileMenuOpen ? 'rotate-180' : ''}`} size={16} />
                        </div>
                        <span className="text-[8px] md:text-[9px] tracking-[0.22em] text-[var(--primary-color)] font-sans font-bold uppercase block">{ui.systemSubName || settings.systemSubName}</span>
                    </div>
                </div>

                <div className="flex items-center space-x-4 md:space-x-6">
                    <div className="hidden lg:flex space-x-8 text-[15px] font-sans font-bold text-[var(--text-dark)]">
                        <button type="button" onClick={() => setIsAboutOpen(true)} className="hover:text-[var(--primary-color)] transition flex items-center gap-1.5"><Compass size={16}/> {ui.menuAbout}</button>
                        <button type="button" onClick={() => setIframeModal({ isOpen: true, url: ui.urlAboutPresident, title: ui.menuPresident })} className="hover:text-[var(--primary-color)] transition flex items-center gap-1.5"><User size={16}/> {ui.menuPresident}</button>
                        <button type="button" onClick={() => setIframeModal({ isOpen: true, url: ui.urlContactUs, title: ui.menuContact })} className="hover:text-[var(--primary-color)] transition flex items-center gap-1.5"><MessageCircle size={16}/> {ui.menuContact}</button>
                        <button type="button" onClick={openRandomBooksModal} className="hover:text-[var(--primary-color)] transition flex items-center gap-1.5"><Zap size={16}/> {ui.menuNewArrivals}</button>
                        <button type="button" onClick={() => setIsSearchModalOpen(true)} className="hover:text-[var(--bg-light)] transition flex items-center gap-1.5 text-[var(--bg-light)] bg-[var(--dark-color)] hover:bg-[var(--primary-color)] px-4 py-1.5 rounded-full shadow-sm"><Search size={16}/> {ui.menuSearch}</button>
                    </div>
                    
                    <div className="flex items-center space-x-3 md:space-x-4 border-l pl-3 md:pl-4 border-[var(--border-color)]">
                        <button type="button" onClick={() => setIsCartOpen(true)} className="relative bg-[var(--bg-light)] border border-[var(--accent-color)] text-[var(--dark-color)] px-3 md:px-5 py-2.5 rounded-full flex items-center gap-2 hover:bg-[var(--primary-color)] hover:text-white hover:border-[var(--primary-color)] transition-all shadow-sm font-sans font-bold group">
                            <ShoppingCart size={20} className="group-hover:scale-110 transition-transform" />
                            <span className="hidden sm:inline">{ui.menuCart}</span>
                            {cart.length > 0 && <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[12px] min-w-[24px] h-6 px-1 rounded-full flex items-center justify-center font-bold shadow-md border-2 border-white animate-bounce">{cart.length}</span>}
                        </button>
                        <button type="button" onClick={() => window.open('https://www.facebook.com/people/%E6%96%87%E5%8F%B2%E5%93%B2%E5%87%BA%E7%89%88%E7%A4%BE/61590146114229/?locale=zh_TW', '_blank')} className="hidden sm:flex bg-[var(--dark-color)] text-[var(--bg-light)] px-4 py-2.5 rounded-full text-sm font-sans items-center gap-2 hover:bg-[var(--primary-color)] transition shadow-md font-bold">
                            <LayoutDashboard size={16} /> <span className="hidden md:inline">{ui.menuAdmin}</span>
                        </button>
                    </div>
                </div>

                {isMobileMenuOpen && (
                    <div className="absolute top-full left-0 w-full bg-white border-b border-[var(--border-color)] shadow-xl flex flex-col p-2 lg:hidden z-50 animate-in font-sans">
                        <button type="button" onClick={() => { setIsMobileMenuOpen(false); setIsAboutOpen(true); }} className="text-left font-bold text-[var(--text-dark)] hover:text-[var(--primary-color)] hover:bg-[var(--bg-light)] p-4 rounded-xl flex items-center gap-3 transition"><Compass size={18} className="text-[var(--primary-color)]"/> {ui.menuAbout}</button>
                        <button type="button" onClick={() => { setIsMobileMenuOpen(false); setIframeModal({ isOpen: true, url: ui.urlAboutPresident, title: ui.menuPresident }); }} className="text-left font-bold text-[var(--text-dark)] hover:text-[var(--primary-color)] hover:bg-[var(--bg-light)] p-4 rounded-xl flex items-center gap-3 transition"><User size={18} className="text-[var(--primary-color)]"/> {ui.menuPresident}</button>
                        <button type="button" onClick={() => { setIsMobileMenuOpen(false); setIframeModal({ isOpen: true, url: ui.urlContactUs, title: ui.menuContact }); }} className="text-left font-bold text-[var(--text-dark)] hover:text-[var(--primary-color)] hover:bg-[var(--bg-light)] p-4 rounded-xl flex items-center gap-3 transition"><MessageCircle size={18} className="text-[var(--primary-color)]"/> {ui.menuContact}</button>
                        <button type="button" onClick={() => { setIsMobileMenuOpen(false); openRandomBooksModal(); }} className="text-left font-bold text-[var(--text-dark)] hover:text-[var(--primary-color)] hover:bg-[var(--bg-light)] p-4 rounded-xl flex items-center gap-3 transition"><Zap size={18} className="text-[var(--primary-color)]"/> {ui.menuNewArrivals}</button>
                        <div className="border-t border-[var(--border-color)] my-1"></div>
                        <button type="button" onClick={() => { setIsMobileMenuOpen(false); setIsSearchModalOpen(true); }} className="text-left font-bold text-[var(--text-dark)] hover:text-[var(--primary-color)] hover:bg-[var(--bg-light)] p-4 rounded-xl flex items-center gap-3 transition"><Search size={18} className="text-[var(--primary-color)]"/> {ui.menuSearch}</button>
                        <button type="button" onClick={() => { setIsMobileMenuOpen(false); window.open('https://www.facebook.com/people/%E6%96%87%E5%8F%B2%E5%93%B2%E5%87%BA%E7%89%88%E7%A4%BE/61590146114229/?locale=zh_TW', '_blank'); }} className="text-left font-bold text-[var(--text-dark)] hover:text-[var(--primary-color)] hover:bg-[var(--bg-light)] p-4 rounded-xl flex items-center gap-3 transition sm:hidden"><LayoutDashboard size={18} className="text-[var(--primary-color)]"/> {ui.menuAdmin}</button>
                    </div>
                )}
            </nav>

            <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8">
                <section className="text-center mb-8 py-10 animate-in">
                    <h2 className="text-4xl md:text-5xl font-black mb-6 text-[var(--dark-color)] leading-tight font-serif tracking-widest">{ui.heroHeading1} <span className="text-[var(--primary-color)]">{ui.heroHeading2}</span></h2>
                    <p className="text-[var(--text-dark)] max-w-2xl mx-auto leading-loose text-lg font-sans font-medium">{ui.heroSubheading}</p>
                </section>

                {carousels.length > 0 && (
                    <div className="relative w-full max-w-6xl mx-auto h-[350px] md:h-[480px] rounded-2xl overflow-hidden shadow-2xl mb-16 group border-4 border-white">
                        {carousels.map((c, idx) => {
                            const isFbSlide = c.title?.toLowerCase().includes('fb') || c.title?.includes('臉書') || c.description?.toLowerCase().includes('fb') || c.description?.includes('臉書') || c.image?.includes('61590146114229') || c.id === 'fb1' || (idx === 0);
                            const slideLink = c.link || c.url || (isFbSlide ? "https://www.facebook.com/people/%E6%96%87%E5%8F%B2%E5%93%B2%E5%87%BA%E7%89%88%E7%A4%BE/61590146114229/?locale=zh_TW" : null);
                            const SlideContainer = slideLink ? 'a' : 'div';
                            const slideProps = slideLink ? {
                                href: slideLink, target: "_blank", rel: "noopener noreferrer",
                                className: `absolute inset-0 transition-opacity duration-1000 block cursor-pointer group/slide ${idx === carouselIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`
                            } : {
                                className: `absolute inset-0 transition-opacity duration-1000 block ${idx === carouselIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`
                            };

                            return (
                                <SlideContainer key={c.id} {...slideProps}>
                                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--dark-color)]/90 via-[var(--dark-color)]/30 to-transparent z-10"></div>
                                    <img src={formatImageUrl(c.image)} alt={c.title || "Banner"} className="w-full h-full object-cover transform scale-105 group-hover/slide:scale-100 transition duration-[10000ms]" onError={(e)=>{e.target.src='https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=1200'}} />
                                    <div className="absolute bottom-0 left-0 right-0 z-20 p-8 md:p-14 text-white">
                                        {c.title && <h3 className="text-3xl md:text-5xl font-black mb-4 font-serif tracking-widest text-[var(--bg-light)] drop-shadow-xl">{c.title}</h3>}
                                        {c.description && <p className="text-sm md:text-lg max-w-3xl text-gray-200 line-clamp-2 drop-shadow-md font-sans leading-relaxed">{c.description}</p>}
                                        {isFbSlide && (
                                            <div className="mt-4 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-sans font-bold text-xs md:text-sm px-5 py-3 rounded-full shadow-lg transition-all hover:scale-105 active:scale-95 animate-pulse">
                                                <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                                </svg>
                                                <span>立即加入我們！點擊此處直接進入臉書粉絲專頁 ↗</span>
                                            </div>
                                        )}
                                    </div>
                                </SlideContainer>
                            );
                        })}
                        {carousels.length > 1 && (
                            <>
                                <button type="button" onClick={() => setCarouselIndex((prev) => (prev - 1 + carousels.length) % carousels.length)} className="absolute left-6 top-1/2 -translate-y-1/2 z-30 bg-black/20 hover:bg-[var(--dark-color)]/80 text-white p-3 rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 border border-white/20"><ChevronLeft size={24}/></button>
                                <button type="button" onClick={() => setCarouselIndex((prev) => (prev + 1) % carousels.length)} className="absolute right-6 top-1/2 -translate-y-1/2 z-30 bg-black/20 hover:bg-[var(--dark-color)]/80 text-white p-3 rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 border border-white/20"><ChevronRight size={24}/></button>
                                <div className="absolute bottom-6 right-8 z-30 flex gap-3">
                                    {carousels.map((_, idx) => (
                                        <button type="button" key={idx} onClick={() => setCarouselIndex(idx)} className={`h-2.5 rounded-full transition-all duration-300 shadow-sm ${idx === carouselIndex ? 'bg-[var(--primary-color)] w-10' : 'bg-white/60 w-2.5 hover:bg-white'}`}></button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )}

                <section id="new-books" className="mb-20 scroll-mt-24">
                    <div className="flex justify-between items-end mb-6 border-b-2 border-[var(--border-color)] pb-4">
                        <h3 className="text-3xl font-black text-[var(--dark-color)] flex items-center gap-3 font-serif tracking-widest"><BookOpen className="text-[var(--primary-color)]" size={32} /> {ui.sectionTitleFeatured}</h3>
                        {isBooksLoading ? (
                            <div className="text-sm text-[var(--primary-color)] font-sans font-bold flex items-center gap-1.5 bg-[var(--border-color)]/30 px-3 py-1 rounded-full"><RefreshCw size={14} className="animate-spin"/> {ui.msgLoadingInventory}</div>
                        ) : (
                            <div className="text-sm text-[var(--text-dark)] font-sans font-bold flex items-center gap-1.5 bg-[var(--border-color)]/30 px-3 py-1 rounded-full"><Database size={14}/> {ui.msgLoadedInventory}</div>
                        )}
                    </div>

                    <div className="mb-12 relative group animate-in">
                        <h4 className="text-xl font-bold text-[var(--text-dark)] flex items-center gap-2 mb-4 px-2">
                            <Sparkles className="text-[var(--primary-color)]" size={20}/> {ui.sectionTitleRecommendation}
                        </h4>
                        <div className="relative">
                            <button type="button" onClick={()=>scrollSlider('left')} className="absolute -left-3 md:-left-5 top-[45%] -translate-y-1/2 z-10 bg-white border border-[var(--border-color)] hover:bg-[var(--bg-light)] p-2 md:p-3 rounded-full text-[var(--text-dark)] shadow-[0_4px_10px_rgba(0,0,0,0.1)] transition-all flex items-center justify-center opacity-90 hover:opacity-100">
                                <ChevronLeft size={24}/>
                            </button>
                            <button type="button" onClick={()=>scrollSlider('right')} className="absolute -right-3 md:-right-5 top-[45%] -translate-y-1/2 z-10 bg-white border border-[var(--border-color)] hover:bg-[var(--bg-light)] p-2 md:p-3 rounded-full text-[var(--text-dark)] shadow-[0_4px_10px_rgba(0,0,0,0.1)] transition-all flex items-center justify-center opacity-90 hover:opacity-100">
                                <ChevronRight size={24}/>
                            </button>
                            <div className="flex overflow-x-auto gap-6 snap-x snap-mandatory hide-scrollbar pb-6 px-2 pt-2">
                                {displayChoiceBooks.map(book => (
                                    <div key={`rec-${book.id}`} className="min-w-[260px] sm:min-w-[280px] w-[260px] sm:w-[280px] snap-start shrink-0 group/card bg-white border border-[var(--border-color)] rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col shadow-sm">
                                        <div className="h-48 bg-[var(--bg-light)] relative overflow-hidden p-4 flex justify-center">
                                            <div className="w-auto h-full relative shadow-[3px_3px_10px_rgba(0,0,0,0.1)] group-hover/card:scale-105 transition-transform duration-500">
                                                <img src={formatImageUrl(book.cover)} className="h-full object-cover rounded" alt={book.title} onError={(e)=>{e.target.src='https://via.placeholder.com/400x600?text=No+Cover'}} />
                                            </div>
                                            {book.stock <= 0 && <div className="absolute inset-0 bg-[var(--dark-color)]/70 backdrop-blur-[2px] flex items-center justify-center text-white font-black tracking-[0.2em] text-lg">{ui.msgOutOfStock}</div>}
                                        </div>
                                        <div className="p-4 flex flex-col flex-1 bg-white border-t border-[var(--bg-light)]">
                                            <div className="text-[10px] text-[var(--primary-color)] font-bold mb-1">{book.category}</div>
                                            <h3 className="font-bold text-lg mb-1 text-[var(--dark-color)] line-clamp-1" title={book.title}>{book.title}</h3>
                                            <p className="text-[var(--primary-color)] font-black mb-3 text-lg font-sans mt-auto">NT$ {book.price}</p>
                                            <button type="button" onClick={() => addToCart(book)} className="w-full bg-[var(--bg-light)] border border-[var(--accent-color)] text-[var(--text-dark)] py-2 rounded-xl font-bold hover:bg-[var(--primary-color)] hover:border-[var(--primary-color)] hover:text-white transition-all text-sm flex justify-center items-center gap-1.5 group/btn">
                                                <ShoppingCart size={14} className="group-hover/btn:-rotate-12 transition-transform" /> 加入
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {dynamicCategories.length > 1 && (
                        <div className="flex flex-wrap gap-3 mb-10 justify-center animate-in font-sans border-t border-[var(--border-color)] pt-8 mt-8">
                            {visibleCategories.map(cat => (
                                <button type="button" key={cat} onClick={() => { setSelectedCategory(cat); setVisibleCount(8); }} className={`px-6 py-2.5 rounded-full text-[15px] font-bold transition-all shadow-sm border-2 ${selectedCategory === cat ? 'bg-[var(--dark-color)] text-[var(--bg-light)] border-[var(--dark-color)] scale-105 shadow-md' : 'bg-white border-[var(--border-color)] text-[var(--text-dark)] hover:bg-[var(--bg-light)] hover:border-[var(--primary-color)] hover:text-[var(--primary-color)]'}`}>{cat}</button>
                            ))}
                            {dynamicCategories.length > 5 && (
                                <button type="button" onClick={() => setIsAllCategoriesExpanded(!isAllCategoriesExpanded)} className="px-6 py-2.5 rounded-full text-[15px] font-bold transition-all shadow-sm border-2 border-[var(--primary-color)] text-[var(--primary-color)] bg-white hover:bg-[var(--primary-color)] hover:text-white flex items-center gap-1.5 active:scale-95">
                                    {isAllCategoriesExpanded ? "收合類別" : "更多類別"}
                                    {isAllCategoriesExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </button>
                            )}
                        </div>
                    )}
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {visibleBooks.map(book => (
                            <div key={book.id} className="group bg-white border border-[var(--border-color)] rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col hover:-translate-y-2 animate-in shadow-sm">
                                <div className="h-72 bg-[var(--bg-light)] relative overflow-hidden p-4">
                                    <div className="w-full h-full relative shadow-[5px_5px_15px_rgba(0,0,0,0.1)] group-hover:shadow-[5px_5px_25px_rgba(44,36,27,0.2)] transition-shadow duration-500">
                                        <img src={formatImageUrl(book.cover)} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" alt={book.title} onError={(e)=>{e.target.src='https://via.placeholder.com/400x600?text=No+Cover'}} />
                                    </div>
                                    <div className="absolute top-6 left-6 bg-[var(--dark-color)] text-[var(--bg-light)] text-[12px] px-3 py-1 rounded-r-full shadow-md font-sans tracking-widest font-bold border-l-2 border-[var(--primary-color)]">{book.category}</div>
                                    {book.stock <= 0 && <div className="absolute inset-0 bg-[var(--dark-color)]/70 backdrop-blur-[2px] flex items-center justify-center text-white font-black tracking-[0.3em] text-2xl">{ui.msgOutOfStock}</div>}
                                </div>
                                <div className="p-6 flex flex-col flex-1 bg-white border-t border-[var(--bg-light)]">
                                    <h3 className="font-bold text-xl mb-3 text-[var(--dark-color)] line-clamp-2 font-serif leading-snug group-hover:text-[var(--primary-color)] transition-colors" title={book.title}>{book.title}</h3>
                                    <p className="text-[var(--primary-color)] font-black mb-6 text-2xl font-sans mt-auto">NT$ {book.price}</p>
                                    <button type="button" onClick={() => addToCart(book)} className="w-full bg-[var(--bg-light)] border border-[var(--accent-color)] text-[var(--text-dark)] py-3 rounded-xl font-bold hover:bg-[var(--primary-color)] hover:border-[var(--primary-color)] hover:text-white transition-all flex items-center justify-center gap-2 font-sans group/btn">
                                        <ShoppingCart size={18} className="group-hover/btn:-rotate-12 transition-transform" /> 加入書包
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {visibleBooks.length === 0 && (
                        <div className="py-20 text-center font-bold text-[var(--primary-color)] flex flex-col items-center justify-center gap-3">
                            {isBooksLoading ? <RefreshCw className="animate-spin" size={32}/> : <Database size={32}/>}
                            {isBooksLoading ? ui.msgSearchingBooks : ui.msgNoBooksFound}
                        </div>
                    )}

                    {filteredBooks.length > visibleCount && (
                        <div className="text-center mt-16 font-sans relative">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[var(--border-color)]"></div></div>
                            <div className="relative flex justify-center">
                                <button type="button" onClick={() => setVisibleCount(prev => prev + 8)} className="bg-[var(--bg-color)] border-2 border-[var(--accent-color)] text-[var(--text-dark)] px-8 py-3 rounded-full font-bold hover:bg-[var(--dark-color)] hover:border-[var(--dark-color)] hover:text-[var(--bg-light)] transition-all shadow-sm flex items-center gap-2 group">
                                    {ui.sectionMoreBooksBtn} <ChevronRight className="group-hover:translate-x-1 transition-transform" size={18}/>
                                </button>
                            </div>
                        </div>
                    )}
                    
                    {filteredBooks.length <= visibleCount && isBooksLoading && (
                        <div className="text-center mt-16 font-sans relative animate-pulse">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[var(--border-color)] border-dashed"></div></div>
                            <div className="relative flex justify-center">
                                <div className="bg-[var(--bg-color)] border-2 border-[var(--accent-color)] text-[var(--primary-color)] px-6 py-2.5 rounded-full font-bold shadow-sm flex items-center gap-2 text-sm">
                                    <RefreshCw className="animate-spin" size={16}/> {ui.msgLoadingMoreBooks}
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            </main>

            <footer className="bg-[var(--footer-bg)] text-[var(--accent-color)] pt-16 pb-8 font-sans border-t-[8px] border-[var(--primary-color)] mt-auto">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16">
                        <div className="md:col-span-4 flex flex-col">
                            <div className="flex items-center gap-4 mb-6">
                                {ui.frontendLogoUrl ? (
                                    <img src={formatImageUrl(ui.frontendLogoUrl)} className="w-11 h-11 object-contain" alt="Logo" onError={(e)=>{e.target.style.display='none'}} />
                                ) : (
                                    <ModernLogo className="w-11 h-11" color1="#F9F6F0" color2="var(--primary-color)" />
                                )}
                                <div>
                                    <h4 className="text-2xl font-sans font-black text-white tracking-[0.15em]">{ui.frontendName || settings.systemName}</h4>
                                    <span className="text-[10px] font-bold tracking-[0.2em] text-[var(--primary-color)] mt-1 block uppercase">{ui.systemSubName || settings.systemSubName}</span>
                                </div>
                            </div>
                            <p className="text-sm leading-relaxed mb-6 text-justify text-[var(--accent-color)]">{ui.footerBrandDesc}</p>
                            <button type="button" onClick={() => setIsAboutOpen(true)} className="text-white border border-[var(--accent-color)]/40 bg-white/5 hover:bg-[var(--primary-color)] hover:border-[var(--primary-color)] px-5 py-2.5 rounded-lg text-sm font-bold transition-colors inline-flex items-center gap-2 w-max shadow-sm">{ui.footerStoryBtn} <ChevronRight size={14}/></button>
                        </div>
                        
                        <div className="md:col-span-5">
                            <h4 className="text-lg font-bold text-white mb-6 border-b border-white/10 pb-3 flex items-center gap-2"><MapPin size={18} className="text-[var(--primary-color)]"/> {ui.footerContactTitle}</h4>
                            <ul className="space-y-4 text-[15px]">
                                <li className="flex items-start gap-3"><MapPin size={18} className="mt-0.5 flex-shrink-0 text-[var(--primary-color)]" /> <span>{ui.footerAddress}</span></li>
                                <li className="flex items-center gap-3"><Phone size={18} className="flex-shrink-0 text-[var(--primary-color)]" /> <span>{ui.footerPhone}</span></li>
                                <li className="flex items-center gap-3"><Printer size={18} className="flex-shrink-0 text-[var(--primary-color)]" /> <span>{ui.footerFax}</span></li>
                                <li className="flex items-center gap-3"><Mail size={18} className="flex-shrink-0 text-[var(--primary-color)]" /> <a href={`mailto:${ui.footerEmail}`} className="hover:text-white transition">{ui.footerEmail}</a></li>
                                <li className="flex items-center gap-3 text-[var(--bg-light)]">
                                    <Clock size={18} className="flex-shrink-0 text-[var(--primary-color)]" /> 
                                    <span className="bg-white/10 px-3 py-1 rounded text-sm font-bold">{ui.footerHours}</span>
                                </li>
                                <li className="flex items-center gap-3 border-t border-white/10 pt-4 mt-4"><CreditCard size={18} className="flex-shrink-0 text-[var(--primary-color)]" /> <span>{ui.footerTransfer}</span></li>
                            </ul>
                        </div>

                        <div className="md:col-span-3">
                            <h4 className="text-lg font-bold text-white mb-6 border-b border-white/10 pb-3 flex items-center gap-2"><LinkIcon size={18} className="text-[var(--primary-color)]"/> {ui.footerLinksTitle}</h4>
                            <ul className="space-y-4 text-[15px]">
                                 <li>
                                    <a href="https://www.facebook.com/people/%E6%96%87%E5%8F%B2%E5%93%B2%E5%87%BA%E7%89%88%E7%A4%BE/61590146114229/?locale=zh_TW" target="_blank" rel="noreferrer" className="hover:text-white hover:translate-x-1 transition-all flex items-center gap-3 group bg-white/5 p-3 rounded-xl border border-white/5 hover:border-[var(--primary-color)]">
                                        <div className="w-2 h-2 rounded-full bg-[var(--primary-color)] group-hover:bg-white transition-colors"></div> {ui.footerFacebookLinkText}
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    
                    <div className="mt-16 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-sm text-[var(--accent-color)] font-bold">
                        <p>&copy; {new Date().getFullYear()} {ui.frontendName || settings.systemName} {ui.systemSubName || settings.systemSubName}.</p>
                        <p className="mt-2 md:mt-0 flex items-center gap-2"><ModernLogo className="w-4 h-4 opacity-50" color1="#FFF" color2="#FFF" /> {ui.footerCopyright}</p>
                    </div>
                </div>
            </footer>

            {/* 客服懸浮視窗 */}
            <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
                {isContactOpen && (
                    <div className="bg-white w-80 shadow-2xl rounded-2xl border border-[var(--border-color)] overflow-hidden animate-in">
                        <div className="bg-[var(--dark-color)] p-4 text-[var(--bg-light)] flex justify-between items-center font-sans border-b-4 border-[var(--primary-color)]">
                            <span className="font-bold flex items-center gap-2 tracking-wide"><MessageCircle size={18} /> {ui.csTitle}</span>
                            <button type="button" onClick={() => setIsContactOpen(false)} className="hover:bg-white/20 p-1.5 rounded-full transition bg-white/10"><X size={16} /></button>
                        </div>
                        <form onSubmit={handleCSSubmit} className="p-5 space-y-3 font-sans bg-[var(--bg-light)]">
                            <input name="name" placeholder={ui.csNamePlaceholder} required className="w-full border-b-2 border-[var(--accent-color)] bg-transparent p-2 text-sm outline-none focus:border-[var(--primary-color)]" />
                            <input name="phone" placeholder={ui.csPhonePlaceholder} required className="w-full border-b-2 border-[var(--accent-color)] bg-transparent p-2 text-sm outline-none focus:border-[var(--primary-color)]" />
                            <input name="email" type="email" placeholder={ui.csEmailPlaceholder} required className="w-full border-b-2 border-[var(--accent-color)] bg-transparent p-2 text-sm outline-none focus:border-[var(--primary-color)]" />
                            <textarea name="message" placeholder={ui.csMessagePlaceholder} required className="w-full border-2 border-[var(--accent-color)] p-3 text-sm rounded-xl h-24 outline-none focus:border-[var(--primary-color)] bg-white resize-none" />
                            <button disabled={isSubmittingCS} className={`w-full bg-[var(--dark-color)] text-white py-3 rounded-xl font-bold shadow-md transition-colors flex justify-center items-center gap-2 ${isSubmittingCS ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[var(--primary-color)] active:scale-[0.98]'}`}>
                                {isSubmittingCS ? <Clock className="animate-spin" size={18} /> : null}
                                {isSubmittingCS ? ui.csSubmittingBtn : ui.csSubmitBtn}
                            </button>
                        </form>
                    </div>
                )}
                <div className="flex flex-col gap-3">
                    {showBackToTop && (
                        <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="bg-white text-[var(--primary-color)] w-12 h-12 rounded-full shadow-xl flex items-center justify-center hover:scale-105 hover:bg-[var(--primary-color)] hover:text-white transition-all border border-[var(--border-color)] self-end animate-in">
                            <ChevronUp size={24} />
                        </button>
                    )}
                    <button type="button" onClick={() => setIsContactOpen(!isContactOpen)} className="bg-[var(--dark-color)] text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:scale-105 hover:bg-[var(--primary-color)] transition-all border-2 border-[var(--bg-light)]">
                        {isContactOpen ? <X size={28} /> : <MessageCircle size={28} />}
                    </button>
                </div>
            </div>

            {/* 關於我們 Modal */}
            {isAboutOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[150] flex justify-center items-center p-4 md:p-8" onClick={() => setIsAboutOpen(false)}>
                    <div className="bg-[var(--bg-light)] w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in" onClick={(e) => e.stopPropagation()}>
                        <div className="bg-[var(--dark-color)] p-4 flex justify-between items-center border-b-4 border-[var(--primary-color)]">
                            <h2 className="text-xl font-serif font-black text-[var(--bg-light)] flex items-center gap-3 tracking-widest"><Compass size={24} className="text-[var(--primary-color)]" /> {ui.aboutStoryTitle}</h2>
                            <button type="button" onClick={() => setIsAboutOpen(false)} className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full text-sm font-bold text-white transition flex items-center gap-2"><X size={16} /> {ui.aboutCloseBtn}</button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 md:p-12 font-sans relative">
                            <ModernLogo className="absolute w-96 h-96 -right-20 -top-10 -z-10 pointer-events-none opacity-5" color1="var(--dark-color)" color2="var(--dark-color)" />
                            <h1 className="text-3xl md:text-4xl font-sans font-black text-[var(--dark-color)] mb-8 text-center tracking-[0.1em] border-b pb-6 border-[var(--border-color)]">{ui.frontendName || settings.systemName}</h1>
                            <div className="space-y-8 text-[var(--text-dark)] leading-[2.2] text-justify text-base md:text-lg">
                                <div>
                                    <h3 className="font-bold text-xl text-[var(--dark-color)] mb-4 flex items-center gap-2"><Compass size={20} className="text-[var(--primary-color)]"/> {ui.aboutIntroTitle}</h3>
                                    <p className="drop-cap">{ui.aboutIntroP1}</p>
                                </div>
                                <div className="bg-white p-6 rounded-xl border-l-4 border-[var(--primary-color)] shadow-sm">{ui.aboutIntroP2}</div>
                                <div>
                                    <h3 className="font-bold text-xl text-[var(--dark-color)] mb-4 flex items-center gap-2"><Globe size={20} className="text-[var(--primary-color)]"/> {ui.aboutConceptTitle}</h3>
                                    <p>{ui.aboutConceptP1}</p>
                                </div>
                                <div className="pt-6 border-t border-[var(--border-color)]">
                                    <h3 className="font-bold text-xl text-[var(--dark-color)] mb-4 flex items-center gap-2"><BookOpen size={20} className="text-[var(--primary-color)]"/> {ui.aboutAuthorTitle}</h3>
                                    <div className="bg-[var(--dark-color)] text-[var(--bg-light)] p-6 rounded-xl leading-relaxed space-y-5">
                                        <p>{ui.aboutAuthorIntro}</p>
                                        <div>
                                            <span className="text-[var(--primary-color)] font-bold border-b border-[var(--primary-color)]/30 pb-1 block mb-3">{ui.aboutAuthorLit}</span>
                                            <ul className="list-disc list-inside pl-2 space-y-1.5 text-[15px]">
                                                {renderListFromLines(ui.aboutAuthorLitItems, ['無名氏（卜乃夫）《塔裡的女人》', '馮馮《霧航》', '紀弦、羅門、辛鬱等'])}
                                            </ul>
                                        </div>
                                        <div>
                                            <span className="text-[var(--primary-color)] font-bold border-b border-[var(--primary-color)]/30 pb-1 block mb-3">{ui.aboutAuthorAcad}</span>
                                            <ul className="list-disc list-inside pl-2 space-y-1.5 text-[15px]">
                                                {renderListFromLines(ui.aboutAuthorAcadItems, ['昌彼得《中國目錄學》', '嚴靈峰等學者著作', '龔鵬程、鄭樑生《中日關係史研究論集》', '莊吉發《清史論集》、《滿語叢刊》', '蔡宗陽《文心雕龍與經學》、《修辭學》等'])}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-12 text-center">
                                 <button type="button" onClick={() => setIsAboutOpen(false)} className="bg-[var(--dark-color)] text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-[var(--primary-color)] transition-colors">{ui.aboutStartExploringBtn}</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 書籍檢索 Modal */}
            {isSearchModalOpen && (
                <div className="fixed inset-0 bg-[var(--bg-light)] z-[150] overflow-y-auto animate-in flex flex-col">
                    <nav className="p-4 md:px-8 border-b border-[var(--border-color)] flex justify-between items-center bg-white shadow-sm sticky top-0 z-40">
                        <div className="flex items-center space-x-3">
                            {ui.frontendLogoUrl ? (
                                <img src={formatImageUrl(ui.frontendLogoUrl)} className="w-8 h-8 object-contain" alt="Logo" onError={(e)=>{e.target.style.display='none'}} />
                            ) : (
                                <ModernLogo className="w-8 h-8" />
                            )}
                            <div>
                                <h1 className="text-xl font-black text-[var(--dark-color)] tracking-[0.1em] font-sans">{ui.searchTitle}</h1>
                                <span className="text-[10px] tracking-widest text-[var(--primary-color)] font-sans font-bold">{ui.frontendName || settings.systemName}{ui.searchSubtitle}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button type="button" onClick={() => setIsCartOpen(true)} className="relative bg-[var(--bg-light)] border border-[var(--accent-color)] text-[var(--dark-color)] px-4 py-2 rounded-full flex items-center gap-2 hover:bg-[#E6D5C3] transition-all shadow-sm font-sans font-bold group">
                                <ShoppingCart size={18} className="group-hover:scale-110 transition-transform" />
                                <span className="hidden sm:inline">{ui.menuCart}</span>
                                {cart.length > 0 && <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[12px] min-w-[24px] h-6 px-1 rounded-full flex items-center justify-center font-bold shadow-md border-2 border-white animate-bounce">{cart.length}</span>}
                            </button>
                            <button type="button" onClick={() => setIsSearchModalOpen(false)} className="bg-[var(--accent-color)]/40 border border-[var(--accent-color)] hover:bg-[var(--accent-color)]/80 px-4 py-2 rounded-full text-sm font-bold text-[var(--text-dark)] transition flex items-center gap-2 shadow-sm">
                                <X size={16} /> <span className="hidden sm:inline">關閉檢索</span>
                            </button>
                        </div>
                    </nav>
                    <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8">
                        <div className="mb-8 flex justify-between items-end border-b-2 border-[var(--border-color)] pb-4">
                            <h3 className="text-3xl font-black text-[#36454F] flex items-center gap-3 font-serif tracking-widest">{ui.searchFilterTitle}</h3>
                            <div className="text-sm text-[var(--primary-color)] font-sans font-bold flex items-center gap-1.5">查詢到共 <span className="text-xl font-black bg-[var(--border-color)]/30 px-2 rounded">{indexSearchBooks.length}</span> 本書籍</div>
                        </div>
                        <form onSubmit={handleSearchSubmit} className="bg-white p-6 md:p-8 rounded-2xl border border-[var(--border-color)] shadow-sm mb-10 font-sans">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                <div><label className="block text-sm font-bold text-[var(--text-dark)] mb-2">{ui.searchLabelCode}</label><input type="text" value={searchForm.code} onChange={(e) => setSearchForm({...searchForm, code: e.target.value})} className="w-full border-2 border-[var(--border-color)] p-3 rounded-xl outline-none focus:border-[var(--primary-color)] bg-[var(--bg-light)]" /></div>
                                <div><label className="block text-sm font-bold text-[var(--text-dark)] mb-2">{ui.searchLabelTitle}</label><input type="text" value={searchForm.title} onChange={(e) => setSearchForm({...searchForm, title: e.target.value})} className="w-full border-2 border-[var(--border-color)] p-3 rounded-xl outline-none focus:border-[var(--primary-color)] bg-[var(--bg-light)]" /></div>
                                <div><label className="block text-sm font-bold text-[var(--text-dark)] mb-2">{ui.searchLabelAuthor}</label><input type="text" value={searchForm.author} onChange={(e) => setSearchForm({...searchForm, author: e.target.value})} className="w-full border-2 border-[var(--border-color)] p-3 rounded-xl outline-none focus:border-[var(--primary-color)] bg-[var(--bg-light)]" /></div>
                                <div><label className="block text-sm font-bold text-[var(--text-dark)] mb-2">{ui.searchLabelYear}</label><input type="text" value={searchForm.year} onChange={(e) => setSearchForm({...searchForm, year: e.target.value})} className="w-full border-2 border-[var(--border-color)] p-3 rounded-xl outline-none focus:border-[var(--primary-color)] bg-[var(--bg-light)]" /></div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-[var(--text-dark)] mb-2">{ui.searchLabelCategory}</label>
                                    <select value={searchForm.category} onChange={(e) => setSearchForm({...searchForm, category: e.target.value})} className="w-full border-2 border-[var(--border-color)] p-3 rounded-xl outline-none focus:border-[var(--primary-color)] bg-[var(--bg-light)]">
                                        <option value="">全部</option>
                                        {excelCategories.map(cat => (<option key={cat} value={cat}>{cat}</option>))}
                                    </select>
                                </div>
                            </div>
                            <button type="submit" className="bg-[var(--dark-color)] text-[var(--bg-light)] px-8 py-3 rounded-full font-bold hover:bg-[var(--primary-color)] transition-colors flex items-center gap-2 shadow-sm border border-transparent active:scale-95"><Search size={18} /> {ui.searchBtnQuery}</button>
                        </form>
                        <div className="bg-white border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-sm font-sans mb-8">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-[900px]">
                                    <thead>
                                        <tr className="bg-[var(--dark-color)] text-[var(--bg-light)] text-[15px] tracking-wider border-b-4 border-[var(--primary-color)]">
                                            <th className="p-4 font-bold whitespace-nowrap">{ui.searchTableHeaderCode}</th><th className="p-4 font-bold min-w-[200px]">{ui.searchTableHeaderTitle}</th>
                                            <th className="p-4 font-bold">{ui.searchTableHeaderAuthor}</th><th className="p-4 font-bold">{ui.searchTableHeaderYear}</th><th className="p-4 font-bold">{ui.searchTableHeaderPrice}</th>
                                            <th className="p-4 font-bold">{ui.searchTableHeaderCategory}</th><th className="p-4 font-bold text-center">{ui.searchTableHeaderAction}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[var(--border-color)]">
                                        {visibleSearchBooks.map((book, idx) => (
                                            <tr key={book.id || idx} className="hover:bg-[var(--bg-light)] transition-colors text-[var(--dark-color)] text-sm group">
                                                <td className="p-4 font-mono text-[var(--primary-color)] border-b border-dashed border-[var(--border-color)]">{book.id || '-'}</td>
                                                <td className="p-4 font-bold border-b border-dashed border-[var(--border-color)] flex items-center gap-3">
                                                    <img src={formatImageUrl(book.cover)} className="w-10 h-12 object-cover rounded shadow-sm border bg-white" onError={(e)=>{e.target.src='https://via.placeholder.com/400x600?text=No+Cover'}} />
                                                    {book.title}
                                                </td>
                                                <td className="p-4 border-b border-dashed border-[var(--border-color)]">{book.author || '-'}</td>
                                                <td className="p-4 border-b border-dashed border-[var(--border-color)]">{book.year || '-'}</td>
                                                <td className="p-4 font-bold text-[var(--primary-color)] border-b border-dashed border-[var(--border-color)]">{book.price ? `${book.price}元` : '-'}</td>
                                                <td className="p-4 border-b border-dashed border-[var(--border-color)]">{book.category || '-'}</td>
                                                <td className="p-3 text-center border-b border-dashed border-[var(--border-color)]">
                                                    {book.stock > 0 ? (
                                                        <button type="button" onClick={() => addToCart(book)} className="bg-white border border-[var(--accent-color)] text-[var(--dark-color)] p-2.5 rounded-lg hover:bg-[var(--primary-color)] hover:text-white transition-all shadow-sm flex items-center justify-center mx-auto active:scale-95"><ShoppingCart size={18} /></button>
                                                    ) : (<span className="text-gray-400 font-bold text-xs bg-gray-100 px-2 py-1 rounded">缺貨中</span>)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {indexSearchBooks.length > searchVisibleCount && (
                            <div className="text-center font-sans mb-10">
                                <button type="button" onClick={() => setSearchVisibleCount(prev => prev + 8)} className="bg-[var(--bg-light)] border-2 border-[var(--accent-color)] text-[var(--dark-color)] px-8 py-3 rounded-full font-bold hover:bg-[var(--dark-color)] hover:text-[var(--bg-light)] transition-all flex items-center gap-2 mx-auto shadow-sm">
                                    {ui.searchBtnMore} <ChevronRight size={18}/>
                                </button>
                            </div>
                        )}
                    </main>
                </div>
            )}

            {/* 新書上市彈窗 */}
            {isRandomBooksOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[150] flex justify-center items-center p-4 md:p-8" onClick={() => setIsRandomBooksOpen(false)}>
                    <div className="bg-[var(--bg-light)] w-full max-w-6xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in" onClick={(e) => e.stopPropagation()}>
                        <div className="bg-[var(--dark-color)] p-4 flex justify-between items-center border-b-4 border-[var(--primary-color)]">
                            <h2 className="text-xl font-serif font-black text-[var(--bg-light)] flex items-center gap-3 tracking-widest"><Zap size={24} className="text-[var(--primary-color)]" /> {ui.newArrivalsTitle}</h2>
                            <button type="button" onClick={() => setIsRandomBooksOpen(false)} className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full text-sm font-bold text-white transition flex items-center gap-2"><X size={16} /> {ui.newArrivalsCloseBtn}</button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 md:p-8 font-sans">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {randomBooks.map(book => (
                                    <div key={book.id} className="group bg-white border border-[var(--border-color)] rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col shadow-sm">
                                        <div className="h-64 bg-[var(--bg-light)] relative overflow-hidden p-4">
                                            <div className="w-full h-full relative shadow-[3px_3px_10px_rgba(0,0,0,0.1)] group-hover:scale-105 transition-transform duration-500">
                                                <img src={formatImageUrl(book.cover)} className="w-full h-full object-cover" alt={book.title} onError={(e)=>{e.target.src='https://via.placeholder.com/400x600?text=No+Cover'}} />
                                            </div>
                                            <div className="absolute top-4 left-4 bg-[var(--dark-color)] text-[var(--bg-light)] text-[10px] px-2 py-1 rounded-r-full shadow-md font-sans tracking-widest font-bold border-l-2 border-[var(--primary-color)]">{book.category}</div>
                                            {book.stock <= 0 && <div className="absolute inset-0 bg-[var(--dark-color)]/70 backdrop-blur-[2px] flex items-center justify-center text-white font-black tracking-[0.3em] text-xl">{ui.msgOutOfStock}</div>}
                                        </div>
                                        <div className="p-5 flex flex-col flex-1 bg-white border-t border-[var(--bg-light)]">
                                            <h3 className="font-bold text-lg mb-2 text-[var(--dark-color)] line-clamp-2 font-serif leading-snug group-hover:text-[var(--primary-color)] transition-colors" title={book.title}>{book.title}</h3>
                                            <p className="text-[var(--primary-color)] font-black mb-4 text-xl font-sans mt-auto">NT$ {book.price}</p>
                                            <button type="button" onClick={() => addToCart(book)} className="w-full bg-[var(--bg-light)] border border-[var(--accent-color)] text-[var(--text-dark)] py-2.5 rounded-xl font-bold hover:bg-[var(--primary-color)] hover:border-[var(--primary-color)] hover:text-white transition-all flex items-center justify-center gap-2 font-sans group/btn">
                                                <ShoppingCart size={18} className="group-hover/btn:-rotate-12 transition-transform" /> 加入書包
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-8 text-center">
                                <button type="button" onClick={openRandomBooksModal} className="bg-[var(--dark-color)] text-white px-8 py-3 rounded-full font-bold shadow-md hover:bg-[var(--primary-color)] transition flex items-center justify-center mx-auto gap-2"><Zap size={18} /> {ui.newArrivalsBtnRefresh}</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 我的書包 購物車 Modal */}
            {isCartOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex justify-center items-start md:items-center p-0 md:p-8 overflow-y-auto custom-scrollbar" onClick={() => setIsCartOpen(false)}>
                    <div className={`bg-[var(--bg-light)] w-full h-auto md:h-[85vh] ${isCartDetailsOpen ? 'md:max-w-5xl' : 'md:max-w-md'} flex flex-col md:flex-row shadow-2xl rounded-t-2xl md:rounded-2xl overflow-visible md:overflow-hidden mt-4 md:mt-0 font-sans shrink-0`} onClick={(e) => e.stopPropagation()}>
                        
                        <div className="flex md:hidden shrink-0 bg-white border-b border-[var(--border-color)] text-xs font-sans w-full">
                            <button type="button" onClick={() => setIsCartDetailsOpen(true)} className={`flex-1 py-4 text-center font-bold border-b-4 transition-all flex items-center justify-center gap-1.5 ${isCartDetailsOpen ? 'border-[var(--primary-color)] text-[var(--primary-color)] bg-[var(--bg-light)]/40 font-black' : 'border-transparent text-gray-400'}`}><ShoppingCart size={14} /> <span>1. 確認書包 ({cart.reduce((s, i) => s + i.qty, 0)}本)</span></button>
                            <button type="button" onClick={() => { if (cart.length > 0) setIsCartDetailsOpen(false); else showMsg("書包內尚無圖書，請先挑選書籍！"); }} className={`flex-1 py-4 text-center font-bold border-b-4 transition-all flex items-center justify-center gap-1.5 ${!isCartDetailsOpen ? 'border-[var(--primary-color)] text-[var(--primary-color)] bg-[var(--bg-light)]/40 font-black' : 'border-transparent text-gray-400'}`}><FileText size={14} /> <span>2. 收件結帳</span></button>
                        </div>

                        {isCartDetailsOpen && (
                            <div className="flex-1 flex flex-col bg-[var(--bg-light)] overflow-visible md:overflow-hidden border-b md:border-b-0 md:border-r border-[var(--border-color)] animate-in shrink-0 md:shrink">
                                <div className="sticky top-0 z-10 p-5 md:p-6 border-b border-[var(--border-color)] flex justify-between items-center bg-white shrink-0">
                                    <h2 className="text-xl md:text-2xl font-black flex items-center gap-3 text-[var(--dark-color)] font-serif tracking-widest"><ShoppingCart className="text-[var(--primary-color)]" size={28} /> {ui.cartTitle}</h2>
                                    <button type="button" onClick={() => setIsCartOpen(false)} className="bg-[var(--bg-light)] border border-[var(--accent-color)] hover:bg-[#E6D5C3] px-4 py-2 rounded-full text-sm font-bold text-[var(--text-dark)] transition flex items-center gap-1.5 shadow-sm"><X size={16} /> {ui.cartCloseBtn}</button>
                                </div>
                                <div className="flex-1 overflow-y-visible md:overflow-y-auto p-4 md:p-6 custom-scrollbar md:max-h-[calc(85vh-160px)]">
                                    {cart.length === 0 ? (
                                        <div className="text-center mt-10 md:mt-20 flex flex-col items-center gap-6">
                                            <div className="w-24 h-24 bg-[var(--border-color)]/30 rounded-full flex items-center justify-center text-[var(--accent-color)]"><ShoppingCart size={48} /></div>
                                            <p className="text-[var(--primary-color)] font-bold text-lg">{ui.cartEmptyText}</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {cart.map(i => (
                                                <div key={i.id} className="flex gap-4 items-center bg-white p-4 rounded-xl border border-[var(--border-color)] shadow-sm relative group">
                                                    <div className="w-20 h-28 flex-shrink-0 bg-gray-100 rounded overflow-hidden border border-[var(--border-color)] shadow-sm">
                                                        <img src={formatImageUrl(i.cover)} alt={i.title} className="w-full h-full object-cover" onError={(e)=>{e.target.src='https://via.placeholder.com/150?text=No+Cover'}} />
                                                    </div>
                                                    <div className="flex flex-col flex-1">
                                                        <p className="font-bold text-[var(--dark-color)] mb-2 font-serif text-lg leading-tight line-clamp-2 pr-8">{i.title}</p>
                                                        <p className="text-lg text-[var(--primary-color)] font-black mb-3">NT$ {i.price}</p>
                                                        <div className="flex items-center">
                                                            <div className="flex items-center border border-[var(--accent-color)] rounded-lg overflow-hidden h-9 bg-white">
                                                                <button type="button" onClick={() => updateCartQty(i.id, -1)} className="px-3 hover:bg-[#E6D5C3] text-[var(--text-dark)] transition font-bold"><Minus size={16} /></button>
                                                                <span className="px-4 text-sm font-bold text-[var(--dark-color)] bg-[var(--bg-light)] min-w-[40px] text-center border-x border-[var(--accent-color)]">{i.qty}</span>
                                                                <button type="button" onClick={() => updateCartQty(i.id, 1)} className="px-3 hover:bg-[#E6D5C3] text-[var(--text-dark)] transition font-bold"><Plus size={16} /></button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <button type="button" onClick={() => removeFromCart(i.id)} className="absolute top-4 right-4 text-[var(--accent-color)] hover:text-red-500 hover:bg-red-50 p-2.5 rounded-full transition-colors"><Trash2 size={18}/></button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                {cart.length > 0 && (
                                    <div className="p-4 bg-white border-t border-[var(--border-color)] md:hidden shrink-0">
                                        <button type="button" onClick={() => setIsCartDetailsOpen(false)} className="w-full bg-[var(--primary-color)] hover:bg-[var(--dark-color)] text-white py-3.5 rounded-xl font-bold flex justify-center items-center gap-2 active:scale-95 transition-all shadow-md text-base">下一步：填寫收件資訊 <ChevronRight size={18} /></button>
                                    </div>
                                )}
                            </div>
                        )}

                        {cart.length > 0 && (
                            <div className={`w-full md:w-[400px] lg:w-[450px] bg-white p-6 shadow-[-10px_0_20px_rgba(0,0,0,0.02)] flex flex-col shrink-0 overflow-y-visible md:overflow-y-auto md:max-h-[85vh] custom-scrollbar ${isCartDetailsOpen ? 'hidden md:flex' : 'flex'}`}>
                                <div className="flex flex-col gap-2 bg-[var(--bg-light)] p-5 rounded-xl border border-[var(--border-color)] mb-6">
                                    <div className="flex justify-between items-center mb-1">
                                        <button type="button" onClick={() => setIsCartDetailsOpen(!isCartDetailsOpen)} className="text-[var(--primary-color)] text-sm font-bold flex items-center gap-1 bg-[var(--border-color)]/30 hover:bg-[var(--border-color)]/50 px-3 py-1.5 rounded-lg transition active:scale-95">
                                            {isCartDetailsOpen ? <><ChevronLeft size={16} /><span>收起明細</span></> : <><ChevronRight size={16} className="hidden md:inline"/><ChevronLeft size={16} className="md:hidden"/><span className="hidden md:inline">展開明細</span><span className="md:hidden">‹ 返回修改書包</span></>}
                                            <span className="ml-1 opacity-75">({cart.reduce((s, i) => s + i.qty, 0)}本)</span>
                                        </button>
                                        {!isCartDetailsOpen && <button type="button" onClick={() => setIsCartOpen(false)} className="bg-white border border-[var(--accent-color)] hover:bg-[#E6D5C3] px-3 py-1 rounded-full text-xs font-bold text-[var(--text-dark)] transition flex items-center gap-1 shadow-sm"><X size={12} /> {ui.cartCloseBtn}</button>}
                                    </div>
                                    <div className="flex items-baseline justify-between mt-1 text-left border-t border-[var(--border-color)] pt-3">
                                        <span className="font-bold text-[var(--dark-color)] text-xl">{ui.cartTotalLabel}</span>
                                        <span className="text-4xl font-black text-[var(--primary-color)]">NT$ {cartTotal.toLocaleString()}</span>
                                    </div>
                                </div>
                                <form onSubmit={handleCheckout} className="space-y-4 flex-1 flex flex-col">
                                    <div className="text-sm font-bold text-[var(--primary-color)] border-b border-[var(--border-color)] pb-2 mb-2 flex items-center gap-2"><MapPin size={16} /> {ui.cartCheckoutTitle}</div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div><label className="block text-xs font-bold text-gray-500 mb-1">{ui.cartLabelName}</label><input name="name" required className="w-full border-2 border-[var(--border-color)] p-3 rounded-xl focus:border-[var(--primary-color)] bg-[var(--bg-light)] text-sm outline-none" /></div>
                                        <div><label className="block text-xs font-bold text-gray-500 mb-1">{ui.cartLabelPhone}</label><input name="phone" required className="w-full border-2 border-[var(--border-color)] p-3 rounded-xl focus:border-[var(--primary-color)] bg-[var(--bg-light)] text-sm outline-none" /></div>
                                    </div>
                                    <div><label className="block text-xs font-bold text-gray-500 mb-1">{ui.cartLabelEmail}</label><input name="email" type="email" required className="w-full border-2 border-[var(--border-color)] p-3 rounded-xl focus:border-[var(--primary-color)] bg-[var(--bg-light)] text-sm outline-none" /></div>
                                    <div><label className="block text-xs font-bold text-gray-500 mb-1">{ui.cartLabelAddress}</label><input name="address" required className="w-full border-2 border-[var(--border-color)] p-3 rounded-xl focus:border-[var(--primary-color)] bg-[var(--bg-light)] text-sm outline-none" /></div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">{ui.cartLabelPayment}</label>
                                        <select name="payment" value={selectedPayment} onChange={(e) => setSelectedPayment(e.target.value)} className="w-full border-2 border-[var(--border-color)] p-3 rounded-xl focus:border-[var(--primary-color)] bg-[var(--bg-light)] text-sm font-bold text-[var(--dark-color)] outline-none">
                                            <option value="店取付現金">{ui.cartOptionCash}</option>
                                            <option value="銀行轉帳（運費另計）">銀行轉帳（運費另計）</option>
                                        </select>
                                    </div>

                                    {selectedPayment === '銀行轉帳（運費另計）' && (
                                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-[var(--text-dark)] leading-relaxed animate-in text-left">
                                            <p className="font-bold text-[var(--primary-color)] mb-1 flex items-center gap-1">🏦 郵政劃撥資訊：</p>
                                            <p className="mb-1">來電詢問：<span className="font-mono font-bold">📞 886-02-2351-1028</span></p>
                                            <p className="flex items-center text-gray-700 mb-1"><span className="w-12 shrink-0">帳號：</span><a href={ui.footerFacebookUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center font-bold text-blue-600 hover:text-blue-800 hover:underline">📘 詳情請私訊臉書專頁詢問 ↗</a></p>
                                            <p className="flex items-center text-gray-700"><span className="w-12 shrink-0">戶名：</span><a href={ui.footerFacebookUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center font-bold text-blue-600 hover:text-blue-800 hover:underline">📘 詳情請私訊臉書專頁詢問 ↗</a></p>
                                            <p className="mt-2 text-gray-500 border-t border-amber-200/60 pt-2">※ 轉帳完成後，請於下方「寄件備註」填寫您的「轉帳後五碼」或「劃撥單姓名」，以利快速對帳出貨。</p>
                                        </div>
                                    )}
                                    {selectedPayment === '店取付現金' && (
                                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 text-xs text-[var(--text-dark)] leading-relaxed animate-in">
                                            <p className="font-bold text-emerald-800 mb-1 flex items-center gap-1">🏪 門市取貨地點：</p>
                                            <p>台北市中正區羅斯福路一段72巷4號（文史哲門市）</p>
                                            <p className="text-gray-500 mt-1.5">※ 書籍備妥後，客服專員將致電與您確認前來取書時間，屆時現場現金付款取書即可。</p>
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">{ui.cartLabelMemo}</label>
                                        <textarea name="memo" placeholder={ui.cartMemoPlaceholder} className="w-full border-2 border-[var(--border-color)] p-3 rounded-xl focus:border-[var(--primary-color)] bg-[var(--bg-light)] text-sm outline-none h-16 resize-none"></textarea>
                                    </div>
                                    <button type="submit" disabled={isCheckingOut} className={`w-full bg-[var(--dark-color)] text-white py-4 rounded-xl font-bold mt-auto shadow-lg transition-colors flex justify-center items-center gap-2 text-lg mb-12 md:mb-0 ${isCheckingOut ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[var(--primary-color)] active:scale-[0.98]'}`}>
                                        {isCheckingOut ? <Clock className="animate-spin" size={22} /> : <CheckCircle size={22} />}
                                        {isCheckingOut ? ui.cartCheckingOutBtn : ui.cartBtnCheckout}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            )}
            
            {/* iframe 彈窗 */}
            {iframeModal.isOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] flex justify-center items-center p-4 md:p-8" onClick={() => setIframeModal(prev => ({ ...prev, isOpen: false }))}>
                    <div className="bg-[var(--bg-light)] w-full max-w-5xl h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in font-sans border border-[var(--border-color)]" onClick={(e) => e.stopPropagation()}>
                        <div className="p-4 md:p-5 border-b-2 border-[var(--border-color)] flex justify-between items-center bg-white">
                            <h2 className="text-xl font-black flex items-center gap-3 text-[var(--dark-color)] font-serif tracking-widest">{iframeModal.title}</h2>
                            <button type="button" onClick={() => setIframeModal(prev => ({ ...prev, isOpen: false }))} className="bg-[var(--bg-light)] border border-[var(--accent-color)] hover:bg-[#E6D5C3] px-4 py-2 rounded-full text-sm font-bold text-[var(--text-dark)] transition flex items-center gap-2 shadow-sm"><X size={16} /> {ui.cartCloseBtn}</button>
                        </div>
                        <div className="flex-1 w-full bg-white relative overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
                            {iframeModal.url && <iframe src={iframeModal.url} className="w-full h-full border-0 min-h-[600px]"></iframe>}
                        </div>
                    </div>
                </div>
            )}

            {/* 彈出通知 */}
            {notification && (
                <div className="fixed bottom-24 md:bottom-10 left-1/2 -translate-x-1/2 bg-[var(--dark-color)] text-white px-6 py-4 rounded-xl shadow-2xl animate-in font-bold text-[15px] z-[300] flex items-center gap-3 border-l-4 border-[var(--primary-color)] whitespace-nowrap">
                    <CheckCircle size={20} className="text-[var(--accent-color)]" /> {notification}
                </div>
            )}
        </div> 
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);