# Frontend Tesztadatok – Balatoni Nyaraló Foglalási Rendszer

Ez a dokumentum realisztikus tesztadatokat tartalmaz a frontend (naptár, foglalási űrlap, admin táblázat) teszteléséhez.

---

## 1. Nyaraló alapadatok (config.js – már létező)

Ezek a `js/config.js`-ben vannak, teszteléshez változtathatók:

```js
const NYARALO = {
  nev: "Balatoni Nyaraló",
  leiras: "Családbarát, teljesen felszerelt nyaraló a Balaton déli partján, mindössze 150 méterre a strandtól. Nagy kert, terasz, grillsütő és saját parkolóhely.",
  cim: "8600 Siófok, Fő utca 12.",
  ferőhely: 6,
  szobak: 3,
  furdoszobak: 2,
  arEjszaka: 28000,          // Ft
  minEjszaka: 2,
  // ... többi mező változatlan
};
