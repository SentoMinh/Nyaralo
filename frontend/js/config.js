// js/config.js
const NYARALO = {
  nev: "Balatoni Nyaraló",
  leiras: "Családbarát, teljesen felszerelt nyaraló a Balaton déli partján, mindössze 150 méterre a strandtól. Nagy kert, terasz, grillsütő és saját parkolóhely.",
  cim: "8600 Siófok, Fő utca 12.",
  ferőhely: 6,
  szobak: 3,
  furdoszobak: 2,
  arEjszaka: 28000,          // Ft
  minEjszaka: 2,
  felszereltseg: [
    "WiFi", "Légkondicionáló", "Mosógép", "Mosogatógép",
    "Grillsütő", "Terasz", "Kert", "Parkoló", "TV", "Hűtő",
    "Mikrohullámú sütő", "Kávéfőző", "Vasaló", "Hajszárító"
  ],
  hazirend: [
    "Csönd 22:00 után",
    "Dohányzás csak a kertben",
    "Háziállat előzetes egyeztetéssel",
    "Maximum 6 fő",
    "Érkezés 15:00 után, távozás 10:00-ig"
  ],
  checkIn: "15:00",
  checkOut: "10:00",
  kepek: [
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800"
  ]
};

const API_BASE = (typeof window !== 'undefined' && window.location.protocol.startsWith('http') && window.location.port !== '5500')
  ? `${window.location.origin}/api`
  : 'http://localhost:3000/api';
const BANK = {
  szamlaszam: "12345678-12345678-12345678",
  kedvezmenyezett: "Kovács János",
  kozlemeny: "Foglalás: {id}"
};