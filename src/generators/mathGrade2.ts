import {
  Exercise,
  HungarianChoiceExercise,
  PlaceValueExercise,
  RomanNumeralsExercise,
  RoundingNeighborsExercise,
  WordProblemExercise,
  WrittenDivisionExercise,
} from '../types/curriculum';
import { toRoman } from './mathGrade4';

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function uid(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}-${Date.now().toString(36)}`;
}

// ============================================================================
// Segédgenerátorok 2. osztályos szinthez (0–100)
// ============================================================================

/** Összeadás vagy kivonás a megadott számkörben (pl. 0–20, 0–30, ..., 0–100) */
function generateAddSubRange(
  topicId: string,
  maxRange: number,
  options?: { allowMissingOperand?: boolean; titlePrefix?: string }
): PlaceValueExercise {
  const allowMissing = options?.allowMissingOperand ?? true;
  const variant = allowMissing ? randInt(1, 4) : randInt(1, 2);

  if (variant === 1) {
    // Összeadás tízesátlépéssel vagy anélkül
    const a = randInt(2, Math.max(4, maxRange - 5));
    const b = randInt(2, maxRange - a);
    const exactResult = a + b;
    return {
      id: uid('add2'),
      kind: 'place-value',
      topicId,
      title: options?.titlePrefix ?? `Összeadás ${maxRange}-ig`,
      instruction: 'Számold ki az összeget!',
      expression: `${a} + ${b}`,
      exactResult,
      hint: `Add hozzá ${a}-hoz a(z) ${b}-t! Ha tízesátlépés van, bontsd fel ${b}-t úgy, hogy először kerek tízesre egészítsd ki!`,
    };
  }

  if (variant === 2) {
    // Kivonás
    const a = randInt(6, maxRange);
    const b = randInt(2, a - 1);
    const exactResult = a - b;
    return {
      id: uid('sub2'),
      kind: 'place-value',
      topicId,
      title: options?.titlePrefix ?? `Kivonás ${maxRange}-ig`,
      instruction: 'Számold ki a különbséget!',
      expression: `${a} - ${b}`,
      exactResult,
      hint: `Vond ki ${a}-ból a(z) ${b}-t! Ellenőrizheted összeadással: mennyi + ${b} = ${a}?`,
    };
  }

  if (variant === 3) {
    // Pótlás összeadásban: a + ? = sum
    const sum = randInt(8, maxRange);
    const a = randInt(2, sum - 2);
    const exactResult = sum - a;
    return {
      id: uid('miss-add2'),
      kind: 'place-value',
      topicId,
      title: 'Hiányzó szám pótlása',
      instruction: 'Melyik szám hiányzik a műveletből? Írd be a hiányzó számot!',
      expression: `${a} + ? = ${sum}`,
      exactResult,
      hint: `Gondolkodj így: ${a}-hoz mennyit kell adni, hogy ${sum} legyen? Számold ki: ${sum} - ${a} = ${exactResult}.`,
    };
  }

  // Pótlás kivonásban: a - ? = diff
  const a = randInt(8, maxRange);
  const diff = randInt(1, a - 2);
  const exactResult = a - diff;
  return {
    id: uid('miss-sub2'),
    kind: 'place-value',
    topicId,
    title: 'Hiányzó szám pótlása',
    instruction: 'Melyik szám hiányzik a kivonásból? Írd be a hiányzó számot!',
    expression: `${a} - ? = ${diff}`,
    exactResult,
    hint: `${a}-ból mennyit kell elvenni, hogy ${diff} maradjon? Számold ki: ${a} - ${diff} = ${exactResult}.`,
  };
}

/** Szorzás vagy osztás egy adott szorzótáblával (pl. 2, 3, 4, 5, 6, 7, 8, 9, 10) */
function generateMulDivByTable(
  topicId: string,
  factor: number
): PlaceValueExercise {
  const isMul = randInt(0, 1) === 0;
  const other = randInt(1, 10);

  if (isMul) {
    const swap = randInt(0, 1) === 0;
    const left = swap ? factor : other;
    const right = swap ? other : factor;
    const exactResult = left * right;
    return {
      id: uid('mul2'),
      kind: 'place-value',
      topicId,
      title: `Szorzás ${factor}-vel (${factor}-es szorzótábla)`,
      instruction: 'Számítsd ki a szorzatot!',
      expression: `${left} · ${right}`,
      exactResult,
      hint: `A szorzás többszöri összeadás: ${left} · ${right} = ${exactResult}.`,
    };
  }

  const dividend = factor * other;
  return {
    id: uid('div2'),
    kind: 'place-value',
    topicId,
    title: `Osztás ${factor}-vel (${factor}-es bennfoglalótábla)`,
    instruction: 'Számítsd ki a hányadost!',
    expression: `${dividend} : ${factor}`,
    exactResult: other,
    hint: `Hányszor van meg a(z) ${dividend}-ben a(z) ${factor}? Ellenőrzés: ${other} · ${factor} = ${dividend}.`,
  };
}

/** Maradékos osztás adott osztóval (2. osztályos szint: hányados 1–9, maradék 1..osztó-1) */
function generateRemainderDiv2(
  topicId: string,
  divisor: number
): WrittenDivisionExercise {
  const quotient = randInt(2, 9);
  const remainder = randInt(1, divisor - 1);
  const dividend = quotient * divisor + remainder;

  return {
    id: uid('rdiv2'),
    kind: 'written-division',
    topicId,
    title: `Maradékos osztás ${divisor}-vel`,
    instruction: `Végezd el a maradékos osztást! A maradék mindig kisebb, mint ${divisor}!`,
    dividend,
    divisor,
    quotient,
    remainder,
    hasRemainder: true,
    hint: `Keresd meg a(z) ${dividend}-nél kisebb legnagyobb számot, amelyben megvan a(z) ${divisor}: ${quotient} · ${divisor} = ${quotient * divisor}, maradék: ${dividend} - ${quotient * divisor} = ${remainder}.`,
  };
}

/** Római számok 2. osztályban (I–XX, vagy kerek tízesek 100-ig) */
function generateRoman2(topicId: string, maxVal: 20 | 100): RomanNumeralsExercise {
  const pool =
    maxVal === 20
      ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
      : [4, 6, 9, 12, 14, 15, 19, 20, 24, 30, 40, 50, 60, 70, 80, 90, 100];
  const n = pickRandom(pool);
  const roman = toRoman(n);
  const toArabic = randInt(0, 1) === 0;

  return {
    id: uid('rom2'),
    kind: 'roman-numerals',
    topicId,
    title: 'Római számok',
    instruction: toArabic
      ? 'Írd le a római számot arab számmal!'
      : 'Írd át a számot római számmal (nagybetűkkel: I, V, X, L, C)!',
    direction: toArabic ? 'roman-to-arabic' : 'arabic-to-roman',
    promptValue: toArabic ? roman : String(n),
    exactAnswer: toArabic ? String(n) : roman,
    hint: `Emlékeztető: I = 1, V = 5, X = 10${maxVal === 100 ? ', L = 50, C = 100' : ''}. Ha kisebb jel áll a nagyobb előtt, kivonjuk (pl. IV = 4, IX = 9).`,
  };
}

/** Számszomszédok és kerekítés 100-ig */
function generateRounding100(topicId: string): RoundingNeighborsExercise {
  const tens = randInt(1, 9) * 10;
  const ones = pickRandom([1, 2, 3, 4, 6, 7, 8, 9]);
  const num = tens + ones;
  const smallerNeighbor = tens;
  const largerNeighbor = tens + 10;
  const rounded = ones < 5 ? smallerNeighbor : largerNeighbor;

  return {
    id: uid('rnd2'),
    kind: 'rounding-neighbors',
    topicId,
    title: 'Tízes szomszédok és kerekítés 100-ig',
    instruction: 'Add meg a szám kisebb és nagyobb tízes szomszédját, majd kerekítsd tízesekre!',
    item: {
      number: num,
      smallerNeighbor,
      largerNeighbor,
      rounded,
      neighborType: 'tízes',
    },
    hint: `A(z) ${num} a(z) ${smallerNeighbor} és a(z) ${largerNeighbor} között van. Mivel az egyesek helyén ${ones} áll, ${ones < 5 ? 'lefelé' : 'felfelé'} kerekítünk: ${rounded}.`,
  };
}

/** Szöveges feladat segítő */
function makeWordProblem(
  topicId: string,
  title: string,
  story: string,
  question: string,
  unit: string,
  exactResult: number,
  solutionSteps: string,
  hint: string,
  instruction = 'Olvasd el figyelmesen a szöveges feladatot, és írd be a választ!'
): WordProblemExercise {
  return {
    id: uid('wp2'),
    kind: 'word-problem',
    topicId,
    title,
    instruction,
    story,
    question,
    unit,
    exactResult,
    solutionSteps,
    hint,
  };
}

// ============================================================================
// Fejezetspecifikus generátorok (1–12. fejezet)
// ============================================================================

function generateTopic1(topicId: string, idx: number): Exercise {
  // 1. fejezet: Számok, összeadás és kivonás 0-tól 20-ig (I. kötet 3–15. o.)
  const mod = idx % 4;
  if (mod === 0) {
    return generateAddSubRange(topicId, 20, {
      allowMissingOperand: false,
      titlePrefix: 'Számolás 0-tól 20-ig',
    });
  }
  if (mod === 1) {
    return generateAddSubRange(topicId, 20, {
      allowMissingOperand: true,
      titlePrefix: 'Pótlás a 20-as számkörben',
    });
  }
  if (mod === 2) {
    // Egyes számszomszédok / két művelet egymás után
    const a = randInt(4, 9);
    const b = randInt(3, 8);
    const c = randInt(2, 5);
    const exactResult = a + b - c;
    return {
      id: uid('chain2-20'),
      kind: 'place-value',
      topicId,
      title: 'Kétlépéses számolás 20-ig',
      instruction: 'Számold ki az eredményt balról jobbra haladva!',
      expression: `${a} + ${b} - ${c}`,
      exactResult,
      hint: `Először add össze: ${a} + ${b} = ${a + b}, majd vegyél el belőle ${c}-t: ${a + b} - ${c} = ${exactResult}.`,
    };
  }
  // Szöveges feladat 20-ig
  const variant = randInt(1, 2);
  if (variant === 1) {
    const start = randInt(7, 12);
    const added = randInt(4, 8);
    const total = start + added;
    return makeWordProblem(
      topicId,
      'Fagylaltos és gyümölcsös feladat (I. kötet)',
      `A tálcán ${start} piros alma volt, majd édesanya még ${added} zöld almát tett mellé.`,
      'Hány alma lett összesen a tálcán?',
      'db',
      total,
      `${start} + ${added} = ${total}`,
      `Add össze a két mennyiséget: ${start} + ${added} = ${total}!`
    );
  }
  const all = randInt(13, 19);
  const gone = randInt(5, 9);
  const left = all - gone;
  return makeWordProblem(
    topicId,
    'Madarak a fán (0–20)',
    `A kerti fán ${all} veréb csiripelt. Közülük ${gone} elrepült.`,
    'Hány veréb maradt a fán?',
    'db',
    left,
    `${all} - ${gone} = ${left}`,
    `Vond ki a(z) ${all}-ből az elrepült ${gone} verebet!`
  );
}

function generateTopic2(topicId: string, idx: number): Exercise {
  // 2. fejezet: A szorzás, az osztás, 2-es szorzótábla & Római számok (I. kötet 16–29. o.)
  const mod = idx % 4;
  if (mod === 0) {
    return generateMulDivByTable(topicId, 2);
  }
  if (mod === 1) {
    return generateRoman2(topicId, 20);
  }
  if (mod === 2) {
    // Szorzás mint többszöri összeadás
    const times = randInt(3, 8);
    const exactResult = times * 2;
    const sumText = Array.from({ length: times }, () => '2').join(' + ');
    return {
      id: uid('mulsum2'),
      kind: 'place-value',
      topicId,
      title: 'A szorzás mint többszöri összeadás',
      instruction: 'Írd be, mennyi az összeadás (és a szorzás) eredménye!',
      expression: `${sumText} = ${times} · 2`,
      exactResult,
      hint: `Számold össze a ketteseket (${times} darab 2-es): ${times} · 2 = ${exactResult}.`,
    };
  }
  const pairs = randInt(4, 9);
  const total = pairs * 2;
  return makeWordProblem(
    topicId,
    'Cipők és párok (Szorzás 2-vel)',
    `Az előszobában ${pairs} pár cipő sorakozik egymás mellett.`,
    'Hány darab cipő van összesen az előszobában?',
    'db',
    total,
    `${pairs} · 2 = ${total}`,
    `Egy párban 2 cipő van, tehát ${pairs} · 2 = ${total}.`
  );
}

function generateTopic3(topicId: string, idx: number): Exercise {
  // 3. fejezet: Kitekintés 100-ig, Kerek tízesek & 10-es szorzótábla (I. kötet 30–39. o.)
  const mod = idx % 4;
  if (mod === 0) {
    // Kerek tízesek összeadása / kivonása
    const isAdd = randInt(0, 1) === 0;
    if (isAdd) {
      const a = randInt(2, 6) * 10;
      const b = randInt(1, 9 - a / 10) * 10;
      return {
        id: uid('tens-add2'),
        kind: 'place-value',
        topicId,
        title: 'Összeadás kerek tízesekkel',
        instruction: 'Add össze a kerek tízeseket!',
        expression: `${a} + ${b}`,
        exactResult: a + b,
        hint: `${a / 10} tízes + ${b / 10} tízes = ${(a + b) / 10} tízes, azaz ${a + b}.`,
      };
    }
    const a = randInt(4, 10) * 10;
    const b = randInt(1, a / 10 - 1) * 10;
    return {
      id: uid('tens-sub2'),
      kind: 'place-value',
      topicId,
      title: 'Kivonás kerek tízesekkel',
      instruction: 'Vond ki a kerek tízeseket!',
      expression: `${a} - ${b}`,
      exactResult: a - b,
      hint: `${a / 10} tízes - ${b / 10} tízes = ${(a - b) / 10} tízes, azaz ${a - b}.`,
    };
  }
  if (mod === 1) {
    return generateMulDivByTable(topicId, 10);
  }
  if (mod === 2) {
    // Helyi érték 100-ig: X t + Y e
    const t = randInt(2, 9);
    const e = randInt(1, 9);
    return {
      id: uid('pv2-100'),
      kind: 'place-value',
      topicId,
      title: 'Tízesek és egyesek (Kitekintés 100-ig)',
      instruction: 'Melyik számot írtuk fel tízesekkel és egyesekkel? Írd be számjegyekkel!',
      expression: `${t} t + ${e} e`,
      exactResult: t * 10 + e,
      hint: `${t} tízes = ${t * 10}, ehhez jön ${e} egyes → ${t * 10 + e}.`,
    };
  }
  const boxes = randInt(3, 9);
  const total = boxes * 10;
  return makeWordProblem(
    topicId,
    'Színes ceruzák dobozokban (10-es szorzótábla)',
    `Minden dobozban 10 darab színes ceruza van. Bence ${boxes} doboz ceruzát számolt meg a polcon.`,
    'Hány darab színes ceruza van összesen a polcon?',
    'db',
    total,
    `${boxes} · 10 = ${total}`,
    `Szorozd meg a dobozok számát 10-zel: ${boxes} · 10 = ${total}.`
  );
}

function generateTopic4(topicId: string, idx: number): Exercise {
  // 4. fejezet: Számolás 30-ig, 3-as szorzótábla & Időmérés (I. kötet 40–55. o.)
  const mod = idx % 4;
  if (mod === 0) {
    return generateAddSubRange(topicId, 30, { titlePrefix: 'Számolás 30-ig' });
  }
  if (mod === 1) {
    return generateMulDivByTable(topicId, 3);
  }
  if (mod === 2) {
    return generateRemainderDiv2(topicId, 3);
  }
  // Időmérés (óra, fél óra, perc)
  const variant = randInt(1, 2);
  if (variant === 1) {
    const startHour = randInt(8, 15);
    const duration = randInt(2, 5);
    return makeWordProblem(
      topicId,
      'Az idő mérése (I. kötet 54. o.)',
      `A kirándulás délelőtt ${startHour} órakor kezdődött és ${duration} órán át tartott.`,
      'Hány órakor ért véget a kirándulás?',
      'óra',
      startHour + duration,
      `${startHour} + ${duration} = ${startHour + duration}`,
      `Adj hozzá ${startHour} órához ${duration} órát!`
    );
  }
  const days = randInt(1, 2);
  return {
    id: uid('time2-day'),
    kind: 'unit-conversion',
    topicId,
    title: 'Időegységek: nap és óra',
    instruction: 'Váltsd át az időtartamot órára!',
    category: 'idő',
    sourceText: `${days} nap`,
    targetUnit: 'óra',
    exactResult: days * 24,
    hint: `1 nap = 24 óra, tehát ${days} nap = ${days * 24} óra.`,
  };
}

function generateTopic5(topicId: string, idx: number): Exercise {
  // 5. fejezet: Számolás 40-ig & 4-es szorzótábla (I. kötet 56–68. o.)
  const mod = idx % 4;
  if (mod === 0) {
    return generateAddSubRange(topicId, 40, { titlePrefix: 'Számolás 40-ig' });
  }
  if (mod === 1) {
    return generateMulDivByTable(topicId, 4);
  }
  if (mod === 2) {
    return generateRemainderDiv2(topicId, 4);
  }
  const cars = randInt(4, 9);
  const wheels = cars * 4;
  return makeWordProblem(
    topicId,
    'Kisautók kerekei (4-es szorzótábla)',
    `A játékpolcon ${cars} darab négykerekű kisautó áll egymás mellett.`,
    'Hány kerék van összesen a kisautókon?',
    'db',
    wheels,
    `${cars} · 4 = ${wheels}`,
    `Minden autón 4 kerék van, tehát ${cars} · 4 = ${wheels}.`
  );
}

function generateTopic6(topicId: string, idx: number): Exercise {
  // 6. fejezet: Számolás 50-ig & 5-ös szorzótábla (I. kötet 69–79. o.)
  const mod = idx % 4;
  if (mod === 0) {
    return generateAddSubRange(topicId, 50, { titlePrefix: 'Számolás 50-ig' });
  }
  if (mod === 1) {
    return generateMulDivByTable(topicId, 5);
  }
  if (mod === 2) {
    return generateRemainderDiv2(topicId, 5);
  }
  const coins = randInt(4, 9);
  const sum = coins * 5;
  return makeWordProblem(
    topicId,
    'Ötforintosok a perselyben (5-ös szorzótábla)',
    `Petra perselyében ${coins} darab 5 forintos érme van.`,
    'Hány forint van összesen Petra perselyében?',
    'Ft',
    sum,
    `${coins} · 5 = ${sum}`,
    `Szorozd meg az érmék számát 5-tel: ${coins} · 5 = ${sum} Ft.`
  );
}

function generateTopic7(topicId: string, idx: number): Exercise {
  // 7. fejezet: Geometria – Testek, síkidomok, vonalak & Szimmetria (II. kötet 3–11. o.)
  const mod = idx % 3;
  if (mod === 0) {
    const questions: Array<{
      prompt: string;
      options: string[];
      correct: string;
      hint: string;
    }> = [
      {
        prompt: 'Melyik tartozik a TESTEK (térbeli alakzatok) közé?',
        options: ['Kocka', 'Négyzet', 'Háromszög', 'Kör'],
        correct: 'Kocka',
        hint: 'A négyzet, háromszög és kör síkidomok (laposak), míg a kocka egy térbeli test!',
      },
      {
        prompt: 'Melyik tartozik a SÍKIDOMOK közé?',
        options: ['Téglalap', 'Gömb', 'Henger', 'Gúla'],
        correct: 'Téglalap',
        hint: 'A gömb, henger és gúla térbeli testek, a téglalap viszont síkidom.',
      },
      {
        prompt: 'Melyik síkidomot határolja CSAK görbe vonal?',
        options: ['Kör', 'Négyzet', 'Háromszög', 'Téglalap'],
        correct: 'Kör',
        hint: 'A négyzetet, háromszöget és téglalapot egyenes szakaszok határolják, a kört görbe vonal.',
      },
      {
        prompt: 'Melyik állítás IGAZ a szimmetrikus alakzatokra?',
        options: [
          'A tükörtengely mentén félbehajtva a két fél pontosan fedi egymást.',
          'Minden alakzatnak pontosan egy oldala van.',
          'Csak a kör lehet szimmetrikus.',
          'A szimmetrikus alakzat két fele mindig különböző méretű.',
        ],
        correct: 'A tükörtengely mentén félbehajtva a két fél pontosan fedi egymást.',
        hint: 'Ha félbehajtod a szimmetrikus ábrát a tükörtengelynél, a két fele pontosan illeszkedik egymásra.',
      },
    ];
    const q = questions[Math.floor(idx / 3) % questions.length];
    const ex: HungarianChoiceExercise = {
      id: uid('geo2-choice'),
      kind: 'hu-choice',
      topicId,
      title: 'Testek, síkidomok és szimmetria (II. kötet 4–7. o.)',
      instruction: 'Válaszd ki a helyes választ!',
      promptText: q.prompt,
      options: q.options,
      correctOption: q.correct,
      explanation: q.hint,
      hint: q.hint,
    };
    return ex;
  }

  if (mod === 1) {
    // Százas táblás tájékozódás (Bevezető, II. kötet 3. o.)
    const num = randInt(23, 76);
    const dir = pickRandom([
      { label: 'fölötte', delta: -10, explain: '10-zel kisebb' },
      { label: 'alatta', delta: 10, explain: '10-zel nagyobb' },
      { label: 'tőle 4-gyel jobbra', delta: 4, explain: '4-gyel nagyobb' },
      { label: 'tőle 2-vel balra', delta: -2, explain: '2-vel kisebb' },
    ]);
    return makeWordProblem(
      topicId,
      'Tájékozódás a százas táblán (II. kötet 3. o.)',
      `A százas táblán (ahol minden sorban 10 szám van: 1–10, 11–20, ...) a(z) ${num} számot nézzük.`,
      `Melyik szám áll közvetlenül ${dir.label}?`,
      '',
      num + dir.delta,
      `${num} ${dir.delta >= 0 ? '+' : '-'} ${Math.abs(dir.delta)} = ${num + dir.delta}`,
      `A százas táblán a(z) ${dir.label} lévő szám ${dir.explain}: ${num} ${dir.delta >= 0 ? '+' : '-'} ${Math.abs(dir.delta)}.`
    );
  }

  // Testek / síkidomok számlálása
  const squares = randInt(3, 6);
  const triangles = randInt(2, 5);
  return makeWordProblem(
    topicId,
    'Logikai lapok – Oldalak számlálása (II. kötet 4–5. o.)',
    `Anna logikai lapokból kirakott egy házikót, amelyhez ${squares} négyzetet és ${triangles} háromszöget használt fel.`,
    'Hány oldala van összesen az így felhasznált síkidomoknak?',
    'oldal',
    squares * 4 + triangles * 3,
    `${squares} · 4 + ${triangles} · 3 = ${squares * 4 + triangles * 3}`,
    `Egy négyzetnek 4 oldala, egy háromszögnek 3 oldala van.`
  );
}

function generateTopic8(topicId: string, idx: number): Exercise {
  // 8. fejezet: Számolás 60-ig, 6-os szorzótábla & Időmérés (II. kötet 12–23. o.)
  const mod = idx % 4;
  if (mod === 0) {
    return generateAddSubRange(topicId, 60, { titlePrefix: 'Számolás 60-ig' });
  }
  if (mod === 1) {
    return generateMulDivByTable(topicId, 6);
  }
  if (mod === 2) {
    return generateRemainderDiv2(topicId, 6);
  }
  // Időmérés: 1 óra = 60 perc
  const minsExtra = pickRandom([10, 15, 20, 30, 45]);
  return {
    id: uid('time2-60'),
    kind: 'unit-conversion',
    topicId,
    title: 'Időmérés: óra és perc (II. kötet 23. o.)',
    instruction: 'Váltsd át az időtartamot percre! (1 óra = 60 perc)',
    category: 'idő',
    sourceText: `1 óra ${minsExtra} perc`,
    targetUnit: 'perc',
    exactResult: 60 + minsExtra,
    hint: `1 óra = 60 perc, tehát 60 + ${minsExtra} = ${60 + minsExtra} perc.`,
  };
}

function generateTopic9(topicId: string, idx: number): Exercise {
  // 9. fejezet: Számolás 70-ig, 7-es szorzótábla & Naptár (II. kötet 24–35. o.)
  const mod = idx % 4;
  if (mod === 0) {
    return generateAddSubRange(topicId, 70, { titlePrefix: 'Számolás 70-ig' });
  }
  if (mod === 1) {
    return generateMulDivByTable(topicId, 7);
  }
  if (mod === 2) {
    return generateRemainderDiv2(topicId, 7);
  }
  const weeks = randInt(3, 9);
  return {
    id: uid('time2-weeks'),
    kind: 'unit-conversion',
    topicId,
    title: 'Hetek és napok (II. kötet 35. o.)',
    instruction: 'Számold ki, hány napból áll a megadott időtartam! (1 hét = 7 nap)',
    category: 'idő',
    sourceText: `${weeks} hét`,
    targetUnit: 'nap',
    exactResult: weeks * 7,
    hint: `1 hét = 7 nap, tehát ${weeks} · 7 = ${weeks * 7} nap.`,
  };
}

function generateTopic10(topicId: string, idx: number): Exercise {
  // 10. fejezet: Számolás 80-ig és 90-ig, 8-as és 9-es szorzótábla (II. kötet 36–51. o.)
  const mod = idx % 4;
  if (mod === 0) {
    return generateAddSubRange(topicId, 90, { titlePrefix: 'Számolás 90-ig' });
  }
  if (mod === 1) {
    const factor = pickRandom([8, 9]);
    return generateMulDivByTable(topicId, factor);
  }
  if (mod === 2) {
    const divisor = pickRandom([8, 9]);
    return generateRemainderDiv2(topicId, divisor);
  }
  // 2-es, 4-es, 8-as szorzótábla kapcsolata (II. kötet 43. o.)
  const base = randInt(2, 9);
  return makeWordProblem(
    topicId,
    'A 2-es, 4-es és 8-as szorzótábla kapcsolata (II. kötet 43. o.)',
    `Ha ${base} · 4 = ${base * 4}, akkor ennek segítségével könnyen kiszámolhatod a nyolcszorosát is.`,
    `Mennyi ${base} · 8?`,
    '',
    base * 8,
    `${base} · 4 = ${base * 4}, ennek a kétszerese ${base * 8}`,
    `A 8 a 4-nek a kétszerese! Duplázd meg a ${base * 4}-et: ${base * 4} + ${base * 4} = ${base * 8}.`
  );
}

function generateTopic11(topicId: string, idx: number): Exercise {
  // 11. fejezet: Számok, műveletek 100-ig & Római számok (II. kötet 52–63. o.)
  const mod = idx % 4;
  if (mod === 0) {
    return generateRounding100(topicId);
  }
  if (mod === 1) {
    return generateAddSubRange(topicId, 100, { titlePrefix: 'Összeadás és kivonás 100-ig' });
  }
  if (mod === 2) {
    const factor = pickRandom([3, 4, 5, 6, 7, 8, 9]);
    return generateMulDivByTable(topicId, factor);
  }
  return generateRoman2(topicId, 100);
}

function generateTopic12(topicId: string, idx: number): Exercise {
  // 12. fejezet: Mérések (Hosszúság, Tömeg, Űrtartalom) & Év végi ismétlés (II. kötet 64–79. o.)
  const mod = idx % 4;
  if (mod === 0) {
    // Hosszúságmérés (cm, dm, m)
    const variant = randInt(1, 2);
    if (variant === 1) {
      const dm = randInt(2, 9);
      return {
        id: uid('len2-dm'),
        kind: 'unit-conversion',
        topicId,
        title: 'A hosszúság mérése (II. kötet 63–65. o.)',
        instruction: 'Váltsd át centiméterre! (1 dm = 10 cm)',
        category: 'hosszúság',
        sourceText: `${dm} dm`,
        targetUnit: 'cm',
        exactResult: dm * 10,
        hint: `1 dm = 10 cm, így ${dm} dm = ${dm * 10} cm.`,
      };
    }
    const dm = randInt(1, 8);
    const cm = randInt(1, 9);
    return {
      id: uid('len2-dmcm'),
      kind: 'unit-conversion',
      topicId,
      title: 'A hosszúság mérése: dm és cm',
      instruction: 'Váltsd át a hosszúságot centiméterre!',
      category: 'hosszúság',
      sourceText: `${dm} dm ${cm} cm`,
      targetUnit: 'cm',
      exactResult: dm * 10 + cm,
      hint: `${dm} dm = ${dm * 10} cm, ehhez adjuk a ${cm} cm-t → ${dm * 10 + cm} cm.`,
    };
  }

  if (mod === 1) {
    // Tömegmérés (II. kötet 67–68. o.)
    const variant = randInt(1, 2);
    if (variant === 1) {
      const daily = randInt(4, 8);
      return makeWordProblem(
        topicId,
        'Az állatkerti oroszlán (II. kötet 67. o.)',
        `Egy állatkerti oroszlánnak naponta ${daily} kg húst adnak a gondozói.`,
        'Hány kilogramm húst eszik meg egy hét (7 nap) alatt ez az oroszlán?',
        'kg',
        daily * 7,
        `${daily} · 7 = ${daily * 7}`,
        `Egy hét 7 napból áll, tehát ${daily} · 7 = ${daily * 7} kg.`
      );
    }
    const picked = pickRandom([20, 35, 45, 53, 68, 78]);
    const left = 100 - picked;
    return makeWordProblem(
      topicId,
      'Cseresznyeszedés 100 kg-ig (II. kötet 68. o.)',
      `Petiék családja 100 kg cseresznyét szeretne szedni. Eddig már leszedtek ${picked} kg-ot.`,
      'Hány kilogramm cseresznyét kell még szedniük?',
      'kg',
      left,
      `100 - ${picked} = ${left}`,
      `Számold ki: 100 - ${picked} = ${left} kg.`
    );
  }

  if (mod === 2) {
    // Űrtartalom mérése (II. kötet 70–72. o.)
    const l = randInt(1, 5);
    const dl = randInt(1, 9);
    return {
      id: uid('cap2-ldl'),
      kind: 'unit-conversion',
      topicId,
      title: 'Az űrtartalom mérése (II. kötet 70–71. o.)',
      instruction: 'Váltsd át deciliterre! (1 liter = 10 dl)',
      category: 'űrtartalom',
      sourceText: `${l} l ${dl} dl`,
      targetUnit: 'dl',
      exactResult: l * 10 + dl,
      hint: `1 l = 10 dl, ezért ${l} l = ${l * 10} dl. Ehhez adjuk a ${dl} dl-t → ${l * 10 + dl} dl.`,
    };
  }

  // Megálló / Kitekintő (II. kötet 74–79. o.)
  const boxes = randInt(4, 8);
  const perBox = randInt(6, 9);
  const eaten = randInt(5, 12);
  const remaining = boxes * perBox - eaten;
  return makeWordProblem(
    topicId,
    'Év végi összefoglaló – Megálló (II. kötet 74–79. o.)',
    `A táborba ${boxes} doboz kekszet vittek, minden dobozban ${perBox} darab keksz volt. Uzsonnára megettek belőle ${eaten} darabot.`,
    'Hány darab keksz maradt?',
    'db',
    remaining,
    `${boxes} · ${perBox} - ${eaten} = ${remaining}`,
    `Először számold ki, hány keksz volt összesen (${boxes} · ${perBox} = ${boxes * perBox}), majd vond ki belőle a(z) ${eaten}-t!`
  );
}

// ============================================================================
// Fő generátor belépési pont (2. osztály Matematika)
// ============================================================================

export function generateMathGrade2Worksheet(
  topicId: string,
  count = 6
): Exercise[] {
  const exercises: Exercise[] = [];

  for (let i = 0; i < count; i++) {
    switch (topicId) {
      case 'matek-2-szamok-20':
        exercises.push(generateTopic1(topicId, i));
        break;
      case 'matek-2-szorzas-osztas-2-romai':
        exercises.push(generateTopic2(topicId, i));
        break;
      case 'matek-2-kitekintes-100-tizesek':
        exercises.push(generateTopic3(topicId, i));
        break;
      case 'matek-2-szamolas-30-ido':
        exercises.push(generateTopic4(topicId, i));
        break;
      case 'matek-2-szamolas-40':
        exercises.push(generateTopic5(topicId, i));
        break;
      case 'matek-2-szamolas-50':
        exercises.push(generateTopic6(topicId, i));
        break;
      case 'matek-2-geometria-szimmetria':
        exercises.push(generateTopic7(topicId, i));
        break;
      case 'matek-2-szamolas-60-ido':
        exercises.push(generateTopic8(topicId, i));
        break;
      case 'matek-2-szamolas-70-ido':
        exercises.push(generateTopic9(topicId, i));
        break;
      case 'matek-2-szamolas-80-90':
        exercises.push(generateTopic10(topicId, i));
        break;
      case 'matek-2-szamolas-100-romai':
        exercises.push(generateTopic11(topicId, i));
        break;
      case 'matek-2-meresek-ev-vegi':
      default:
        exercises.push(generateTopic12(topicId, i));
        break;
    }
  }

  return exercises;
}
