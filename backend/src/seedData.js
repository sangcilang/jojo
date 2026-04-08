const bcrypt = require("bcryptjs");

const categories = [
  "RAM",
  "SSD",
  "HDD",
  "CPU",
  "Mainboard",
  "GPU",
  "Case",
  "Cooling",
  "PSU",
  "Monitor",
  "Laptop",
  "Accessory",
];

const baseProducts = [
  { id: "prd-1", sku: "ZNS-0001", name: "Corsair Vengeance 16GB DDR4 3200", category: "RAM", price: 1190000, warrantyMonths: 6, stock: 25, image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80", specs: ["16GB (2x8GB)", "DDR4 3200MHz", "CL16"], description: "Bo RAM pho thong on dinh cho gaming va van phong." },
  { id: "prd-2", sku: "ZNS-0002", name: "Kingston Fury Beast 32GB DDR4 3600", category: "RAM", price: 2090000, warrantyMonths: 9, stock: 16, image: "https://images.unsplash.com/photo-1541029071515-84cc54f84dc5?auto=format&fit=crop&w=900&q=80", specs: ["32GB (2x16GB)", "DDR4 3600MHz", "Tan nhiet nhom"], description: "Lua chon can bang cho da nhiem va streamer." },
  { id: "prd-3", sku: "ZNS-0003", name: "G.Skill Ripjaws 16GB DDR5 5600", category: "RAM", price: 1890000, warrantyMonths: 9, stock: 18, image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=900&q=80", specs: ["16GB", "DDR5 5600MHz", "Dien ap thap"], description: "RAM DDR5 doi moi cho nen tang moi." },
  { id: "prd-4", sku: "ZNS-0004", name: "TeamGroup T-Force Delta RGB 32GB DDR5 6000", category: "RAM", price: 3290000, warrantyMonths: 12, stock: 12, image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=900&q=80", specs: ["32GB (2x16GB)", "DDR5 6000MHz", "RGB Sync"], description: "Bo nho hieu nang cao cho gaming cao cap." },
  { id: "prd-5", sku: "ZNS-0005", name: "Samsung 970 EVO Plus 500GB", category: "SSD", price: 1490000, warrantyMonths: 6, stock: 20, image: "https://images.unsplash.com/photo-1591489378430-ef2f4c626b35?auto=format&fit=crop&w=900&q=80", specs: ["NVMe PCIe 3.0", "3500MB/s", "M.2 2280"], description: "SSD NVMe toc do cao cho OS va app chinh." },
  { id: "prd-6", sku: "ZNS-0006", name: "WD Black SN770 1TB", category: "SSD", price: 1990000, warrantyMonths: 9, stock: 22, image: "https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=900&q=80", specs: ["NVMe PCIe 4.0", "5150MB/s", "Game Mode"], description: "SSD hieu nang cao cho game va phan mem nang." },
  { id: "prd-7", sku: "ZNS-0007", name: "Crucial P3 Plus 2TB", category: "SSD", price: 3490000, warrantyMonths: 12, stock: 10, image: "https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=900&q=80", specs: ["NVMe PCIe 4.0", "2TB", "M.2 2280"], description: "Dung luong lon cho workstation va editor." },
  { id: "prd-8", sku: "ZNS-0008", name: "Kingston NV3 500GB", category: "SSD", price: 990000, warrantyMonths: 6, stock: 26, image: "https://images.unsplash.com/photo-1580894908361-967195033215?auto=format&fit=crop&w=900&q=80", specs: ["NVMe PCIe 4.0", "Gen4 entry", "Ben bi"], description: "SSD gia tot de nang cap tu HDD." },
  { id: "prd-9", sku: "ZNS-0009", name: "Seagate Barracuda 1TB", category: "HDD", price: 1090000, warrantyMonths: 6, stock: 28, image: "https://images.unsplash.com/photo-1531498860502-7c67cf02f657?auto=format&fit=crop&w=900&q=80", specs: ["7200RPM", "64MB Cache", "SATA III"], description: "O cung luu tru du lieu cho gia dinh va van phong." },
  { id: "prd-10", sku: "ZNS-0010", name: "Western Digital Blue 2TB", category: "HDD", price: 1590000, warrantyMonths: 9, stock: 15, image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=900&q=80", specs: ["5400RPM", "2TB", "Tiet kiem dien"], description: "Luu tru dai han voi chi phi hop ly." },
  { id: "prd-11", sku: "ZNS-0011", name: "Intel Core i3-12100F", category: "CPU", price: 2490000, warrantyMonths: 9, stock: 17, image: "https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?auto=format&fit=crop&w=900&q=80", specs: ["4 nhan 8 luong", "Turbo 4.3GHz", "LGA1700"], description: "CPU pho thong manh cho hoc tap va eSports." },
  { id: "prd-12", sku: "ZNS-0012", name: "Intel Core i5-13400F", category: "CPU", price: 4890000, warrantyMonths: 12, stock: 15, image: "https://images.unsplash.com/photo-1518773553398-650c184e0bb3?auto=format&fit=crop&w=900&q=80", specs: ["10 nhan 16 luong", "Turbo 4.6GHz", "Tiet kiem dien"], description: "CPU tam trung toan dien cho gaming va code." },
  { id: "prd-13", sku: "ZNS-0013", name: "AMD Ryzen 5 5600", category: "CPU", price: 3290000, warrantyMonths: 9, stock: 19, image: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=900&q=80", specs: ["6 nhan 12 luong", "Socket AM4", "On dinh"], description: "CPU quoc dan cho gaming tam trung." },
  { id: "prd-14", sku: "ZNS-0014", name: "AMD Ryzen 7 7700", category: "CPU", price: 7690000, warrantyMonths: 12, stock: 9, image: "https://images.unsplash.com/photo-1555617981-dac3880eac6e?auto=format&fit=crop&w=900&q=80", specs: ["8 nhan 16 luong", "Zen 4", "Socket AM5"], description: "Phu hop editor, streamer va dev." },
  { id: "prd-15", sku: "ZNS-0015", name: "MSI PRO B760M-A WIFI DDR4", category: "Mainboard", price: 3290000, warrantyMonths: 12, stock: 14, image: "https://images.unsplash.com/photo-1562976540-0e7c5f76f05d?auto=format&fit=crop&w=900&q=80", specs: ["mATX", "Wi-Fi", "DDR4"], description: "Mainboard Intel da dung cho van phong hien dai." },
  { id: "prd-16", sku: "ZNS-0016", name: "ASUS TUF Gaming B650M-Plus", category: "Mainboard", price: 4990000, warrantyMonths: 12, stock: 11, image: "https://images.unsplash.com/photo-1517059224940-d4af9eec41b7?auto=format&fit=crop&w=900&q=80", specs: ["AM5", "DDR5", "TUF Armor"], description: "Mainboard AMD ben bi cho cau hinh moi." },
  { id: "prd-17", sku: "ZNS-0017", name: "Gigabyte H610M H V2", category: "Mainboard", price: 1790000, warrantyMonths: 6, stock: 20, image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80", specs: ["LGA1700", "mATX", "Gia tot"], description: "Lua chon tiet kiem cho Intel pho thong." },
  { id: "prd-18", sku: "ZNS-0018", name: "ASRock B550 Steel Legend", category: "Mainboard", price: 2890000, warrantyMonths: 9, stock: 13, image: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=900&q=80", specs: ["AM4", "PCIe 4.0", "VRM tan nhiet"], description: "Mainboard dep va on dinh cho Ryzen." },
  { id: "prd-19", sku: "ZNS-0019", name: "NVIDIA GeForce RTX 4060 8GB", category: "GPU", price: 8990000, warrantyMonths: 12, stock: 10, image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=900&q=80", specs: ["DLSS 3", "8GB GDDR6", "1080p Ultra"], description: "GPU moi cho full HD va 2K." },
  { id: "prd-20", sku: "ZNS-0020", name: "MSI GeForce RTX 4070 Super 12GB", category: "GPU", price: 16990000, warrantyMonths: 12, stock: 8, image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=900&q=80", specs: ["12GB GDDR6X", "Ray Tracing", "1440p High"], description: "GPU cao cap cho 2K va 4K." },
  { id: "prd-21", sku: "ZNS-0021", name: "AMD Radeon RX 7600 8GB", category: "GPU", price: 7590000, warrantyMonths: 9, stock: 10, image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=900&q=80", specs: ["8GB GDDR6", "FSR", "1080p manh"], description: "GPU AMD hieu nang tot tren gia thanh." },
  { id: "prd-22", sku: "ZNS-0022", name: "ASUS Dual RTX 3050 6GB", category: "GPU", price: 5190000, warrantyMonths: 9, stock: 12, image: "https://images.unsplash.com/photo-1587202372616-b43abea06c2a?auto=format&fit=crop&w=900&q=80", specs: ["6GB GDDR6", "2 fan", "Tiet kiem dien"], description: "GPU de tiep can cho gaming nhe." },
  { id: "prd-23", sku: "ZNS-0023", name: "NZXT H5 Flow", category: "Case", price: 2190000, warrantyMonths: 6, stock: 14, image: "https://images.unsplash.com/photo-1587202372599-8d0d8b2ddb3f?auto=format&fit=crop&w=900&q=80", specs: ["Mid Tower", "Airflow tot", "Kinh cuong luc"], description: "Case dep va de di day." },
  { id: "prd-24", sku: "ZNS-0024", name: "Xigmatek Cubi M", category: "Case", price: 890000, warrantyMonths: 3, stock: 19, image: "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=900&q=80", specs: ["mATX", "Gon", "Van phong"], description: "Case tiet kiem dien tich." },
  { id: "prd-25", sku: "ZNS-0025", name: "Lian Li Lancool 216", category: "Case", price: 2690000, warrantyMonths: 9, stock: 11, image: "https://images.unsplash.com/photo-1587202372441-4837a9ec6f7d?auto=format&fit=crop&w=900&q=80", specs: ["Airflow premium", "Ho tro radiator lon", "Di day rong"], description: "Case hieu suat tan gio cao." },
  { id: "prd-26", sku: "ZNS-0026", name: "Cooler Master MasterBox TD500", category: "Case", price: 2490000, warrantyMonths: 9, stock: 12, image: "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?auto=format&fit=crop&w=900&q=80", specs: ["ARGB", "Mat luoi", "Kinh cuong luc"], description: "Thung may gaming voi ARGB noi bat." },
  { id: "prd-27", sku: "ZNS-0027", name: "DeepCool AG400", category: "Cooling", price: 690000, warrantyMonths: 6, stock: 24, image: "https://images.unsplash.com/photo-1611078489935-0cb964de46d6?auto=format&fit=crop&w=900&q=80", specs: ["Tan khi", "4 ong dong", "CPU pho thong"], description: "Tan khi quoc dan de lap." },
  { id: "prd-28", sku: "ZNS-0028", name: "Thermalright Peerless Assassin 120", category: "Cooling", price: 1190000, warrantyMonths: 9, stock: 13, image: "https://images.unsplash.com/photo-1624705002806-5d72df19c3c6?auto=format&fit=crop&w=900&q=80", specs: ["Dual tower", "2 fan 120mm", "Hieu suat cao"], description: "Tan khi hieu nang cao cho CPU manh." },
  { id: "prd-29", sku: "ZNS-0029", name: "NZXT Kraken 240 RGB", category: "Cooling", price: 3490000, warrantyMonths: 12, stock: 8, image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=900&q=80", specs: ["AIO 240mm", "RGB", "Pump yen tinh"], description: "Tan nuoc AIO cho cau hinh cao cap." },
  { id: "prd-30", sku: "ZNS-0030", name: "Cooler Master Hyper 212", category: "Cooling", price: 890000, warrantyMonths: 6, stock: 18, image: "https://images.unsplash.com/photo-1587202372745-a1a2ef5ceefd?auto=format&fit=crop&w=900&q=80", specs: ["Tower", "120mm PWM", "De lap"], description: "Tan quen thuoc de nang cap nhiet do." },
  { id: "prd-31", sku: "ZNS-0031", name: "Corsair CX650 650W Bronze", category: "PSU", price: 1590000, warrantyMonths: 9, stock: 16, image: "https://images.unsplash.com/photo-1587202372421-0a2e710bb0bf?auto=format&fit=crop&w=900&q=80", specs: ["80 Plus Bronze", "650W", "Bao ve dien ap"], description: "Nguon on dinh cho gaming tam trung." },
  { id: "prd-32", sku: "ZNS-0032", name: "Cooler Master MWE 750 Gold V2", category: "PSU", price: 2390000, warrantyMonths: 12, stock: 12, image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80", specs: ["80 Plus Gold", "750W", "Semi modular"], description: "Nguon chat luong cao cho GPU roi manh." },
  { id: "prd-33", sku: "ZNS-0033", name: "Antec Atom 550W", category: "PSU", price: 1090000, warrantyMonths: 6, stock: 18, image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=900&q=80", specs: ["550W", "Active PFC", "Gia tot"], description: "Nguon pho thong cho van phong." },
  { id: "prd-34", sku: "ZNS-0034", name: "ASUS TUF 850W Gold", category: "PSU", price: 3190000, warrantyMonths: 12, stock: 9, image: "https://images.unsplash.com/photo-1587202372599-8d0d8b2ddb3f?auto=format&fit=crop&w=900&q=80", specs: ["850W", "80 Plus Gold", "ATX 3.0"], description: "Nguon cao cap cho bo may hieu nang lon." },
  { id: "prd-35", sku: "ZNS-0035", name: "LG UltraGear 24GN600 24 inch", category: "Monitor", price: 3190000, warrantyMonths: 9, stock: 15, image: "https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?auto=format&fit=crop&w=900&q=80", specs: ["FHD 144Hz", "IPS", "1ms"], description: "Man hinh gaming 24 inch muot cho eSports." },
  { id: "prd-36", sku: "ZNS-0036", name: "Samsung Odyssey G5 27 inch", category: "Monitor", price: 5290000, warrantyMonths: 12, stock: 11, image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=900&q=80", specs: ["2K 165Hz", "Cong", "HDR"], description: "Man hinh 2K cho game thu thich khong gian lon." },
  { id: "prd-37", sku: "ZNS-0037", name: "Dell P2422H 24 inch", category: "Monitor", price: 3890000, warrantyMonths: 9, stock: 14, image: "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=900&q=80", specs: ["IPS", "Full HD", "Van phong"], description: "Man hinh van phong voi mau sac on dinh." },
  { id: "prd-38", sku: "ZNS-0038", name: "AOC 22B2HN 22 inch", category: "Monitor", price: 2190000, warrantyMonths: 6, stock: 20, image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=80", specs: ["Full HD", "VA", "Thiet ke mong"], description: "Man hinh tiet kiem chi phi cho co ban." },
  { id: "prd-39", sku: "ZNS-0039", name: "Acer Aspire 7 Gaming", category: "Laptop", price: 16990000, warrantyMonths: 12, stock: 9, image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80", specs: ["Ryzen 5", "RTX 3050", "16GB RAM"], description: "Laptop gaming tam trung cho sinh vien IT." },
  { id: "prd-40", sku: "ZNS-0040", name: "ASUS Vivobook 15 OLED", category: "Laptop", price: 18990000, warrantyMonths: 12, stock: 7, image: "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=900&q=80", specs: ["Core i5", "OLED", "512GB SSD"], description: "Laptop mong nhe man hinh dep cho van phong." },
  { id: "prd-41", sku: "ZNS-0041", name: "Lenovo LOQ 15", category: "Laptop", price: 21990000, warrantyMonths: 12, stock: 8, image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=900&q=80", specs: ["Core i7", "RTX 4050", "144Hz"], description: "Laptop hieu nang cao cho gaming va lap trinh." },
  { id: "prd-42", sku: "ZNS-0042", name: "HP 245 G10", category: "Laptop", price: 10990000, warrantyMonths: 9, stock: 13, image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80", specs: ["Ryzen 3", "8GB RAM", "Office"], description: "Laptop tiet kiem cho sinh vien va van phong." },
  { id: "prd-43", sku: "ZNS-0043", name: "Logitech G102 Lightsync", category: "Accessory", price: 420000, warrantyMonths: 3, stock: 40, image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=900&q=80", specs: ["Mouse gaming", "RGB", "8000 DPI"], description: "Chuot gaming quoc dan de dung." },
  { id: "prd-44", sku: "ZNS-0044", name: "Keychron C3 Pro", category: "Accessory", price: 1290000, warrantyMonths: 6, stock: 18, image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=900&q=80", specs: ["Ban phim co", "Hot-swap", "TKL"], description: "Ban phim co cho go em va tuy bien." },
  { id: "prd-45", sku: "ZNS-0045", name: "Razer BlackShark V2 X", category: "Accessory", price: 1290000, warrantyMonths: 6, stock: 17, image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80", specs: ["Headset 7.1", "Mic ro", "Nhe"], description: "Tai nghe cho FPS va hop online." },
  { id: "prd-46", sku: "ZNS-0046", name: "Logitech C920 HD Pro", category: "Accessory", price: 1890000, warrantyMonths: 9, stock: 12, image: "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?auto=format&fit=crop&w=900&q=80", specs: ["Webcam 1080p", "Mic kep", "Streaming"], description: "Webcam cho hoc online va livestream." },
  { id: "prd-47", sku: "ZNS-0047", name: "TP-Link Archer T3U", category: "Accessory", price: 590000, warrantyMonths: 3, stock: 25, image: "https://images.unsplash.com/photo-1563770660941-10a63607617b?auto=format&fit=crop&w=900&q=80", specs: ["USB Wi-Fi", "AC1300", "Dual band"], description: "Mo rong Wi-Fi nhanh gon cho PC." },
  { id: "prd-48", sku: "ZNS-0048", name: "Intel Arc A750 8GB", category: "GPU", price: 6990000, warrantyMonths: 9, stock: 8, image: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=900&q=80", specs: ["8GB GDDR6", "XeSS", "AV1"], description: "GPU cho nguoi dung thich cong nghe moi." },
  { id: "prd-49", sku: "ZNS-0049", name: "ADATA XPG S70 Blade 1TB", category: "SSD", price: 2290000, warrantyMonths: 12, stock: 14, image: "https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=900&q=80", specs: ["PCIe 4.0", "7400MB/s", "Heatsink"], description: "SSD toc do cao cho project nang." },
  { id: "prd-50", sku: "ZNS-0050", name: "ASUS USB-C Dock Mini", category: "Accessory", price: 1490000, warrantyMonths: 6, stock: 16, image: "https://images.unsplash.com/photo-1580894908361-967195033215?auto=format&fit=crop&w=900&q=80", specs: ["HDMI", "USB-A", "PD passthrough"], description: "Dock ket noi tien loi cho laptop van phong." },
];

function buildExtraSpecs(product) {
  const commonSpecs = [
    `Bảo hành chính hãng ${product.warrantyMonths} tháng`,
    `Tồn kho hiện tại ${product.stock} sản phẩm`,
  ];

  const categorySpecs = {
    RAM: ["Tối ưu cho đa nhiệm, chơi game và làm việc văn phòng", "Tương thích tốt với các nền tảng mainboard phổ biến"],
    SSD: ["Phù hợp cài Windows, ứng dụng và game để tăng tốc toàn hệ thống", "Thiết kế gọn gàng, dễ nâng cấp cho máy bàn và laptop tương thích"],
    HDD: ["Thích hợp lưu trữ dữ liệu, video, tài liệu và sao lưu dài hạn", "Hoạt động ổn định cho nhu cầu gia đình và văn phòng"],
    CPU: ["Hiệu năng tốt cho học tập, làm việc, lập trình hoặc chơi game", "Cần kết hợp mainboard và tản nhiệt phù hợp để đạt hiệu quả tối ưu"],
    Mainboard: ["Hỗ trợ kết nối linh kiện ổn định và dễ nâng cấp về sau", "Thiết kế phù hợp cho cả nhu cầu gaming lẫn làm việc lâu dài"],
    GPU: ["Đáp ứng tốt nhu cầu chơi game, dựng hình và tăng tốc xử lý đồ họa", "Nên dùng cùng bộ nguồn đủ công suất để vận hành ổn định"],
    Case: ["Không gian lắp ráp thoải mái, hỗ trợ đi dây gọn gàng", "Thiết kế thông thoáng giúp tối ưu luồng gió cho toàn bộ hệ thống"],
    Cooling: ["Giữ nhiệt độ CPU ổn định khi hoạt động liên tục", "Dễ lắp đặt cho nhiều cấu hình từ phổ thông đến hiệu năng cao"],
    PSU: ["Nguồn điện ổn định giúp bảo vệ linh kiện tốt hơn", "Phù hợp cho dàn máy làm việc lâu dài và nâng cấp về sau"],
    Monitor: ["Hiển thị rõ nét, phù hợp làm việc và giải trí hằng ngày", "Kích thước và tần số quét cân bằng cho nhiều nhu cầu sử dụng"],
    Laptop: ["Phù hợp học tập, làm việc và di chuyển thường xuyên", "Thiết kế cân bằng giữa hiệu năng, độ bền và tính cơ động"],
    Accessory: ["Bổ sung trải nghiệm sử dụng máy tính tiện lợi hơn", "Dễ kết hợp với nhiều bộ máy văn phòng, gaming và học tập"],
  };

  return [...commonSpecs, ...(categorySpecs[product.category] || [])];
}

function buildDetailedDescription(product) {
  const joinedSpecs = product.specs.join(", ");
  const categoryDescriptions = {
    RAM: `${product.name} là lựa chọn đáng tin cậy cho người dùng cần nâng cấp bộ nhớ hệ thống để mở nhiều ứng dụng cùng lúc, chơi game mượt và xử lý công việc hằng ngày ổn định hơn. Sản phẩm sở hữu cấu hình ${joinedSpecs}, mang lại khả năng phản hồi tốt, tương thích cao và phù hợp cho cả máy làm việc lẫn cấu hình gaming phổ thông đến trung cấp.`,
    SSD: `${product.name} là ổ lưu trữ tốc độ cao dành cho người dùng muốn tăng tốc khởi động máy, mở ứng dụng nhanh và rút ngắn thời gian tải dữ liệu. Với thông số ${joinedSpecs}, sản phẩm phù hợp để cài hệ điều hành, phần mềm chuyên dụng, game và dữ liệu làm việc quan trọng, đồng thời mang lại trải nghiệm mượt mà hơn rõ rệt so với ổ cứng truyền thống.`,
    HDD: `${product.name} phù hợp cho nhu cầu lưu trữ dữ liệu dung lượng lớn như tài liệu, hình ảnh, video, project học tập hoặc sao lưu lâu dài. Cấu hình ${joinedSpecs} giúp sản phẩm đáp ứng tốt vai trò kho dữ liệu phụ cho PC văn phòng, máy gia đình hoặc workstation cần thêm không gian lưu trữ với chi phí hợp lý.`,
    CPU: `${product.name} là bộ vi xử lý phù hợp cho nhiều tác vụ như học tập, văn phòng, lập trình, chỉnh sửa cơ bản và chơi game. Với cấu hình ${joinedSpecs}, sản phẩm mang lại hiệu năng ổn định, khả năng xử lý nhanh và dễ phối ghép cùng các linh kiện phổ biến để tạo nên một bộ máy cân bằng về chi phí lẫn hiệu suất.`,
    Mainboard: `${product.name} là bo mạch chủ đóng vai trò trung tâm trong việc kết nối CPU, RAM, SSD, VGA và các thiết bị ngoại vi. Nhờ các thông số ${joinedSpecs}, sản phẩm đáp ứng tốt nhu cầu lắp ráp máy tính ổn định, dễ nâng cấp và phù hợp cho cả môi trường học tập, làm việc lẫn cấu hình gaming tầm trung.`,
    GPU: `${product.name} là card đồ họa dành cho người dùng cần nâng cao hiệu năng chơi game, dựng hình hoặc xử lý tác vụ liên quan đến đồ họa. Sản phẩm có cấu hình ${joinedSpecs}, cho khả năng hiển thị mượt, màu sắc tốt và hỗ trợ tốt cho các tựa game hiện đại cũng như các phần mềm sáng tạo nội dung phổ biến.`,
    Case: `${product.name} là thùng máy được thiết kế để tối ưu không gian lắp ráp linh kiện, đi dây gọn gàng và hỗ trợ luồng gió hiệu quả. Với đặc điểm ${joinedSpecs}, sản phẩm phù hợp cho người dùng muốn xây dựng một bộ PC có ngoại hình đẹp, thông thoáng và thuận tiện cho việc bảo trì hoặc nâng cấp trong tương lai.`,
    Cooling: `${product.name} là giải pháp tản nhiệt giúp CPU hoạt động ổn định hơn trong thời gian dài, đặc biệt khi làm việc nặng hoặc chơi game. Cấu hình ${joinedSpecs} giúp sản phẩm cân bằng tốt giữa khả năng làm mát, độ ồn và tính tương thích với nhiều hệ thống máy tính phổ biến hiện nay.`,
    PSU: `${product.name} là bộ nguồn cung cấp điện ổn định cho toàn bộ hệ thống, góp phần bảo vệ linh kiện và giúp máy vận hành bền bỉ hơn. Với thông số ${joinedSpecs}, sản phẩm phù hợp cho nhiều cấu hình từ văn phòng đến gaming, đồng thời tạo nền tảng an toàn cho việc nâng cấp linh kiện về sau.`,
    Monitor: `${product.name} là màn hình phù hợp cho cả nhu cầu học tập, làm việc và giải trí nhờ chất lượng hiển thị rõ nét và trải nghiệm nhìn dễ chịu. Sản phẩm sở hữu cấu hình ${joinedSpecs}, mang lại khả năng hiển thị ổn định, hình ảnh mượt và phù hợp cho nhiều không gian sử dụng khác nhau.`,
    Laptop: `${product.name} là mẫu laptop cân bằng giữa hiệu năng, tính cơ động và độ ổn định trong quá trình sử dụng hằng ngày. Với cấu hình ${joinedSpecs}, sản phẩm phù hợp cho sinh viên, nhân viên văn phòng, người làm nội dung hoặc người dùng cần một thiết bị di động có thể đáp ứng tốt cả làm việc lẫn giải trí.`,
    Accessory: `${product.name} là phụ kiện công nghệ giúp hoàn thiện trải nghiệm sử dụng máy tính theo hướng tiện lợi, ổn định và chuyên nghiệp hơn. Nhờ thông số ${joinedSpecs}, sản phẩm phù hợp cho nhiều nhóm người dùng từ học sinh, sinh viên, nhân viên văn phòng cho đến game thủ hoặc người sáng tạo nội dung.`,
  };

  return `${categoryDescriptions[product.category]} Sản phẩm hiện được phân phối tại Zanee.Store với mức giá niêm yết ${product.price.toLocaleString("vi-VN")}đ và chế độ bảo hành ${product.warrantyMonths} tháng.`;
}

const seedProducts = baseProducts.map((product) => ({
  ...product,
  specs: [...product.specs, ...buildExtraSpecs(product)],
  description: buildDetailedDescription(product),
}));

function buildDemoUsers() {
  return [
    {
      id: "usr-admin",
      username: "admin",
      email: "admin@zanee.store",
      phone: "0909954360",
      passwordHash: bcrypt.hashSync("Admin@123", 10),
      role: "admin",
      isLocked: false,
      createdAt: "2026-03-10T08:00:00.000Z",
    },
    {
      id: "usr-user",
      username: "minhdev",
      email: "minh@zanee.store",
      phone: "0912345678",
      passwordHash: bcrypt.hashSync("User@123", 10),
      role: "user",
      isLocked: false,
      createdAt: "2026-03-12T09:30:00.000Z",
    },
    {
      id: "usr-locked",
      username: "blockeduser",
      email: "blocked@zanee.store",
      phone: "0987654321",
      passwordHash: bcrypt.hashSync("Locked@123", 10),
      role: "user",
      isLocked: true,
      createdAt: "2026-03-14T12:00:00.000Z",
    },
  ];
}

const demoFavorites = [
  { userId: "usr-user", productId: "prd-1" },
  { userId: "usr-user", productId: "prd-5" },
];

const demoCart = [{ userId: "usr-user", productId: "prd-11", quantity: 1 }];

module.exports = {
  categories,
  seedProducts,
  buildDemoUsers,
  demoFavorites,
  demoCart,
};
