# Nyaraló foglalási rendszer

## 1. A projekt célja

A projekt célja egy egyszerű, reszponzív webalkalmazás létrehozása,
amely egyetlen nyaraló bemutatását és bérlésének kezelését teszi
lehetővé.

A rendszer segítségével a látogatók megtekinthetik a nyaraló adatait,
képeit, felszereltségét, árát és a szabad időpontokat. A regisztrált
vendégek foglalási kérelmet küldhetnek a kívánt időszakra.

A foglalás nem válik automatikusan véglegessé. A foglalási kérelmet az
adminisztrátor ellenőrzi, majd elfogadhatja vagy elutasíthatja.

A rendszer nem tartalmaz online bankkártyás vagy egyéb online fizetési
lehetőséget. A fizetés átutalással vagy készpénzben történik.

## 2. Felhasználói szerepkörök

A rendszer kétféle felhasználót kezel.

### 2.1. Vendég

A vendég a rendszer fő felhasználója.

**Jogosultságok:** - Regisztráció - Bejelentkezés - A nyaraló adatainak
megtekintése - Képek megtekintése - Felszereltség megtekintése - Ár
megtekintése - Házirend megtekintése - Check-in és check-out időpontok
megtekintése - Szabad és foglalt időpontok megtekintése - Foglalási
kérelem küldése - Saját foglalások megtekintése

A vendég a saját foglalását nem tudja törölni vagy lemondani.

### 2.2. Adminisztrátor

A rendszerben egy adminisztrátori szerepkör található.

**Jogosultságok:** - Foglalások megtekintése - Függőben lévő foglalások
megtekintése - Foglalás elfogadása - Foglalás elutasítása - Foglalás
lemondása - Fizetési státusz módosítása

A nyaraló adatai az alkalmazásban rögzítettek, ezért az adminisztrátor
ezeket nem módosíthatja.

## 3. A nyaraló adatai

A rendszer egyetlen nyaralót kezel.

**A nyaralóhoz tartozó adatok:** - Név - Részletes leírás -
Cím/helyszín - Férőhelyek száma - Szobák száma - Fürdőszobák száma -
Éjszakánkénti ár - Minimum foglalható éjszakák száma - Felszereltség -
Fényképek - Házirend - Check-in időpont - Check-out időpont

A nyaraló adatai fixen kerülnek be az alkalmazásba, és az adminisztrátor
nem módosíthatja őket.

## 4. Fő funkciók

### 4.1. Nyaraló megtekintése

A kezdőoldal bejelentkezés nélkül is elérhető.

A látogató megtekintheti: - A nyaraló nevét - Fényképeit - Leírását -
Címét/helyszínét - Férőhelyek számát - Szobák és fürdőszobák számát -
Felszereltségét - Árát - Házirendjét - Check-in/check-out időpontját -
Foglalási naptárát

A foglalási lehetőség használatához a felhasználónak be kell
jelentkeznie.

### 4.2. Regisztráció

Új vendég az alábbi adatok megadásával regisztrálhat: - Név -
E-mail-cím - Jelszó - Telefonszám

A rendszer ellenőrzi, hogy az e-mail-cím még nem szerepel-e az
adatbázisban.

Sikeres regisztráció után a felhasználó bejelentkezhet.

### 4.3. Bejelentkezés

A felhasználó e-mail-cím és jelszó segítségével jelentkezhet be.

Sikeres bejelentkezés után: - **Vendég esetén:** a vendégfunkciók
érhetők el. - **Admin esetén:** az adminisztrációs felület jelenik meg.

## 5. Foglalás

A vendég a foglalási űrlapon megadhatja: - Érkezés dátuma - Távozás
dátuma - Vendégek száma - Fizetési mód

A fizetési mód lehet: - Átutalás - Készpénz

A rendszer a kiválasztott időszak alapján kiszámítja a teljes árat.

### Ár számítása

**Teljes ár = éjszakák száma × egy éjszaka ára**

A rendszer ellenőrzi: - A távozás későbbi legyen az érkezésnél. - A
foglalás érje el a minimum éjszakák számát. - A megadott vendégszám ne
haladja meg a nyaraló férőhelyét. - A kiválasztott időszakban ne legyen
már elfogadott foglalás.

Sikeres ellenőrzés után a foglalási kérelem létrejön.

## 6. Foglalás állapotai

A foglalás négy állapotot használ.

  -----------------------------------------------------------------------
  Állapot                             Leírás
  ----------------------------------- -----------------------------------
  **Függőben**                        A vendég elküldte a foglalási
                                      kérelmet, de az adminisztrátor még
                                      nem döntött.

  **Elfogadva**                       Az adminisztrátor elfogadta a
                                      foglalást. Az elfogadott időszak
                                      foglaltnak számít.

  **Elutasítva**                      Az adminisztrátor elutasította a
                                      foglalási kérelmet. Az időszak újra
                                      foglalható.

  **Lemondva**                        Az adminisztrátor lemondta a
                                      foglalást. Az időszak újra
                                      foglalható.
  -----------------------------------------------------------------------

## 7. Fizetés kezelése

A rendszerben nincs online fizetés.

A vendég két fizetési mód közül választhat: - Átutalás - Készpénz

**A fizetés állapota:** - Nincs fizetve - Fizetésre vár - Fizetve

A fizetési státuszt az adminisztrátor módosíthatja.

Átutalás esetén a rendszerben megjeleníthető az előre meghatározott
bankszámlaszám, amelyre a vendég az összeget átutalhatja.

## 8. Foglalási naptár

A kezdőlapon egy egyszerű naptár jelenik meg.

A naptárban megkülönböztethetők: - Szabad időpontok - Foglalt időpontok

A foglalási kérelem elküldése előtt a rendszer ellenőrzi az adott
időszakot.

Csak az elfogadott foglalások tekintendők véglegesen foglaltnak. A
függőben lévő, elutasított vagy lemondott foglalások időszaka nem számít
véglegesen foglaltnak.

## 9. Adminisztrációs felület

Az admin bejelentkezés után egy egyszerű foglaláskezelő felületet lát.

Az admin számára megjelennek a foglalások legfontosabb adatai: -
Foglalás azonosítója - Vendég neve - Vendég e-mail-címe - Vendég
telefonszáma - Érkezés - Távozás - Vendégek száma - Teljes ár - Foglalás
létrehozásának időpontja - Foglalás státusza - Fizetési mód - Fizetési
státusz

Az admin a foglalásokat: - Elfogadhatja - Elutasíthatja - Lemondhatja -
Fizetettként jelölheti

## 10. Felhasználói felület

A rendszer egyszerű, reszponzív webes felületet használ.

### Kezdőlap

-   Nyaraló bemutatása
-   Képgaléria
-   Felszereltség
-   Ár
-   Házirend
-   Check-in/check-out
-   Foglalási naptár
-   Foglalás gomb
-   Bejelentkezés/regisztráció lehetőség

### Bejelentkezés

-   E-mail
-   Jelszó
-   Bejelentkezés gomb

### Regisztráció

-   Név
-   E-mail
-   Jelszó
-   Telefonszám
-   Regisztráció gomb

### Foglalás

-   Érkezési dátum
-   Távozási dátum
-   Vendégek száma
-   Fizetési mód
-   Számított teljes ár
-   Foglalás elküldése gomb

### Admin felület

-   Foglalások listája
-   Foglalás részletei
-   Elfogadás
-   Elutasítás
-   Lemondás
-   Fizetési státusz módosítása
