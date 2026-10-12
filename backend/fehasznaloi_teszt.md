1. Sikeres foglalási kérelem (Happy Path)
Tesztazonosító: UAT-FOGL-01

Szerepkör: Vendég
Lépések:

Nyisd meg a foglalási oldalt.
Töltsd ki az űrlapot az alábbi adatokkal:
Név: Teszt Elek
E-mail: teszt.elek@example.com
Telefon: +36 30 123 4567
Érkezés: 2026-12-01
Távozás: 2026-12-05
Vendégek: 4
Fizetési mód: Átutalás

Kattints a „Foglalási kérelem elküldése” gombra.

Elvárt eredmény:

Megjelenik a sikeres üzenet: „Foglalási kérelem rögzítve.”

A foglalás „függőben” státusszal bekerül a rendszerbe.

2. Hiányzó kötelező mező (név nélkül)
Tesztazonosító: UAT-FOGL-02
Lépések:

Nyisd meg a foglalási űrlapot.
Tölts ki minden mezőt kivéve a nevet.
Próbáld elküldeni a foglalást.

Elvárt eredmény:

A rendszer nem engedi elküldeni, és egyértelmű hibaüzenetet jelenít meg a hiányzó mezőről.

3. Hibás dátumok (távozás korábbi az érkezésnél)
Tesztazonosító: UAT-FOGL-03
Lépések:

Töltsd ki az űrlapot.
Érkezés: 2026-12-15
Távozás: 2026-12-10
Küldés.

Elvárt eredmény:

Hibaüzenet jelenik meg (pl. „A távozás dátuma nem lehet korábbi az érkezésnél”), a foglalás nem kerül rögzítésre.

4. Érvénytelen vendégszám (0)
Tesztazonosító: UAT-FOGL-04
Lépések:

Töltsd ki az űrlapot.
Vendégek száma: 0
Küldés.

Elvárt eredmény:

Hibaüzenet: a vendégek száma legalább 1 kell legyen. A foglalás nem kerül mentésre.

5. Érvénytelen fizetési mód
Tesztazonosító: UAT-FOGL-05
Lépések:

Próbálj meg olyan fizetési módot választani / beírni, ami nincs a választható lehetőségek között (pl. „Bitcoin”).
Küldés.

Elvárt eredmény:

A rendszer nem fogadja el, hibaüzenetet ad.

6. Időpontütközés (már foglalt időszak)
Tesztazonosító: UAT-FOGL-06

Előfeltétel: 2026-10-09 és 2026-10-12 között már van elfogadott foglalás.
Lépések:

Próbálj foglalni: érkezés 2026-10-10, távozás 2026-10-13.
Küldés.

Elvárt eredmény:

A rendszer jelzi, hogy az időszak már foglalt („A választott időszak már foglalt.”), és nem engedi a foglalást.

6b. Időpontütközés (függőben lévő kérelem)
Tesztazonosító: UAT-FOGL-06B

Előfeltétel: 2026-10-23 és 2026-10-27 között már van függőben lévő foglalási kérelem.
Lépések:

Próbálj foglalni: érkezés 2026-10-24, távozás 2026-10-26.
Küldés.

Elvárt eredmény:

A rendszer jelzi, hogy a választott időszakra már érkezett függőben lévő foglalási kérelem („A választott időszakra már érkezett függőben lévő foglalási kérelem.”), és nem engedi a foglalást.

7. Admin – Foglalás elfogadása
Tesztazonosító: UAT-ADMIN-01

Szerepkör: Adminisztrátor
Lépések:

Jelentkezz be admin fiókkal.
Nyisd meg a foglalások listáját.
Válaszd ki a függőben lévő foglalást.
Állítsd a státuszt „Elfogadva”-ra.

Elvárt eredmény:

Sikeres státuszváltás üzenet jelenik meg.

A foglalás megjelenik a naptárban (elfogadott foglalásként).

8. Admin – Bejelentkezés helytelen jelszóval
Tesztazonosító: UAT-ADMIN-02
Lépések:

Próbálj bejelentkezni helyes felhasználónévvel, de rossz jelszóval.

Elvárt eredmény:

Bejelentkezés sikertelen, hibaüzenet jelenik meg, nem jutsz be az admin felületre.
