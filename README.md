# Nyaraló foglalási rendszer

## 1. A projekt célja

A projekt célja egy egyszerű, reszponzív webalkalmazás létrehozása,
amely egyetlen nyaraló bemutatását és foglalását teszi lehetővé.

A webalkalmazás segítségével a látogatók megtekinthetik a nyaraló
adatait, fényképeit, felszereltségét, árát, házirendjét és a szabad
időpontokat.

A vendég regisztráció nélkül küldhet foglalási kérelmet. A rendszer a
foglalási kérelmet adatbázisban tárolja, majd az adminisztrátor dönthet
annak elfogadásáról, elutasításáról vagy lemondásáról.

A rendszer nem tartalmaz online bankkártyás fizetést. A fizetés
átutalással vagy készpénzben történik. Elfogadott foglalás esetén a
vendég e-mailben kapja meg a fizetéssel kapcsolatos információkat.

## 2. A rendszer felhasználói

A rendszernek kétféle használója van.

### 2.1. Vendég

A vendégnek nem kell regisztrálnia vagy bejelentkeznie.

A vendég: - Megtekintheti a nyaraló adatait. - Megtekintheti a
képgalériát. - Megtekintheti a felszereltséget. - Megtekintheti az
árat. - Megtekintheti a házirendet. - Megtekintheti a check-in/check-out
időpontokat. - Megtekintheti a szabad és foglalt dátumokat. - Foglalási
kérelmet küldhet.

A vendég a foglalás után e-mailben kapja meg a szükséges információkat.

### 2.2. Adminisztrátor

A rendszer egy adminisztrátort kezel.

Az adminisztrátor: - Megtekintheti a foglalásokat. - Elfogadhatja a
foglalási kérelmeket. - Elutasíthatja a foglalási kérelmeket. -
Lemondhatja a foglalásokat. - Módosíthatja a fizetési státuszt.

A nyaraló alapadatai fixek, ezért az adminisztrátor ezeket nem
módosítja.

## 3. A nyaraló adatai

A rendszer egyetlen nyaralót kezel.

A nyaraló adatai: - Név - Részletes leírás - Cím/helyszín - Férőhelyek
száma - Szobák száma - Fürdőszobák száma - Éjszakánkénti ár - Minimum
foglalható éjszakák száma - Felszereltség - Fényképek - Házirend -
Check-in időpont - Check-out időpont

Ezek az adatok fixen szerepelnek az alkalmazásban.

## 4. Kezdőlap

A kezdőlap minden látogató számára elérhető, bejelentkezés nélkül.

A kezdőlapon található: - A nyaraló neve - Képgaléria - Részletes
leírás - Cím/helyszín - Férőhelyek száma - Szobák száma - Fürdőszobák
száma - Felszereltség - Éjszakánkénti ár - Minimum foglalható éjszakák -
Házirend - Check-in/check-out információk - Foglalási naptár -
„Foglalás" gomb

## 5. Foglalási funkció

A vendég a „Foglalás" gomb segítségével megnyithatja a foglalási
űrlapot.

A vendégnek az alábbi adatokat kell megadnia: - Név - E-mail-cím -
Telefonszám - Érkezés dátuma - Távozás dátuma - Vendégek száma -
Fizetési mód

A fizetési mód lehet: - Átutalás - Készpénz

A rendszer a kiválasztott dátumok alapján kiszámítja a teljes fizetendő
összeget.

## 6. Foglalás ellenőrzése

A rendszer a foglalás létrehozása előtt ellenőrzi: - Az érkezési dátum
korábbi-e a távozás dátumánál. - A foglalás eléri-e a minimum foglalható
éjszakák számát. - A vendégek száma nem haladja-e meg a nyaraló
férőhelyét. - A kiválasztott időszak nem ütközik-e elfogadott
foglalással.

Hibás adatok esetén a rendszer hibaüzenetet jelenít meg.

Sikeres ellenőrzés után a foglalási kérelem bekerül az adatbázisba.

## 7. Foglalási státuszok

A foglalás négyféle állapotot vehet fel.

  -----------------------------------------------------------------------
  Státusz                             Leírás
  ----------------------------------- -----------------------------------
  **Függőben**                        A vendég elküldte a foglalási
                                      kérelmet, de az adminisztrátor még
                                      nem döntött.

  **Elfogadva**                       Az adminisztrátor elfogadta a
                                      foglalási kérelmet. Az adott
                                      időszak foglalttá válik.

  **Elutasítva**                      Az adminisztrátor elutasította a
                                      foglalási kérelmet. Az adott
                                      időszak továbbra is foglalható.

  **Lemondva**                        Az adminisztrátor lemondta a
                                      korábban elfogadott foglalást. Az
                                      adott időszak ismét foglalhatóvá
                                      válik.
  -----------------------------------------------------------------------

## 8. Fizetés

A rendszerben nincs online fizetés.

A vendég az alábbi fizetési módok közül választhat: - Átutalás -
Készpénz

A fizetési státuszok: - Nincs fizetve - Fizetésre vár - Fizetve

Az adminisztrátor módosíthatja a fizetési státuszt.

## 9. E-mail küldése

Az elfogadott foglalás után a rendszer e-mailt küld a vendég által
megadott e-mail-címre.

Az e-mail tartalmazza: - A vendég nevét - A foglalás adatait - Az
érkezés dátumát - A távozás dátumát - A vendégek számát - A teljes
fizetendő összeget - A választott fizetési módot

Átutalás esetén az e-mail tartalmazza: - A bankszámlaszámot - A
kedvezményezett nevét - A fizetendő összeget - A közleményhez szükséges
információt

Készpénzes fizetés esetén az e-mail tartalmazza a készpénzes fizetésre
vonatkozó tájékoztatást.

## 10. Adminisztrációs felület

Az admin egy egyszerű adminisztrációs oldalon kezelheti a foglalásokat.

A foglalási listában megjelenik: - Foglalás azonosítója - Vendég neve -
E-mail-címe - Telefonszáma - Érkezés - Távozás - Vendégek száma - Teljes
ár - Foglalás létrehozásának időpontja - Foglalási státusz - Fizetési
mód - Fizetési státusz

Az admin az alábbi műveleteket végezheti: - Foglalás elfogadása -
Foglalás elutasítása - Foglalás lemondása - Fizetési státusz módosítása

## 11. Projektstruktúra

A projekt a következő könyvtárstruktúrába van rendezve:

```
Nyaralo/
├── backend/                  # Szerveroldali kód és végpontok
│   ├── .env                  # Környezeti változók
│   ├── .env.example          # Környezeti változók sablonja
│   ├── app.js                # Express szerver
│   ├── foglalas.http         # API tesztkérések
│   ├── package.json          # Backend függőségek
│   └── package-lock.json
├── database/                 # Adatbázis fájlok és sémák
│   ├── database.sql          # Adatbázis séma (táblák)
│   ├── tesztadatok.sql       # Tesztadatok betöltése
│   └── nyaralo.db            # SQLite 3 adatbázisfájl
├── docs/                     # Részletes dokumentációk
│   ├── backend.md            # Backend technikai leírás
│   ├── database.md           # Adatbázis dokumentáció
│   └── dokument.md           # Rendszer dokumentáció
├── frontend/                 # Felhasználói és admin felület
│   ├── admin.html            # Adminisztrátori felület
│   ├── index.html            # Vendégoldal (főoldal)
│   ├── css/
│   │   └── style.css         # Egyedi stíluslap
│   └── js/
│       ├── admin.js          # Admin felület logikája
│       ├── booking.js        # Foglalási űrlap és validáció
│       ├── calendar.js       # Foglaltsági naptár
│       ├── config.js         # Nyaraló adatok és konfiguráció
│       └── nyaralo.js        # Korábbi kliensoldali kód
├── .gitignore                # Git által figyelmen kívül hagyott fájlok
├── package.json              # Gyökér szintű npm konfiguráció és indító parancsok
└── README.md                 # Általános projektismertető
```
