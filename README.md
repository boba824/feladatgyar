# Feladatgyár - Tudásépítő Feladatgenerátor (NAT 2020)

Böngészőből futtatható, statikusan (GitHub Pages-ről, egyéni domainnel: [feladatgyar.hu](https://feladatgyar.hu/)) hostolható interaktív és nyomtatható feladatgeneráló alkalmazás általános iskolások otthoni gyakorlásához, az Oktatási Hivatal **NAT 2020** munkafüzetei alapján.

## Jelenleg elérhető modulok (Matematika 1–4. osztály)

Minden évfolyam tananyaga az I. és II. kötet fejezeteire (**évfolyamonként 12 fejezetre**, összesen **48 fejezetre**) bontva érhető el:

### Matematika – 1. osztály (`OH-MAT01MA/I–II` alapján)
- **I. kötet (1–6. fejezet):**
  1. Válogatások, Összehasonlítások & Tájékozódás
  2. Számok és számolás 0-tól 5-ig
  3. Számolás 6-ig és 7-ig, Páros-páratlan & Számszomszédok
  4. Számolás 8-ig és 9-ig, Nyitott mondatok & Sorszámnevek
  5. A tíz, Számolás 0-tól 10-ig & Szöveges feladatok
  6. Megálló – Félévi ismétlés 0-tól 10-ig
- **II. kötet (7–12. fejezet):**
  7. Vonalak, síkidomok, testek & Mérések (`dm, m, kg, dl, l`)
  8. Számok 20-ig, Számolás 11–12-ig & Időmérés
  9. Számolás 13-ig és 14-ig (Tízesátlépés)
  10. Számolás 15-ig és 16-ig
  11. Számolás 17-ig, 18-ig és 19-ig
  12. A húsz, Számolás 20-ig & Év végi ismétlés (Játék a tükörrel)

### Matematika – 2. osztály (`OH-MAT02MA/I–II` alapján)
- **I. kötet (1–6. fejezet):**
  1. Számok, összeadás és kivonás 0-tól 20-ig
  2. A szorzás, az osztás, 2-es szorzótábla & Római számok (`I–XX`)
  3. Kitekintés 100-ig, Kerek tízesek & 10-es szorzótábla
  4. Számolás 30-ig, 3-as szorzótábla (maradékos osztással) & Időmérés
  5. Számolás 40-ig & 4-es szorzótábla
  6. Számolás 50-ig & 5-ös szorzótábla
- **II. kötet (7–12. fejezet):**
  7. Geometria: Testek, síkidomok, vonalak & Szimmetria
  8. Számolás 60-ig, 6-os szorzótábla & Időmérés (`1 óra = 60 perc`)
  9. Számolás 70-ig, 7-es szorzótábla & Naptár (`1 hét = 7 nap`)
  10. Számolás 80-ig és 90-ig, 8-as és 9-es szorzótábla
  11. Számok, műveletek 100-ig & Római számok
  12. Mérések (Hosszúság, Tömeg, Űrtartalom) & Év végi ismétlés

### Matematika – 3. osztály (`OH-MAT03-I–II` alapján)
- **I. kötet (1–6. fejezet):**
  1. Számolás 0-tól 100-ig, Maradékos osztás & Műveleti sorrend
  2. A római számok (`I–C`) & I. tudáspróba
  3. Számok és műveletek 200-ig (helyi értékek, kerekítés)
  4. Tömeg (`dkg, kg, fél kg`) és űrtartalom (`cl, dl, l`) mérése
  5. Számok, kerekítés és műveletek 500-ig
  6. Írásbeli összeadás becsléssel (500-ig)
- **II. kötet (7–12. fejezet):**
  7. Írásbeli kivonás becsléssel (500-ig)
  8. Negatív számok (hőmérséklet), testek és síkidomok
  9. Számok és műveletek 1000-ig
  10. Írásbeli szorzás egyjegyű szorzóval
  11. Egységtörtek, időmérés, hosszúságmérés, kerület és terület
  12. Év végi ismétlés és mindennapi pénzügyek

### Matematika – 4. osztály (`OH-MAT04MA` és `OH-MAT04MB` alapján)
- **I. kötet (1–6. fejezet):**
  1. Számolás 0-tól 1000-ig & Római számok
  2. Számolás és kerekítés 10 000-ig
  3. Mérések és mértékegység-átváltás
  4. Írásbeli műveletek 0-tól 10 000-ig (négyzetrácsos nézettel és előzetes becsléssel)
  5. A negatív számok (hőmérséklet, hőingás, vagyon és tartozás)
  6. Szöveges feladatok & I. félévi tudáspróba
- **II. kötet (7–12. fejezet):**
  7. Írásbeli osztás egyjegyű számmal (maradékos és maradék nélküli)
  8. Geometria, síkidomok és testek (kerület, terület, élek/lapok/csúcsok)
  9. Törtek és törtrészek
  10. Időmérés és római számok 2000-ig
  11. Mindennapi pénzügyeink, kombinatorika és halmazok
  12. Év végi nagy tudáspróba (I–II. kötet)

## Fő funkciók

- **Ismétlődésmentes, végtelenített feladatgenerálás:** A rendszer egyedi feladat-ujjlenyomat alapján garantálja, hogy egy feladatsoron (`4, 6, 8, 10` vagy `12` feladat) belül soha ne ismétlődjön ugyanaz a feladat.
- **Rávezető segédletek (villanykörte ikon):** Minden feladathoz kérhető pedagógiai segítség, amely a megoldási módszerre, átváltási szabályra vagy az első részlépésre vezet rá, a végeredmény elárulása nélkül.
- **Azonnali visszajelzés és opcionális javítás:** Feladatonkénti (`Enter` vagy *Azonnali ellenőrzés* gomb) és összesített kiértékelés (*Összes ellenőrzése & Értékelés*), bekapcsolható utólagos válaszjavítási lehetőséggel.
- **Munkafüzeti értékelő skála:** Százalékos összesítés és a munkafüzetekből ismert 4 fokozatú szöveges/hangulatjeles értékelés (*„Értékeld a munkádat!”*) konfetti-effekttel.
- **A4-es nyomtatható feladatlap nézet:** Üres négyzetrácsos és kitöltő mezőkkel, valamint külön oldalon nyomtatható **szülői megoldókulccsal**.
- **Mobilbarát, reszponzív felület:** Kompakt, lenyíló kötet- és fejezetválasztó panellel.

## Fejlesztés és build helyben

```bash
npm install
npm run dev
npm run build
```

## Verziótörténet

A részletes változásnapló a [CHANGELOG.md](./CHANGELOG.md) fájlban érhető el.

## GitHub Pages beüzemelése

A tárolóban megtalálható a `.github/workflows/deploy.yml` fájl.
1. Töltsd fel a kódot a GitHub repository `main` (vagy `master`) ágára.
2. A GitHub repository **Settings → Pages** menüpontjában a **Build and deployment → Source** résznél válaszd a **GitHub Actions** opciót.
3. Minden `push` után automatikusan lefordul és frissül az éles oldal.
