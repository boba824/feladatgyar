# Változásnapló (Changelog)

Minden lényeges változás ebben a fájlban kerül dokumentálásra.

A formátum a [Keep a Changelog](https://keepachangelog.com/hu/1.1.0/) ajánlásain alapul, a projekt pedig a [Szemantikus Verziózást (SemVer)](https://semver.org/lang/hu/) követi (`MAJOR.MINOR.PATCH`).

## [1.3.0] - 2026-11-13

### Hozzáadva (Added)
- **Matematika 1. osztály – I. és II. kötet (1–12. fejezet):** Aktiválva az **1. osztály** évfolyamválasztó gomb, és elkészült a teljes 1. osztályos feladatgenerátor az Oktatási Hivatal NAT 2020 (`OH-MAT01MA/I` és `OH-MAT01MA/II`) munkafüzetei alapján:
  1. Válogatások, összehasonlítások és tájékozódás
  2. Számok és számolás 0-tól 5-ig
  3. Számolás 6-ig és 7-ig, páros-páratlan számok és számszomszédok
  4. Számolás 8-ig és 9-ig, nyitott mondatok és sorszámnevek
  5. A tíz, számolás 0-tól 10-ig és szöveges feladatok
  6. Megálló – Félévi ismétlés 0-tól 10-ig
  7. Vonalak, síkidomok, testek és mérések (`dm`, `kg`, `dl`, `l`)
  8. Számok 20-ig, számolás 11–12-ig és időmérés
  9. Számolás 13-ig és 14-ig (tízesátlépés)
  10. Számolás 15-ig és 16-ig
  11. Számolás 17-ig, 18-ig és 19-ig
  12. A húsz, számolás 20-ig, év végi ismétlés és játék a tükörrel
- **Matematika 2. osztály – I. és II. kötet (1–12. fejezet):** Aktiválva a **2. osztály** évfolyamválasztó gomb, és elkészült a teljes 2. osztályos feladatgenerátor az Oktatási Hivatal NAT 2020 (`OH-MAT02MA/I` és `OH-MAT02MA/II`) munkafüzetei alapján:
  1. Számok, összeadás és kivonás 0-tól 20-ig
  2. A szorzás, az osztás, 2-es szorzótábla és római számok (`I`–`XX`)
  3. Kitekintés 100-ig, kerek tízesek és 10-es szorzótábla
  4. Számolás 30-ig, 3-as szorzótábla (maradékos osztással) és időmérés
  5. Számolás 40-ig és 4-es szorzótábla
  6. Számolás 50-ig és 5-ös szorzótábla
  7. Geometria: testek, síkidomok, vonalak és szimmetria
  8. Számolás 60-ig, 6-os szorzótábla és időmérés (`1 óra = 60 perc`)
  9. Számolás 70-ig, 7-es szorzótábla és naptár (`1 hét = 7 nap`)
  10. Számolás 80-ig és 90-ig, 8-as és 9-es szorzótábla
  11. Számok, műveletek 100-ig és római számok
  12. Mérések (hosszúság, tömeg, űrtartalom) és év végi ismétlés

### Módosítva (Changed)
- **Megjelenés (UI/UX):** A korábbi lilás-indigókék színek helyett világosabb, letisztult tengerészkék (navy blue) színvilág és átmenetek bevezetése a fejlécben, a vezérlősávban, a gombokon és a kiértékelő blokkokon.

---

## [1.2.0] - 2026-11-13

### Hozzáadva (Added)
- **Matematika 3. osztály – I. és II. kötet (1–12. fejezet):** Aktiválva a **3. osztály** évfolyamválasztó gomb, és elkészült a teljes 3. osztályos feladatgenerátor az Oktatási Hivatal NAT 2020 (`OH-MAT03-I` és `OH-MAT03-II`) munkafüzetei alapján:
  1. Számolás 0-tól 100-ig, maradékos osztás és műveleti sorrend
  2. Római számok (`I`-től `C`-ig) és I. tudáspróba
  3. Számok és műveletek 200-ig (helyi értékek, kerekítés)
  4. Tömeg (`dkg, kg, fél kg`) és űrtartalom (`cl, dl, l`) mérése
  5. Számok, kerekítés és műveletek 500-ig
  6. Írásbeli összeadás becsléssel (500-ig)
  7. Írásbeli kivonás becsléssel (500-ig)
  8. Negatív számok (hőmérséklet), testek és síkidomok
  9. Számok és műveletek 1000-ig
  10. Írásbeli szorzás egyjegyű szorzóval
  11. Egységtörtek, időmérés, hosszúságmérés, kerület és terület
  12. Év végi ismétlés és mindennapi pénzügyek

---

## [1.1.1] - 2026-11-11

### Módosítva (Changed)
- **Fejléc és navigáció:**
  - Alcím finomítása: *"Otthoni interaktív gyakorlófeladatok (NAT 2020)"*.
  - Narancssárga `NAT 2020` címke eltávolítva a főcím mellől a letisztultabb megjelenésért.
  - Mobilon összébb húzott évfolyam-választó sáv (az összes évfolyam kényelmesen kifér egyetlen sorban).
  - A fejezetszám jelvény és a fejezetváltó gomb egyesítve a blokk legtetején (`[✨ X. fejezet] Fejezet váltása ▾`), a cím és a leírás pedig teljes szélességű lett (megszűnt a mobilos jobbra csúszás).
- **Vezérlősáv és kiértékelés blokk:**
  - A fejezetblokk és az alsó kiértékelés blokk egységes, karakteres indigó–lila színátmenetes hátteret kapott, elválva a feladatkártyáktól.
  - Az „Összes ellenőrzése & Értékelés” gomb áthelyezve az alsó kiértékelés kártyára kiemelt zöld gombként.
- **Feladatkártyák (UI/UX):**
  - Beviteli mezők segédszövegeinek (`placeholder`) méretezése és a mezők szélességének növelése, így a segédszövegek többé sehol sem lógnak ki a dobozból.
  - Felesleges Enter-es segédszöveg törlése a feladatkártyák aljáról, az „Azonnali ellenőrzés” gomb szövegtörésének megszüntetése.
- **Lábléc:** Verziószám jelvény középre rendezése.

---

## [1.1.0] - 2026-11-10

### Hozzáadva (Added)
- **Kompakt, lenyíló fejezetválasztó:** A vezérlősávba integrált, kinyitható és választáskor automatikusan visszazáródó fejezetválasztó panel (mobilon 1, tableten és asztali gépen 2 oszlopos elrendezéssel).
- **Keresőoptimalizálás (SEO):** Teljes meta leírás, kulcsszavak, `canonical` URL, Open Graph / közösségi megosztási kártyák, Schema.org (`WebApplication` + `LearningResource`) JSON-LD strukturált adatok, valamint `robots.txt` és `sitemap.xml`.
- **Google Analytics 4 (GA4):** Látogatottságmérés bekötése (`gtag.js`).
- **Egyéni domain támogatás:** `public/CNAME` fájl hozzáadása a `feladatgyar.hu` domainhez.
- **Verziószám kijelzése:** Az aktuális verziószám (`package.json` alapján) megjelenítése az oldal láblécében.

### Módosítva (Changed)
- **GitHub Actions CI/CD:** A munkafolyamat (`deploy.yml`) frissítése Node.js 24-re és a legújabb action főverziókra (`checkout@v7`, `setup-node@v7`, `configure-pages@v6`, `upload-pages-artifact@v5`, `deploy-pages@v5`), valamint `ubuntu-24.04` futtatókörnyezetre.

---

## [1.0.0] - 2026-11-08

### Hozzáadva (Added)
- **Matematika 4. osztály – I. és II. kötet (1–12. fejezet):** Végtelenített feladatgenerátor az Oktatási Hivatal NAT 2020 (OH-MAT04MA) munkafüzetei alapján:
  1. Számolás 0-tól 1000-ig & Római számok
  2. Számolás és kerekítés 10 000-ig
  3. Mérések és mértékegység-átváltás
  4. Írásbeli műveletek 0-tól 10 000-ig (négyzetrácsos nézettel és becsléssel)
  5. A negatív számok (hőmérséklet, hőingás, vagyon/tartozás)
  6. Szöveges feladatok & I. félévi tudáspróba
  7. Írásbeli osztás egyjegyű számmal (maradékos és maradék nélküli)
  8. Geometria, síkidomok és testek (kerület, terület, élek/lapok/csúcsok)
  9. Törtek és törtrészek
  10. Időmérés és római számok 2000-ig
  11. Pénzhasználat és szöveges feladatok
  12. Év végi nagy tudáspróba (I–II. kötet)
- **Interaktív gyakorló mód:** Azonnali ellenőrzés feladatonként vagy egyszerre, opcionális válaszjavítási lehetőséggel, tippekkel és 4 fokozatú szöveges/hangulatjeles értékelő skálával.
- **Nyomtatható A4-es feladatlap nézet:** Külön oldalon nyomtatható szülői megoldókulccsal.
- **Lábléc:** Kapcsolati e-mail cím és forrásmegjelölés.
