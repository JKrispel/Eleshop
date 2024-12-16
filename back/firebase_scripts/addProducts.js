// skrypt dodający przykładowe produkty
// instrukcja dla skryptów:
// w folderze 'back' wprowadź do terminala
// node firebase_scripts/addProducts.js     
const { db } = require('../firebase-config');

const products = [
  {
    description: "Nowoczesny laptop z dużym ekranem.",
    category: "Elektronika",
    name: "Laptop Dell",
    price: 6000,
    imageUrl: "https://i.imgur.com/zROaZYc.jpeg"
  },
  {
    description: "Nowoczesny telewizor 4K z technologią HDR.",
    category: "Elektronika",
    name: "Telewizor Sony Bravia",
    price: 4500,
    imageUrl: "https://i.imgur.com/tv123abc.jpeg"
  },
  {
    description: "Zaawansowany tablet do pracy i rozrywki.",
    category: "Elektronika",
    name: "Tablet Apple iPad Pro",
    price: 3700,
    imageUrl: "https://i.imgur.com/tab123def.jpeg"
  },
  {
    description: "Konsola nowej generacji z ogromną biblioteką gier.",
    category: "Elektronika",
    name: "Konsola PlayStation 5",
    price: 3200,
    imageUrl: "https://i.imgur.com/console123ghi.jpeg"
  },
  {
    description: "Wydajny smartfon z 5G.",
    category: "Telefony",
    name: "Smartphone Samsung",
    price: 2500,
    imageUrl: "https://i.imgur.com/0bO6F2h.jpeg"
  },
  {
    description: "Nowoczesny smartfon z 6.5-calowym ekranem OLED.",
    category: "Telefony",
    name: "Smartphone Apple iPhone 14",
    price: 5200,
    imageUrl: "https://i.imgur.com/xyz1abc.jpeg"
  },
  {
    description: "Smartfon z dużą baterią i ekranem AMOLED.",
    category: "Telefony",
    name: "Smartphone Xiaomi Redmi Note 12",
    price: 1400,
    imageUrl: "https://i.imgur.com/xyz2def.jpeg"
  },
  {
    description: "Flagowy smartfon z potrójnym aparatem.",
    category: "Telefony",
    name: "Smartphone Samsung Galaxy S22",
    price: 3800,
    imageUrl: "https://i.imgur.com/xyz3ghi.jpeg"
  },
  {
    description: "Wydajny telefon gamingowy z chłodzeniem.",
    category: "Telefony",
    name: "Smartphone ASUS ROG Phone 6",
    price: 4200,
    imageUrl: "https://i.imgur.com/xyz4jkl.jpeg"
  },
  {
    description: "Telefon o wytrzymałej konstrukcji dla wymagających użytkowników.",
    category: "Telefony",
    name: "Smartphone CAT S62 Pro",
    price: 3000,
    imageUrl: "https://i.imgur.com/xyz5mno.jpeg"
  },
  {
    description: "Budżetowy smartfon z ekranem HD+.",
    category: "Telefony",
    name: "Smartphone Nokia G20",
    price: 900,
    imageUrl: "https://i.imgur.com/xyz6pqr.jpeg"
  },
  {
    description: "Smartfon 5G z ultraszybkim ładowaniem.",
    category: "Telefony",
    name: "Smartphone OnePlus Nord 2",
    price: 1900,
    imageUrl: "https://i.imgur.com/xyz7stu.jpeg"
  },
  {
    description: "Kompaktowy smartfon z wysoką rozdzielczością aparatu.",
    category: "Telefony",
    name: "Smartphone Sony Xperia 5 III",
    price: 4500,
    imageUrl: "https://i.imgur.com/xyz8vwx.jpeg"
  },
  {
    description: "Telefon z rysikiem do kreatywnej pracy.",
    category: "Telefony",
    name: "Smartphone Samsung Galaxy Note 20 Ultra",
    price: 4800,
    imageUrl: "https://i.imgur.com/xyz9yz1.jpeg"
  },
  {
    description: "Przystępny cenowo telefon z wytrzymałą baterią.",
    category: "Telefony",
    name: "Smartphone Motorola Moto G Power",
    price: 1000,
    imageUrl: "https://i.imgur.com/xyz10abc.jpeg"
  },
  {
    description: "Stylowy smartfon z możliwością nagrywania wideo w 8K.",
    category: "Telefony",
    name: "Smartphone Oppo Find X5",
    price: 3100,
    imageUrl: "https://i.imgur.com/xyz11def.jpeg"
  },
  {
    description: "Składany smartfon z ekranem AMOLED.",
    category: "Telefony",
    name: "Smartphone Samsung Galaxy Z Flip 4",
    price: 5200,
    imageUrl: "https://i.imgur.com/xyz12ghi.jpeg"
  },
  {
    description: "Smartfon klasy premium z wysoką odpornością na wodę.",
    category: "Telefony",
    name: "Smartphone Huawei P50 Pro",
    price: 4600,
    imageUrl: "https://i.imgur.com/xyz13jkl.jpeg"
  },
  {
    description: "Telefon do selfie z kamerą 32 MP.",
    category: "Telefony",
    name: "Smartphone Vivo V23",
    price: 2200,
    imageUrl: "https://i.imgur.com/xyz14mno.jpeg"
  },
  {
    description: "Lekki smartfon z systemem Android 13.",
    category: "Telefony",
    name: "Smartphone Realme GT 2 Pro",
    price: 2700,
    imageUrl: "https://i.imgur.com/xyz15pqr.jpeg"
  },
  {
    description: "Smartfon z baterią 5000mAh i ładowaniem 65W.",
    category: "Telefony",
    name: "Smartphone Poco F4",
    price: 1900,
    imageUrl: "https://i.imgur.com/xyz16stu.jpeg"
  },
  {
    description: "Telefon z ekranem 120Hz i procesorem Snapdragon.",
    category: "Telefony",
    name: "Smartphone Xiaomi Mi 11T",
    price: 2000,
    imageUrl: "https://i.imgur.com/xyz17vwx.jpeg"
  },
  {
    description: "Wytrzymały smartfon z dużym ekranem iOS.",
    category: "Telefony",
    name: "Smartphone Apple iPhone SE 2022",
    price: 2600,
    imageUrl: "https://i.imgur.com/xyz18yz1.jpeg"
  },
  {
    description: "Smartfon z najnowszym Androidem i ekranem HDR10+.",
    category: "Telefony",
    name: "Smartphone Google Pixel 7",
    price: 3500,
    imageUrl: "https://i.imgur.com/xyz19abc.jpeg"
  },
  {
    description: "Smartfon z wyświetlaczem bez ramek.",
    category: "Telefony",
    name: "Smartphone ZTE Axon 40 Ultra",
    price: 4000,
    imageUrl: "https://i.imgur.com/xyz20def.jpeg"
  },
  {
    description: "Słuchawki z aktywną redukcją hałasu.",
    category: "Audio",
    name: "Słuchawki Bose",
    price: 1200,
    imageUrl: "https://i.imgur.com/5gOXJww.jpeg"
  },
  {
    description: "Bezprzewodowy głośnik z wodoodpornością IP67.",
    category: "Audio",
    name: "Głośnik JBL Flip 6",
    price: 600,
    imageUrl: "https://i.imgur.com/audio123abc.jpeg"
  },
  {
    description: "Słuchawki douszne z aktywną redukcją szumów.",
    category: "Audio",
    name: "Słuchawki Sony WF-1000XM4",
    price: 1000,
    imageUrl: "https://i.imgur.com/audio123def.jpeg"
  },
  {
    description: "Zaawansowany soundbar z technologią Dolby Atmos.",
    category: "Audio",
    name: "Soundbar Samsung HW-Q950A",
    price: 2500,
    imageUrl: "https://i.imgur.com/audio123ghi.jpeg"
  },
  {
    description: "Odkurzacz bezprzewodowy z długim czasem pracy.",
    category: "AGD",
    name: "Odkurzacz Dyson V15",
    price: 2400,
    imageUrl: "https://i.imgur.com/agd123abc.jpeg"
  },
  {
    description: "Inteligentna lodówka z ekranem dotykowym.",
    category: "AGD",
    name: "Lodówka Samsung Family Hub",
    price: 8200,
    imageUrl: "https://i.imgur.com/agd123def.jpeg"
  },
  {
    description: "Pralka z funkcją pary i dużym bębnem.",
    category: "AGD",
    name: "Pralka Bosch Serie 8",
    price: 2900,
    imageUrl: "https://i.imgur.com/agd123ghi.jpeg"
  },
  {
    description: "Zaawansowany aparat z wymienną optyką.",
    category: "Fotografia",
    name: "Aparat Sony Alpha 7 IV",
    price: 9200,
    imageUrl: "https://i.imgur.com/photo123abc.jpeg"
  },
  {
    description: "Kamera sportowa do nagrywania w 4K.",
    category: "Fotografia",
    name: "Kamera GoPro Hero 11",
    price: 2200,
    imageUrl: "https://i.imgur.com/photo123def.jpeg"
  },
  {
    description: "Stabilizator obrazu do profesjonalnych nagrań.",
    category: "Fotografia",
    name: "Gimbal DJI Ronin-SC",
    price: 1200,
    imageUrl: "https://i.imgur.com/photo123ghi.jpeg"
  },
  {
    description: "Komfortowy fotel gamingowy z regulacją pozycji.",
    category: "Gaming",
    name: "Fotel SecretLab Titan",
    price: 1800,
    imageUrl: "https://i.imgur.com/gaming123abc.jpeg"
  },
  {
    description: "Klawiatura mechaniczna RGB dla graczy.",
    category: "Gaming",
    name: "Klawiatura Razer BlackWidow V3",
    price: 700,
    imageUrl: "https://i.imgur.com/gaming123def.jpeg"
  },
  {
    description: "Słuchawki gamingowe z dźwiękiem przestrzennym.",
    category: "Gaming",
    name: "Słuchawki SteelSeries Arctis 7",
    price: 850,
    imageUrl: "https://i.imgur.com/gaming123ghi.jpeg"
  },
  {
    description: "Inteligentny termostat sterowany aplikacją.",
    category: "Smart Home",
    name: "Termostat Google Nest",
    price: 1000,
    imageUrl: "https://i.imgur.com/smart123abc.jpeg"
  },
  {
    description: "Kamera monitoringu z detekcją ruchu.",
    category: "Smart Home",
    name: "Kamera Xiaomi Mi Home Security",
    price: 300,
    imageUrl: "https://i.imgur.com/smart123def.jpeg"
  },
  {
    description: "Oświetlenie LED RGB z możliwością zmiany kolorów.",
    category: "Smart Home",
    name: "Żarówka Philips Hue",
    price: 200,
    imageUrl: "https://i.imgur.com/smart123ghi.jpeg"
  },
];

async function addProducts() {
  try {
    for (const product of products) {
      await db.collection('Products').add(product);
    }
    console.log("Produkty zostały pomyślnie dodane!");
  } catch (error) {
    console.error("Błąd podczas dodawania produktów: ", error);
  }
}

addProducts();
