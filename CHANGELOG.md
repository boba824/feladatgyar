# Változásnapló (Changelog)

Minden lényeges változás ebben a fájlban kerül dokumentálásra.

A formátum a [Keep a Changelog](https://keepachangelog.com/hu/1.1.0/) ajánlásain alapul, a projekt pedig a [Szemantikus Verziózást (SemVer)](https://semver.org/lang/hu/) követi (`MAJOR.MINOR.PATCH`).

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
