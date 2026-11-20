import {
  Exercise,
  HungarianChoiceExercise,
  PlaceValueExercise,
  WordProblemExercise,
} from '../types/curriculum';

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function uid(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}-${Date.now().toString(36)}`;
}

// ============================================================================
// Segédgenerátorok 1. osztályos szinthez (0–20)
// ============================================================================

/** Összeadás, kivonás vagy pótlás az adott 0..maxRange számkörben */
function generateAddSub1(
  topicId: string,
  minVal: number,
  maxRange: number,
  options?: { allowMissing?: boolean; title?: string }
): PlaceValueExercise {
  const allowMissing = options?.allowMissing ?? true;
  const variant = allowMissing ? randInt(1, 4) : randInt(1, 2);

  if (variant === 1) {
    const a = randInt(minVal, Math.max(minVal, maxRange - 1));
    const b = randInt(1, maxRange - a);
    return {
      id: uid('add1'),
      kind: 'place-value',
      topicId,
      title: options?.title ?? `Összeadás ${maxRange}-ig`,
      instruction: 'Számold ki az összeget!',
      expression: `${a} + ${b}`,
      exactResult: a + b,
      hint: `Indulj a(z) ${a}-tól a számegyenesen, és lépj előre ${b}-t!`,
    };
  }

  if (variant === 2) {
    const a = randInt(Math.max(2, minVal + 1), maxRange);
    const b = randInt(1, a);
    return {
      id: uid('sub1'),
      kind: 'place-value',
      topicId,
      title: options?.title ?? `Kivonás ${maxRange}-ig`,
      instruction: 'Számold ki a különbséget!',
      expression: `${a} - ${b}`,
      exactResult: a - b,
      hint: `Indulj a(z) ${a}-tól a számegyenesen, és lépj vissza ${b}-t!`,
    };
  }

  if (variant === 3) {
    const sum = randInt(Math.max(3, minVal + 1), maxRange);
    const a = randInt(1, sum - 1);
    const missing = sum - a;
    return {
      id: uid('miss-add1'),
      kind: 'place-value',
      topicId,
      title: 'Nyitott mondat – Pótlás',
      instruction: 'Melyik szám hiányzik a műveletből? Írd be a hiányzó számot!',
      expression: `${a} + ? = ${sum}`,
      exactResult: missing,
      hint: `Gondold végig: ${a}-hoz mennyit kell hozzáadni, hogy ${sum} legyen? Számold ki: ${sum} - ${a}!`,
    };
  }

  const a = randInt(Math.max(3, minVal + 1), maxRange);
  const diff = randInt(1, a - 1);
  const missing = a - diff;
  return {
    id: uid('miss-sub1'),
    kind: 'place-value',
    topicId,
    title: 'Nyitott mondat – Kivonás',
    instruction: 'Melyik szám hiányzik a kivonásból?',
    expression: `${a} - ? = ${diff}`,
    exactResult: missing,
    hint: `${a}-ból mennyit vettünk el, ha ${diff} maradt? Számold ki: ${a} - ${diff}!`,
  };
}

/** Tízesátlépéses összeadás vagy kivonás 11–20 között */
function generateCrossTen1(
  topicId: string,
  targetMin: number,
  targetMax: number
): PlaceValueExercise {
  const isAdd = randInt(0, 1) === 0;
  if (isAdd) {
    const sum = randInt(targetMin, targetMax);
    const a = randInt(Math.max(2, sum - 9), 9);
    const b = sum - a;
    const toTen = 10 - a;
    const rest = b - toTen;
    return {
      id: uid('cross-add1'),
      kind: 'place-value',
      topicId,
      title: `Összeadás tízesátlépéssel (${targetMax}-ig)`,
      instruction: 'Számold ki az összeget tízesátlépéssel!',
      expression: `${a} + ${b}`,
      exactResult: sum,
      hint: `Pótold először a(z) ${a}-t 10-re (${a} + ${toTen} = 10), majd a 10-hez add hozzá a maradék ${rest}-t!`,
    };
  }

  const a = randInt(targetMin, targetMax);
  const ones = a - 10;
  const b = randInt(ones + 1, 9);
  const exactResult = a - b;
  const restAfterTen = b - ones;
  return {
    id: uid('cross-sub1'),
    kind: 'place-value',
    topicId,
    title: `Kivonás tízesátlépéssel (${targetMax}-ig)`,
    instruction: 'Számold ki a különbséget két lépésben!',
    expression: `${a} - ${b}`,
    exactResult,
    hint: `Először vegyél el ${ones}-t, hogy 10 maradjon (${a} - ${ones} = 10), majd a 10-ből vegyél el még ${restAfterTen}-t!`,
  };
}

function makeWordProblem(
  topicId: string,
  title: string,
  story: string,
  question: string,
  unit: string,
  exactResult: number,
  solutionSteps: string,
  hint: string
): WordProblemExercise {
  return {
    id: uid('wp1'),
    kind: 'word-problem',
    topicId,
    title,
    instruction: 'Olvasd el a feladatot, és írd be a választ!',
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
  // 1. fejezet: Válogatások, Összehasonlítások & Tájékozódás (I. kötet 3–21. o.)
  const mod = idx % 2;
  if (mod === 0) {
    const questions: Array<{
      prompt: string;
      options: string[];
      correct: string;
      explanation: string;
      hint: string;
    }> = [
      {
        prompt: 'Melyik sorban van TÖBB gyümölcs: 5 alma vagy 3 körte?',
        options: ['Az 5 alma több', 'A 3 körte több', 'Ugyanannyi van', 'Nem lehet tudni'],
        correct: 'Az 5 alma több',
        explanation: 'Az 5 nagyobb szám, mint a 3, ezért 5 alma több.',
        hint: 'Hasonlítsd össze az 5-öt és a 3-at a számegyenesen: melyik a nagyobb szám?',
      },
      {
        prompt: 'Melyik a KAKUKKTOJÁS a sorban: kutya, macska, villamos, nyuszi?',
        options: ['villamos', 'kutya', 'macska', 'nyuszi'],
        correct: 'villamos',
        explanation: 'A kutya, a macska és a nyuszi élő állatok, a villamos viszont jármű!',
        hint: 'Nézd meg, melyik három tartozik az élő állatok közé, és melyik a jármű!',
      },
      {
        prompt: 'A polcon a mackó FÖLÖTT van a labda, a mackó ALATT pedig a kisautó. Mi van legfelül?',
        options: ['A labda', 'A mackó', 'A kisautó', 'Mind egy magasságban van'],
        correct: 'A labda',
        explanation: 'Mivel a labda van a mackó fölött, a labda van legfelül.',
        hint: 'Képzeld el a polcot: a mackó középen van. Mi került a mackó fölé?',
      },
      {
        prompt: 'Melyikből van KEVESEBB: 4 piros korongból vagy 6 kék korongból?',
        options: ['A 4 piros korong kevesebb', 'A 6 kék korong kevesebb', 'Ugyanannyi van', 'Mindkettő 10'],
        correct: 'A 4 piros korong kevesebb',
        explanation: 'A 4 kisebb szám, mint a 6, így 4 korong kevesebb.',
        hint: 'Hasonlítsd össze a 4-et és a 6-ot: melyik a kisebb szám?',
      },
    ];
    const q = questions[Math.floor(idx / 2) % questions.length];
    const ex: HungarianChoiceExercise = {
      id: uid('intro1-choice'),
      kind: 'hu-choice',
      topicId,
      title: 'Válogatások, összehasonlítások és tájékozódás (I. kötet 4–21. o.)',
      instruction: 'Válaszd ki a helyes választ!',
      promptText: q.prompt,
      options: q.options,
      correctOption: q.correct,
      explanation: q.explanation,
      hint: q.hint,
    };
    return ex;
  }

  const left = randInt(2, 5);
  const right = randInt(1, 4);
  return makeWordProblem(
    topicId,
    'Több, kevesebb, ugyanannyi (I. kötet 16–21. o.)',
    `Az asztalon ${left} piros kocka és ${right} kék kocka van.`,
    'Hány kocka van összesen az asztalon?',
    'db',
    left + right,
    `${left} + ${right} = ${left + right}`,
    `Add össze a piros és a kék kockák számát: ${left} + ${right}!`
  );
}

function generateTopic2(topicId: string, idx: number): Exercise {
  // 2. fejezet: Számok és számolás 0-tól 5-ig (I. kötet 22–37. o.)
  const mod = idx % 3;
  if (mod === 0) {
    return generateAddSub1(topicId, 1, 5, {
      allowMissing: false,
      title: 'Számolás 0-tól 5-ig',
    });
  }
  if (mod === 1) {
    return generateAddSub1(topicId, 1, 5, {
      allowMissing: true,
      title: 'Bontások és pótlások 5-ig',
    });
  }
  const a = randInt(2, 3);
  const b = randInt(1, 5 - a);
  return makeWordProblem(
    topicId,
    'Számolás 0-tól 5-ig – Szöveges feladat',
    `Peti tányérján ${a} szem eper volt. Anyukája még ${b} szem epret tett mellé.`,
    'Hány szem eper lett Peti tányérján?',
    'db',
    a + b,
    `${a} + ${b} = ${a + b}`,
    `Add össze a tányéron lévő és a mellé tett eperszemeket: ${a} + ${b}!`
  );
}

function generateTopic3(topicId: string, idx: number): Exercise {
  // 3. fejezet: Számolás 6-ig és 7-ig, Páros-páratlan & Számszomszédok (I. kötet 38–49. o.)
  const mod = idx % 3;
  if (mod === 0) {
    return generateAddSub1(topicId, 1, 7, { title: 'Számolás 0-tól 7-ig' });
  }
  if (mod === 1) {
    const num = randInt(1, 7);
    const isEven = num % 2 === 0;
    const ex: HungarianChoiceExercise = {
      id: uid('even1'),
      kind: 'hu-choice',
      topicId,
      title: 'Páros és páratlan számok (I. kötet 43. o.)',
      instruction: 'Döntsd el a számról, hogy páros vagy páratlan!',
      promptText: `Milyen szám a(z) ${num}?`,
      options: ['Páros', 'Páratlan'],
      correctOption: isEven ? 'Páros' : 'Páratlan',
      explanation: isEven
        ? `A(z) ${num} párba állítható maradék nélkül, ezért páros.`
        : `A(z) ${num} párba állításakor 1 kimarad, ezért páratlan.`,
      hint: 'Állítsd kettesével párba a korongokat! Ha nem marad ki egy sem, akkor páros.',
    };
    return ex;
  }
  const center = randInt(1, 6);
  const askLarger = randInt(0, 1) === 0;
  return makeWordProblem(
    topicId,
    'Egyes számszomszédok (I. kötet 49. o.)',
    `A számegyenesen a(z) ${center} számot nézzük.`,
    askLarger
      ? `Melyik a(z) ${center} NAGYOBB egyes szomszédja?`
      : `Melyik a(z) ${center} KISEBB egyes szomszédja?`,
    '',
    askLarger ? center + 1 : center - 1,
    askLarger ? `${center} + 1 = ${center + 1}` : `${center} - 1 = ${center - 1}`,
    askLarger
      ? `A nagyobb egyes szomszéd 1-gyel több a számnál (${center} + 1).`
      : `A kisebb egyes szomszéd 1-gyel kevesebb a számnál (${center} - 1).`
  );
}

function generateTopic4(topicId: string, idx: number): Exercise {
  // 4. fejezet: Számolás 8-ig és 9-ig, Nyitott mondatok & Sorszámnevek (I. kötet 50–61. o.)
  const mod = idx % 3;
  if (mod === 0) {
    return generateAddSub1(topicId, 2, 9, {
      allowMissing: false,
      title: 'Számolás 0-tól 9-ig',
    });
  }
  if (mod === 1) {
    return generateAddSub1(topicId, 2, 9, {
      allowMissing: true,
      title: 'Nyitott mondatok 9-ig (I. kötet 55. o.)',
    });
  }
  // Sorszámnevek (I. kötet 61. o.)
  const pos = randInt(2, 8);
  const total = 9;
  const ex: HungarianChoiceExercise = {
    id: uid('ord1'),
    kind: 'hu-choice',
    topicId,
    title: 'Sorszámnevek (I. kötet 61. o.)',
    instruction: 'Válaszd ki a helyes választ!',
    promptText: `A futóversenyen ${total} gyerek indult. Kata közvetlenül a ${pos}. helyezett UTÁN ért célba. Hányadik lett Kata?`,
    options: [`${pos - 1}.`, `${pos}.`, `${pos + 1}.`, `${pos + 2}.`],
    correctOption: `${pos + 1}.`,
    explanation: `A ${pos}. után közvetlenül a ${pos + 1}. következik.`,
    hint: `Számolj tovább eggyel a(z) ${pos}. helytől!`,
  };
  return ex;
}

function generateTopic5(topicId: string, idx: number): Exercise {
  // 5. fejezet: A tíz, Számolás 0-tól 10-ig & Szöveges feladatok (I. kötet 62–67. o.)
  const mod = idx % 3;
  if (mod === 0) {
    // A 10 bontása: a + ? = 10
    const a = randInt(1, 9);
    return {
      id: uid('ten-split1'),
      kind: 'place-value',
      topicId,
      title: 'A tíz bontása',
      instruction: 'Pótold a hiányzó számot, hogy az összeg 10 legyen!',
      expression: `${a} + ? = 10`,
      exactResult: 10 - a,
      hint: `Mennyi hiányzik ${a}-hoz, hogy 10 legyen? Számold ki: 10 - ${a}!`,
    };
  }
  if (mod === 1) {
    return generateAddSub1(topicId, 2, 10, { title: 'Számolás 0-tól 10-ig' });
  }
  const have = randInt(3, 6);
  const bought = randInt(2, 10 - have);
  return makeWordProblem(
    topicId,
    'Szöveges feladat 10-ig (I. kötet 66. o.)',
    `Lilinek ${have} színes ceruzája volt. A boltban kapott még ${bought} újat.`,
    'Hány színes ceruzája lett Lilinek összesen?',
    'db',
    have + bought,
    `${have} + ${bought} = ${have + bought}`,
    `Add össze a meglévő és az újonnan kapott ceruzákat: ${have} + ${bought}!`
  );
}

function generateTopic6(topicId: string, idx: number): Exercise {
  // 6. fejezet: Megálló – Félévi ismétlés 0-tól 10-ig (I. kötet 68–79. o.)
  const mod = idx % 3;
  if (mod === 0) {
    // Három szám összeadása 10-re (I. kötet 70. o.)
    const a = randInt(1, 4);
    const b = randInt(1, 4);
    const c = 10 - a - b;
    return {
      id: uid('three-sum1'),
      kind: 'place-value',
      topicId,
      title: 'Három szám összege 10 (I. kötet 70. o.)',
      instruction: 'Melyik szám hiányzik az almáról, hogy a három szám összege 10 legyen?',
      expression: `${a} + ${b} + ? = 10`,
      exactResult: c,
      hint: `Először add össze az első két számot (${a} + ${b} = ${a + b}), majd gondold végig, mennyi hiányzik még ${a + b}-hoz, hogy 10 legyen!`,
    };
  }
  if (mod === 1) {
    return generateAddSub1(topicId, 2, 10, { title: 'Megálló – Vegyes számolás 10-ig' });
  }
  const total = randInt(7, 10);
  const eaten = randInt(2, 5);
  return makeWordProblem(
    topicId,
    'Megálló – Szöveges feladat (I. kötet 68–79. o.)',
    `A tálban ${total} szem dió volt. A mókus megevett belőle ${eaten} szemet.`,
    'Hány szem dió maradt a tálban?',
    'db',
    total - eaten,
    `${total} - ${eaten} = ${total - eaten}`,
    `Vond ki az összes dióból a megevett diók számát: ${total} - ${eaten}!`
  );
}

function generateTopic7(topicId: string, idx: number): Exercise {
  // 7. fejezet: Vonalak, síkidomok, testek & Mérések (II. kötet 3–15. o.)
  const mod = idx % 4;
  if (mod === 0) {
    const questions: Array<{
      prompt: string;
      options: string[];
      correct: string;
      explanation: string;
      hint: string;
    }> = [
      {
        prompt: 'Melyik alakzatot építhetjük meg 4 egyforma hosszúságú pálcikából?',
        options: ['Négyzet', 'Háromszög', 'Kör', 'Gömb'],
        correct: 'Négyzet',
        explanation: 'A négyzetnek 4 egyenlő oldala van, a háromszögnek csak 3.',
        hint: 'Gondold végig, melyik síkidomnak van pontosan 4 egyforma oldala!',
      },
      {
        prompt: 'Melyik tárgy hasonlít leginkább egy GÖMBRE?',
        options: ['Focilabda', 'Dobókocka', 'Ceruza', 'Könyv'],
        correct: 'Focilabda',
        explanation: 'A focilabda gömb alakú, a dobókocka kocka, a könyv pedig téglatest.',
        hint: 'Gondolj arra, melyik tárgy kerek minden irányból és gurul!',
      },
    ];
    const q = questions[Math.floor(idx / 4) % questions.length];
    const ex: HungarianChoiceExercise = {
      id: uid('geo1-choice'),
      kind: 'hu-choice',
      topicId,
      title: 'Vonalak, síkidomok, testek (II. kötet 4–9. o.)',
      instruction: 'Válaszd ki a helyes választ!',
      promptText: q.prompt,
      options: q.options,
      correctOption: q.correct,
      explanation: q.explanation,
      hint: q.hint,
    };
    return ex;
  }

  if (mod === 1) {
    // Hosszúság (dm): Anyuka szalagja (II. kötet 11. o.)
    const red = randInt(2, 5);
    const yellow = randInt(2, 10 - red);
    return makeWordProblem(
      topicId,
      'A hosszúság mérése (II. kötet 11. o.)',
      `Anyuka ${red} dm piros és ${yellow} dm sárga szalagot vásárolt.`,
      'Hány deciméter szalagot vásárolt összesen?',
      'dm',
      red + yellow,
      `${red} + ${yellow} = ${red + yellow}`,
      `Add össze a két szalag hosszát: ${red} + ${yellow}!`
    );
  }

  if (mod === 2) {
    // Tömeg (kg): Petra édesapja (II. kötet 13. o.)
    const bread = 1;
    const flour = randInt(2, 3);
    const potato = randInt(2, 4);
    const total = bread + flour + potato;
    return makeWordProblem(
      topicId,
      'A tömeg mérése (II. kötet 13. o.)',
      `Petra édesapja a boltban ${bread} kg kenyeret, ${flour} kg lisztet és ${potato} kg burgonyát vett.`,
      'Hány kilogramm élelmiszert vásárolt összesen?',
      'kg',
      total,
      `${bread} + ${flour} + ${potato} = ${total}`,
      `Add össze a háromféle élelmiszer tömegét: ${bread} + ${flour} + ${potato}!`
    );
  }

  // Űrtartalom (dl): Peti anyukája bodzaszörp (II. kötet 14. o.)
  const poured = randInt(4, 8);
  const needed = 10 - poured;
  return makeWordProblem(
    topicId,
    'Az űrtartalom mérése (II. kötet 14. o.)',
    `Peti anyukája ${poured} dl bodzaszörpöt öntött egy 1 literes (10 dl-es) üvegbe.`,
    'Hány decilitert kell még beleöntenie, hogy az 1 literes üveg megteljen?',
    'dl',
    needed,
    `10 - ${poured} = ${needed}`,
    `1 liter = 10 dl. Vond ki 10-ből a már beleöntött ${poured} decilitert!`
  );
}

function generateTopic8(topicId: string, idx: number): Exercise {
  // 8. fejezet: Számok 20-ig, Számolás 11–12-ig & Időmérés (II. kötet 16–33. o.)
  const mod = idx % 3;
  if (mod === 0) {
    return generateAddSub1(topicId, 3, 12, { title: 'Számolás 0-tól 12-ig' });
  }
  if (mod === 1) {
    // Tízesek és egyesek 20-ig
    const e = randInt(1, 9);
    return {
      id: uid('pv1-20'),
      kind: 'place-value',
      topicId,
      title: 'Számok 0-tól 20-ig (Tízesek és egyesek)',
      instruction: 'Melyik szám áll 1 tízesből és a megadott egyesekből?',
      expression: `1 t + ${e} e`,
      exactResult: 10 + e,
      hint: `1 tízes az 10. Adj hozzá a 10-hez ${e} egyest!`,
    };
  }
  // Időmérés: egész órák (II. kötet 32. o.)
  const start = randInt(8, 10);
  const plus = randInt(1, 2);
  return makeWordProblem(
    topicId,
    'Az idő mérése (II. kötet 32. o.)',
    `A mese délelőtt ${start} órakor kezdődött és ${plus} órán át tartott.`,
    'Hány órakor ért véget a mese?',
    'óra',
    start + plus,
    `${start} + ${plus} = ${start + plus}`,
    `Add hozzá a kezdési időponthoz (${start} óra) a mese időtartamát (${plus} óra)!`
  );
}

function generateTopic9(topicId: string, idx: number): Exercise {
  // 9. fejezet: Számolás 13-ig és 14-ig (Tízesátlépés) (II. kötet 34–45. o.)
  const mod = idx % 3;
  if (mod === 0) {
    return generateCrossTen1(topicId, 11, 14);
  }
  if (mod === 1) {
    return generateAddSub1(topicId, 4, 14, { title: 'Számolás 0-tól 14-ig' });
  }
  const a = randInt(7, 9);
  const b = randInt(4, 14 - a);
  return makeWordProblem(
    topicId,
    'Szöveges feladat 14-ig',
    `A réten ${a} sárga és ${b} fehér pillangó repdesett.`,
    'Hány pillangó repdesett összesen a réten?',
    'db',
    a + b,
    `${a} + ${b} = ${a + b}`,
    `Pótold először a(z) ${a}-t 10-re, majd add hozzá a maradékot (${a} + ${b})!`
  );
}

function generateTopic10(topicId: string, idx: number): Exercise {
  // 10. fejezet: Számolás 15-ig és 16-ig (II. kötet 46–55. o.)
  const mod = idx % 3;
  if (mod === 0) {
    return generateCrossTen1(topicId, 12, 16);
  }
  if (mod === 1) {
    return generateAddSub1(topicId, 5, 16, { title: 'Számolás 0-tól 16-ig' });
  }
  const total = randInt(14, 16);
  const taken = randInt(5, 8);
  return makeWordProblem(
    topicId,
    'Szöveges feladat 16-ig',
    `A kosárban ${total} szem szilva volt. Dávid megevett belőle ${taken} szemet.`,
    'Hány szem szilva maradt a kosárban?',
    'db',
    total - taken,
    `${total} - ${taken} = ${total - taken}`,
    `Vond ki a kosárban lévő ${total} szilvából a megevett ${taken} szemet (${total} - ${taken})!`
  );
}

function generateTopic11(topicId: string, idx: number): Exercise {
  // 11. fejezet: Számolás 17-ig, 18-ig és 19-ig (II. kötet 56–67. o.)
  const mod = idx % 3;
  if (mod === 0) {
    return generateCrossTen1(topicId, 13, 19);
  }
  if (mod === 1) {
    return generateAddSub1(topicId, 6, 19, { title: 'Számolás 0-tól 19-ig' });
  }
  const a = randInt(8, 9);
  const b = randInt(6, 9);
  return makeWordProblem(
    topicId,
    'Szöveges feladat 19-ig',
    `Az egyik dobozban ${a} kisautó, a másikban ${b} kisautó van.`,
    'Hány kisautó van a két dobozban együtt?',
    'db',
    a + b,
    `${a} + ${b} = ${a + b}`,
    `Add össze a két dobozban lévő kisautók számát tízesátlépéssel (${a} + ${b})!`
  );
}

function generateTopic12(topicId: string, idx: number): Exercise {
  // 12. fejezet: A húsz, Számolás 20-ig & Év végi ismétlés (II. kötet 68–79. o.)
  const mod = idx % 4;
  if (mod === 0) {
    return generateCrossTen1(topicId, 12, 20);
  }
  if (mod === 1) {
    return generateAddSub1(topicId, 5, 20, { title: 'Év végi ismétlés 0-tól 20-ig' });
  }
  if (mod === 2) {
    const ex: HungarianChoiceExercise = {
      id: uid('mirror1'),
      kind: 'hu-choice',
      topicId,
      title: 'Játék a tükörrel (II. kötet 78–79. o.)',
      instruction: 'Válaszd ki a helyes választ!',
      promptText: 'Ha egy papírszívet a közepén lévő tükörtengely mentén félbehajtunk, mit látunk?',
      options: [
        'A két fele pontosan fedi egymást.',
        'Az egyik fele sokkal nagyobb lesz.',
        'A két fele nem ér össze.',
        'Egy kört kapunk.',
      ],
      correctOption: 'A két fele pontosan fedi egymást.',
      explanation: 'A szív szimmetrikus alakzat, így a tükörtengelynél félbehajtva a két oldala pontosan fedi egymást.',
      hint: 'Gondolj arra, amikor félbehajtott papírból kivágsz egy szívecskét!',
    };
    return ex;
  }
  const total = 20;
  const given = randInt(6, 12);
  return makeWordProblem(
    topicId,
    'Év végi összefoglaló – A húsz',
    `Marcinak ${total} üveggolyója volt. Ebből ${given} üveggolyót kölcsönadott a barátjának.`,
    'Hány üveggolyója maradt Marcinak?',
    'db',
    total - given,
    `${total} - ${given} = ${total - given}`,
    `Vond ki a ${total} üveggolyóból a kölcsönadott ${given} darabot (${total} - ${given})!`
  );
}

// ============================================================================
// Fő generátor belépési pont (1. osztály Matematika)
// ============================================================================

export function generateMathGrade1Worksheet(
  topicId: string,
  count = 6
): Exercise[] {
  const exercises: Exercise[] = [];

  for (let i = 0; i < count; i++) {
    switch (topicId) {
      case 'matek-1-bevezeto-relaciok':
        exercises.push(generateTopic1(topicId, i));
        break;
      case 'matek-1-szamok-0-5':
        exercises.push(generateTopic2(topicId, i));
        break;
      case 'matek-1-szamok-6-7':
        exercises.push(generateTopic3(topicId, i));
        break;
      case 'matek-1-szamok-8-9':
        exercises.push(generateTopic4(topicId, i));
        break;
      case 'matek-1-szamok-10':
        exercises.push(generateTopic5(topicId, i));
        break;
      case 'matek-1-megallo-ismetles':
        exercises.push(generateTopic6(topicId, i));
        break;
      case 'matek-1-geometria-meresek':
        exercises.push(generateTopic7(topicId, i));
        break;
      case 'matek-1-szamok-11-12-ido':
        exercises.push(generateTopic8(topicId, i));
        break;
      case 'matek-1-szamok-13-14':
        exercises.push(generateTopic9(topicId, i));
        break;
      case 'matek-1-szamok-15-16':
        exercises.push(generateTopic10(topicId, i));
        break;
      case 'matek-1-szamok-17-19':
        exercises.push(generateTopic11(topicId, i));
        break;
      case 'matek-1-szamok-20-ev-vegi':
      default:
        exercises.push(generateTopic12(topicId, i));
        break;
    }
  }

  return exercises;
}
