# Felhasználói tesztjelentés

Dátum: 2026-10-12. Tesztelt GitHub commit: `7ad1f27`.
Tesztterv: `backend/fehasznaloi_teszt.md` (a frissítésben nem volt `test.docsz`).
Környezet: Windows, Chrome 155, Node 26.3.0, npm 11.16.0, Asia/Bangkok időzóna.

## Eredmény

A GitHub-frissítés sikerült. Külön, friss klónon az `npm ci` és az `npm start` sikeresen lefutott; az adatbázis automatikusan létrejött. A tesztek a `http://localhost:3188` címen, elkülönített tesztadatbázison futottak. A projekt eredeti adatbázisát nem módosítottuk. A tesztfolyamat külön TOKEN_SECRET környezeti változót kapott.

| Teszt | Minősítés | Megfigyelt eredmény |
| --- | --- | --- |
| UAT-FOGL-01 – sikeres foglalás | Funkcionálisan megfelelt; szöveges eltérés | Teszt Elek, 2026-12-01–05, 4 vendég, Átutalás: 112 000 Ft, mentett `fuggo` státusz. A felugró üzenet: „Foglalási kérelmed sikeresen rögzítve! Az oldal frissül.” Ez eltér a tesztterv szó szerinti szövegétől. |
| UAT-FOGL-02 – hiányzó név | Megfelelt | A Chrome kötelezőmező-ellenőrzése letiltotta a küldést. Közvetlen API-kérés: 400. |
| UAT-FOGL-03 – fordított dátumok | Megfelelt | „A távozás dátumának későbbinek kell lennie az érkezésnél.” Közvetlen API-kérés: 400. |
| UAT-FOGL-04 – 0 vendég | Megfelelt | A Chrome minimumérték-ellenőrzése letiltotta a küldést. Közvetlen API-kérés: 400, „A vendégek száma legalább 1 legyen!” |
| UAT-FOGL-05 – Bitcoin | Megfelelt | A legördülőben nincs ilyen lehetőség; nem létező érték programozott beállításakor a kötelező választás ellenőrzése blokkol. Manipulált API-kérés: 400, „Érvénytelen fizetési mód!” |
| UAT-FOGL-06 – ütköző időszak | Megfelelt | A 2026-10-10–13 időszakra „A választott időszak már foglalt.” Közvetlen API-kérés: 409. |
| UAT-ADMIN-01 – elfogadás | Nem felelt meg teljesen | A státuszváltás és az elfogadott foglalások API-listája működik. Nincs bejelentkezési felület, a művelet belépés nélkül is működik, nincs külön sikerüzenet; a naptár határnapjai hibásak. |
| UAT-ADMIN-02 – rossz jelszó | Nem felelt meg teljesen | A login API 401 választ adott, de az adminoldal és a foglalások módosítása továbbra is hozzáférhető hitelesítés nélkül. |

A sikertelen vendégtesztek után az adatbázisban változatlanul a hat kiinduló tesztfoglalás szerepelt. A dokumentált admin/admin123 belépés a konfigurált tesztkörnyezetben 200 választ és tokent adott; a rossz jelszó nem adott tokent.

## Megismételt foglalás a felületen

A felhasználó kérésére az UAT-FOGL-01 tesztet a Foglalás gombra kattintva, a látható mezők kitöltésével, majd a „Foglalási kérelem elküldése” gombra kattintva is megismételtük. Az előző, általunk létrehozott és adminpróbában elfogadott tesztfoglalást előtte eltávolítottuk kizárólag az elkülönített tesztadatbázisból, hogy ne okozzon ütközést.

- Név: Teszt Elek
- E-mail: teszt.elek@example.com
- Telefon: +36 30 123 4567
- Érkezés / távozás: 2026-12-01 / 2026-12-05
- Vendégek: 4
- Fizetési mód: Átutalás
- Megjelent a sikeres mentést jelző böngészőüzenet.

## Javítandó hibák

1. **Admin-hozzáférés:** a `backend/app.js` `/admin`, teljes foglaláslista és státusz-/fizetésmódosító végpontjai nincsenek megfelelő adminhitelesítéssel védve. Friss, be nem jelentkezett böngészőkörnyezetben hét foglalás látszott, és a tesztfoglalás elfogadható volt. A meglévő `authenticateToken` csak a `/users` útvonalon védi a felhasználókezelést. A publikus foglalási kérelmet és a személyes adatokat nem tartalmazó foglaltsági listát külön kell kezelni az adminfunkcióktól.
2. **Naptár dátumkezelése:** `frontend/js/calendar.js` UTC-ként értelmezett dátumszövegeket hasonlít helyi éjfélhez. A december 1–5 közötti elfogadott foglalás december 1-jét szabadnak, december 5-ét foglaltnak jelölte Bangkok időzónában; december 2. helyesen foglalt volt.
3. **Admin-visszajelzés:** `frontend/js/admin.js` elfogadás után frissíti a listát, de nem mutatja a tesztterv által elvárt külön sikerüzenetet, és nem ellenőrzi megfelelően a HTTP hibaválaszokat.
4. **Üzenetszöveg:** ha az UAT-FOGL-01 szó szerinti egyezést követel, a frontend sikerüzenetét és a teszttervet össze kell hangolni.

## Korlátok

A vendégvalidációkat Chrome-ban programozott űrlapkitöltéssel és a tényleges submit-kezelővel, valamint külön API-kérésekkel ellenőriztük. A sikeres foglalást valódi böngészőgomb-kattintással is megismételtük; az adminelfogadást a felület gombjával hajtottuk végre. A natív Chrome-validáció nyelve ebben a környezetben angol volt. Firefoxot és a barát számítógépét nem teszteltük, ezért a barát konkrét hibájának oka még nem bizonyított.

A friss GitHub-commit dokumentációt módosított, az alkalmazáskód változatlan. Az előző klónozási/böngészős vizsgálat részletei a `docs/clone-browser-report.md` fájlban találhatók. Ez a munka jelentést készített; alkalmazáskód-javítás nem történt.
