import {
  Exercise,
  FractionsExercise,
  NegativeNumbersExercise,
  PlaceValueExercise,
  RomanNumeralsExercise,
  RoundingNeighborsExercise,
  UnitConversionExercise,
  WordProblemExercise,
  WrittenArithmeticExercise,
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
// 1. Maradékos osztás a 100-as számkörben (I. kötet 18–21. o.)
// ============================================================================
function generateRemainderDivision100(topicId: string): WrittenDivisionExercise {
  const divisor = randInt(3, 9);
  const quotient = randInt(3, 9);
  const remainder = randInt(1, divisor - 1);
  const dividend = quotient * divisor + remainder;

  return {
    id: uid('div3-100'),
    kind: 'written-division',
    topicId,
    title: 'Maradékos osztás a 100-as számkörben',
    instruction: 'Végezd el a maradékos osztást! Ügyelj arra, hogy a maradék mindig kisebb legyen az osztónál!',
    dividend,
    divisor,
    quotient,
    remainder,
    hasRemainder: true,
    hint: `Keresd meg a(z) ${dividend}-nél kisebb legnagyobb számot, amely osztható ${divisor}-val: ${quotient} · ${divisor} = ${quotient * divisor}, és marad a(z) ${dividend} - ${quotient * divisor} = ${remainder}.`,
  };
}

// ============================================================================
// 2. Műveletek sorrendje (100-ig, 200-ig, 500-ig, 1000-ig)
// ============================================================================
function generateOrderOfOperations3(
  topicId: string,
  maxRange: 100 | 200 | 500 | 1000
): PlaceValueExercise {
  if (maxRange === 100) {
    const variant = randInt(1, 3);
    if (variant === 1) {
      const a = randInt(4, 9);
      const b = randInt(4, 9);
      const c = randInt(12, 35);
      const exactResult = a * b + c;
      return {
        id: uid('ord3-100'),
        kind: 'place-value',
        topicId,
        title: 'A műveletek sorrendje',
        instruction: 'Számítsd ki a kifejezés értékét! Ne feledd: a szorzást előbb végezzük el, mint az összeadást!',
        expression: `${a} · ${b} + ${c}`,
        exactResult,
        hint: `Először szorzunk: ${a} · ${b} = ${a * b}, majd hozzáadjuk a(z) ${c}-t: ${a * b} + ${c} = ${exactResult}.`,
      };
    }
    if (variant === 2) {
      const divisor = randInt(4, 9);
      const q = randInt(5, 9);
      const prod = divisor * q;
      const part1 = randInt(15, prod - 10);
      const part2 = prod - part1;
      return {
        id: uid('ord3-100-paren'),
        kind: 'place-value',
        topicId,
        title: 'A zárójel használata',
        instruction: 'Számítsd ki a zárójeles kifejezés értékét! Először a zárójelben lévő műveletet végezd el!',
        expression: `(${part1} + ${part2}) : ${divisor}`,
        exactResult: q,
        hint: `A zárójelben: ${part1} + ${part2} = ${prod}. Utána osztunk: ${prod} : ${divisor} = ${q}.`,
      };
    }
    const a = randInt(65, 95);
    const m1 = randInt(4, 8);
    const m2 = randInt(5, 8);
    const exactResult = a - m1 * m2;
    return {
      id: uid('ord3-100-sub'),
      kind: 'place-value',
      topicId,
      title: 'A műveletek sorrendje',
      instruction: 'Számítsd ki az eredményt! Ügyelj a műveletek helyes sorrendjére!',
      expression: `${a} - ${m1} · ${m2}`,
      exactResult,
      hint: `Először a szorzást végezzük el: ${m1} · ${m2} = ${m1 * m2}, majd kivonjuk: ${a} - ${m1 * m2} = ${exactResult}.`,
    };
  }

  if (maxRange === 200) {
    const variant = randInt(1, 3);
    if (variant === 1) {
      const d = randInt(2, 6);
      const q = randInt(2, Math.floor(20 / d));
      const tens = q * 10;
      const dividend = d * tens;
      return {
        id: uid('mental3-200'),
        kind: 'place-value',
        topicId,
        title: 'Szóbeli osztás a 200-as számkörben',
        instruction: 'Számítsd ki a hányadost a munkafüzet 47. oldalának mintájára!',
        expression: `${dividend} : ${d}`,
        exactResult: tens,
        hint: `${dividend / 10} tízes : ${d} = ${q} tízes, vagyis ${tens}.`,
      };
    }
    if (variant === 2) {
      const divisorTens = randInt(2, 8) * 10;
      const q = randInt(2, Math.floor(200 / divisorTens));
      const dividend = divisorTens * q;
      return {
        id: uid('mental3-200-tens'),
        kind: 'place-value',
        topicId,
        title: 'Osztás kerek tízesekkel (200-ig)',
        instruction: 'Hányszor van meg a kerek tízes az osztandóban? Számítsd ki!',
        expression: `${dividend} : ${divisorTens}`,
        exactResult: q,
        hint: `${dividend} : ${divisorTens} ugyanannyi, mint ${dividend / 10} : ${divisorTens / 10} = ${q}.`,
      };
    }
    const a = randInt(2, 6) * 10;
    const b = randInt(2, Math.floor(190 / a));
    const add = randInt(12, 200 - a * b);
    const exactResult = a * b + add;
    return {
      id: uid('mental3-200-mix'),
      kind: 'place-value',
      topicId,
      title: 'Szóbeli műveletek 200-ig',
      instruction: 'Végezd el a műveleteket a helyes sorrendben!',
      expression: `${a} · ${b} + ${add}`,
      exactResult,
      hint: `Először szorzunk: ${a} · ${b} = ${a * b}, majd összeadunk: ${a * b} + ${add} = ${exactResult}.`,
    };
  }

  if (maxRange === 500) {
    const variant = randInt(1, 3);
    if (variant === 1) {
      const divisorTens = randInt(3, 9) * 10;
      const q = randInt(3, Math.floor(490 / divisorTens));
      const dividend = divisorTens * q;
      return {
        id: uid('mental3-500-div'),
        kind: 'place-value',
        topicId,
        title: 'Osztás kerek tízesekkel 500-ig',
        instruction: 'Számítsd ki a hányadost! (I. kötet 75. oldal alapján)',
        expression: `${dividend} : ${divisorTens}`,
        exactResult: q,
        hint: `${dividend} : ${divisorTens} = ${dividend / 10} : ${divisorTens / 10} = ${q}.`,
      };
    }
    if (variant === 2) {
      const d = randInt(3, 8);
      const qTens = randInt(4, Math.floor(49 / d)) * 10;
      const dividend = d * qTens;
      return {
        id: uid('mental3-500-div1'),
        kind: 'place-value',
        topicId,
        title: 'Kerek tízesek osztása egyjegyű számmal',
        instruction: 'Számítsd ki a hányadost!',
        expression: `${dividend} : ${d}`,
        exactResult: qTens,
        hint: `${dividend / 10} : ${d} = ${qTens / 10}, tehát ${dividend} : ${d} = ${qTens}.`,
      };
    }
    const start = randInt(350, 495);
    const f1 = randInt(3, 7);
    const f2 = randInt(3, 6) * 10;
    const exactResult = start - f1 * f2;
    return {
      id: uid('mental3-500-ord'),
      kind: 'place-value',
      topicId,
      title: 'Műveletek sorrendje az 500-as számkörben',
      instruction: 'Számítsd ki az eredményt! Ügyelj a műveletek sorrendjére!',
      expression: `${start} - ${f1} · ${f2}`,
      exactResult,
      hint: `Először szorzunk: ${f1} · ${f2} = ${f1 * f2}, majd kivonunk: ${start} - ${f1 * f2} = ${exactResult}.`,
    };
  }

  // maxRange === 1000 (II. kötet 65. o.: 800 - 3 · 90, 940 - 5 · 80)
  const start = randInt(60, 95) * 10;
  const f1 = randInt(3, 7);
  const f2 = randInt(4, 8) * 10;
  const exactResult = start - f1 * f2;
  return {
    id: uid('mental3-1000-ord'),
    kind: 'place-value',
    topicId,
    title: 'Műveletek sorrendje az 1000-es számkörben',
    instruction: 'Számítsd ki a kifejezés értékét! (II. kötet 65. o. alapján)',
    expression: `${start} - ${f1} · ${f2}`,
    exactResult,
    hint: `Először a szorzást végezzük el: ${f1} · ${f2} = ${f1 * f2}, majd kivonjuk: ${start} - ${f1 * f2} = ${exactResult}.`,
  };
}

// ============================================================================
// 3. Helyiérték-bontás 200-ig, 500-ig, 1000-ig
// ============================================================================
function generatePlaceValue3(
  topicId: string,
  maxRange: 200 | 500 | 1000
): PlaceValueExercise {
  const maxSz = maxRange === 200 ? 1 : maxRange === 500 ? 4 : 8;
  const sz = randInt(1, maxSz);
  const t = randInt(2, 14);
  const e = randInt(1, 9);
  const exactResult = sz * 100 + t * 10 + e;

  return {
    id: uid('pv3'),
    kind: 'place-value',
    topicId,
    title: 'Helyiérték-bontás (sz, t, e)',
    instruction: 'Melyik számot írtuk fel a helyi értékek összegével? Ügyelj a tízesátlépésre!',
    expression: `${sz} sz + ${t} t + ${e} e`,
    exactResult,
    hint: `${sz} sz = ${sz * 100}, ${t} t = ${t * 10}, ${e} e = ${e}. Összeadva: ${sz * 100} + ${t * 10} + ${e} = ${exactResult}.`,
  };
}

// ============================================================================
// 4. Számszomszédok és kerekítés (200-ig, 500-ig, 1000-ig)
// ============================================================================
function generateRoundingNeighbors3(
  topicId: string,
  maxRange: 200 | 500 | 1000
): RoundingNeighborsExercise {
  const neighborType = pickRandom<'tízes' | 'százas'>(['tízes', 'százas']);
  const step = neighborType === 'tízes' ? 10 : 100;

  let num = randInt(105, maxRange - 15);
  if (num % step === 0) num += randInt(1, step - 1);

  const smallerNeighbor = Math.floor(num / step) * step;
  const largerNeighbor = smallerNeighbor + step;
  const rem = num % step;
  const rounded = rem >= step / 2 ? largerNeighbor : smallerNeighbor;

  return {
    id: uid('round3'),
    kind: 'rounding-neighbors',
    topicId,
    title: `Számszomszédok és kerekítés (${neighborType}re)`,
    instruction: `Írd be a szám kisebb és nagyobb ${neighborType} számszomszédját, majd kerekítsd ${neighborType}re!`,
    item: {
      number: num,
      smallerNeighbor,
      largerNeighbor,
      rounded,
      neighborType,
    },
    hint: `A(z) ${num} a(z) ${smallerNeighbor} és ${largerNeighbor} között van. Mivel a maradék ${rem}, kerekítve: ${rounded}.`,
  };
}

// ============================================================================
// 5. Írásbeli összeadás, kivonás és szorzás egyjegyűvel (3. osztály)
// ============================================================================
function generateWrittenAddition3(
  topicId: string,
  maxSum: 500 | 1000 = 500
): WrittenArithmeticExercise {
  const roundTo = pickRandom<10 | 100>([10, 100]);
  const operandA = randInt(118, maxSum === 500 ? 285 : 560);
  const operandB = randInt(114, maxSum - operandA - 15);
  const exactResult = operandA + operandB;
  const estimatedA = Math.round(operandA / roundTo) * roundTo;
  const estimatedB = Math.round(operandB / roundTo) * roundTo;
  const estimatedResult = estimatedA + estimatedB;

  return {
    id: uid('wadd3'),
    kind: 'written-arithmetic',
    topicId,
    title: 'Írásbeli összeadás becsléssel',
    instruction: `Becsüld meg ${roundTo === 100 ? 'százasra' : 'tízesre'} kerekített értékekkel az összeget, majd számítsd ki pontosan!`,
    operation: '+',
    operandA,
    operandB,
    roundTo,
    estimatedA,
    estimatedB,
    estimatedResult,
    exactResult,
    hint: `${roundTo === 100 ? 'Százasra' : 'Tízesre'} kerekítve: ${operandA} ≈ ${estimatedA}, ${operandB} ≈ ${estimatedB}. Becslés: ${estimatedA} + ${estimatedB} = ${estimatedResult}.`,
  };
}

function generateWrittenSubtraction3(topicId: string): WrittenArithmeticExercise {
  const roundTo = pickRandom<10 | 100>([10, 100]);
  const operandA = randInt(325, 965);
  const operandB = randInt(118, operandA - 85);
  const exactResult = operandA - operandB;
  const estimatedA = Math.round(operandA / roundTo) * roundTo;
  const estimatedB = Math.round(operandB / roundTo) * roundTo;
  const estimatedResult = estimatedA - estimatedB;

  return {
    id: uid('wsub3'),
    kind: 'written-arithmetic',
    topicId,
    title: 'Írásbeli kivonás becsléssel',
    instruction: `Becsüld meg ${roundTo === 100 ? 'százasra' : 'tízesre'} kerekített értékekkel a különbséget, majd végezd el az írásbeli kivonást!`,
    operation: '-',
    operandA,
    operandB,
    roundTo,
    estimatedA,
    estimatedB,
    estimatedResult,
    exactResult,
    hint: `${roundTo === 100 ? 'Százasra' : 'Tízesre'} kerekítve: ${operandA} ≈ ${estimatedA}, ${operandB} ≈ ${estimatedB}. Becslés: ${estimatedA} - ${estimatedB} = ${estimatedResult}. Ellenőrzés: ${exactResult} + ${operandB} = ${operandA}.`,
  };
}

function generateWrittenMultiplication3(topicId: string): WrittenArithmeticExercise {
  const operandB = randInt(2, 7);
  const maxA = Math.floor(980 / operandB);
  const operandA = randInt(64, maxA);
  const exactResult = operandA * operandB;
  const roundTo: 10 = 10;
  const estimatedA = Math.round(operandA / 10) * 10;
  const estimatedB = operandB;
  const estimatedResult = estimatedA * estimatedB;

  return {
    id: uid('wmul3'),
    kind: 'written-arithmetic',
    topicId,
    title: 'Írásbeli szorzás egyjegyű szorzóval',
    instruction: 'Becsüld meg a szorzatot a szorzandó tízesre kerekített értékével, majd végezd el az írásbeli szorzást!',
    operation: '·',
    operandA,
    operandB,
    roundTo,
    estimatedA,
    estimatedB,
    estimatedResult,
    exactResult,
    hint: `Tízesre kerekítve: ${operandA} ≈ ${estimatedA}. Becslés: ${estimatedA} · ${operandB} = ${estimatedResult}. Pontos szorzat: ${operandA} · ${operandB} = ${exactResult}.`,
  };
}

// ============================================================================
// 6. Római számok (I. kötet 28–29. o.)
// ============================================================================
function generateRomanNumerals3(topicId: string): RomanNumeralsExercise {
  const direction = pickRandom<'roman-to-arabic' | 'arabic-to-roman'>([
    'roman-to-arabic',
    'arabic-to-roman',
  ]);
  const num = randInt(4, 98);
  const roman = toRoman(num);

  if (direction === 'roman-to-arabic') {
    return {
      id: uid('rom3'),
      kind: 'roman-numerals',
      topicId,
      title: 'Római számok átváltása arab számra',
      instruction: 'Írd le arab számjegyekkel a megadott római számot!',
      direction,
      promptValue: roman,
      exactAnswer: String(num),
      hint: `Emlékeztető: I = 1, V = 5, X = 10, L = 50, C = 100 (IV = 4, IX = 9, XL = 40, XC = 90). A(z) ${roman} értéke: ${num}.`,
    };
  }

  return {
    id: uid('rom3'),
    kind: 'roman-numerals',
    topicId,
    title: 'Arab számok átváltása római számra',
    instruction: 'Írd le római számmal a megadott számot!',
    direction,
    promptValue: String(num),
    exactAnswer: roman,
    hint: `Bontsd helyi értékekre: tízesek (${Math.floor(num / 10) * 10} → ${toRoman(Math.floor(num / 10) * 10)}) és egyesek (${num % 10} → ${toRoman(num % 10)}). Együtt: ${roman}.`,
  };
}

// ============================================================================
// 7. Mérések: Tömeg és űrtartalom (I. kötet 48–57. o.)
// ============================================================================
function generateMassCapacityConversion3(topicId: string): UnitConversionExercise {
  const templates: Array<() => Omit<UnitConversionExercise, 'id' | 'kind' | 'topicId'>> = [
    () => {
      const kg = randInt(1, 4);
      const dkg = randInt(5, 85);
      return {
        title: 'Tömegmértékegységek átváltása (kg → dkg)',
        instruction: 'Váltsd át a megadott tömeget dekagrammra! (1 kg = 100 dkg)',
        category: 'tömeg',
        sourceText: `${kg} kg ${dkg} dkg`,
        targetUnit: 'dkg',
        exactResult: kg * 100 + dkg,
        hint: `1 kg = 100 dkg, tehát ${kg} kg ${dkg} dkg = ${kg * 100} + ${dkg} = ${kg * 100 + dkg} dkg.`,
      };
    },
    () => {
      const wholeKg = randInt(1, 3);
      return {
        title: 'Tömegmérés: egész és fél kilogramm',
        instruction: 'Hány dekagramm az alábbi mennyiség? (fél kg = 50 dkg)',
        category: 'tömeg',
        sourceText: `${wholeKg} és fél kg`,
        targetUnit: 'dkg',
        exactResult: wholeKg * 100 + 50,
        hint: `${wholeKg} kg = ${wholeKg * 100} dkg, fél kg = 50 dkg. Összesen: ${wholeKg * 100 + 50} dkg.`,
      };
    },
    () => {
      const dl = randInt(2, 9);
      return {
        title: 'Űrtartalom átváltása (cl → dl)',
        instruction: 'Váltsd át a centiliterben megadott űrtartalmat deciliterre! (1 dl = 10 cl)',
        category: 'űrtartalom',
        sourceText: `${dl * 10} cl`,
        targetUnit: 'dl',
        exactResult: dl,
        hint: `10 cl = 1 dl, tehát ${dl * 10} cl = ${dl} dl.`,
      };
    },
    () => {
      const l = randInt(1, 5);
      const dl = randInt(1, 9);
      return {
        title: 'Űrtartalom átváltása (l és dl → dl)',
        instruction: 'Váltsd át a mennyiséget deciliterre! (1 l = 10 dl)',
        category: 'űrtartalom',
        sourceText: `${l} l ${dl} dl`,
        targetUnit: 'dl',
        exactResult: l * 10 + dl,
        hint: `1 liter = 10 dl, így ${l} l ${dl} dl = ${l * 10} + ${dl} = ${l * 10 + dl} dl.`,
      };
    },
    () => {
      const usedCl = randInt(22, 78);
      return {
        title: 'Kiegészítés 1 literre (100 cl-re)',
        instruction: 'Hány centiliter hiányzik még az 1 literhez? (I. kötet 54. o. alapján)',
        category: 'űrtartalom',
        sourceText: `1 liter - ${usedCl} cl`,
        targetUnit: 'cl',
        exactResult: 100 - usedCl,
        hint: `1 liter = 100 cl. Így 100 cl - ${usedCl} cl = ${100 - usedCl} cl.`,
      };
    },
  ];

  const picked = pickRandom(templates)();
  return {
    id: uid('mc3'),
    kind: 'unit-conversion',
    topicId,
    ...picked,
  };
}

// ============================================================================
// 8. Negatív számok (II. kötet 19–22. o.)
// ============================================================================
function generateNegativeNumbers3(topicId: string): NegativeNumbersExercise {
  const variant = randInt(1, 3);
  if (variant === 1) {
    // Benti és kinti hőmérséklet különbsége (II. kötet 21. o. 7. feladat)
    const inside = randInt(17, 25);
    const outside = -randInt(2, 9);
    const diff = inside - outside;
    return {
      id: uid('neg3-diff'),
      kind: 'negative-numbers',
      topicId,
      title: 'Benti és kinti hőmérséklet különbsége',
      instruction: 'Számítsd ki, hány °C különbség van a szobai (benti) és a kinti hőmérséklet között! (II. kötet 21. o.)',
      subKind: 'temp-diff',
      questionText: `A szobában ${inside} °C van, odakint a kertben pedig ${outside} °C-ot mutat a hőmérő. Hány Celsius-fok a különbség a két hőmérséklet között?`,
      startTemp: outside,
      endTemp: inside,
      unit: '°C',
      exactResult: diff,
      hint: `0 °C-tól ${outside} °C-ig ${Math.abs(outside)} °C van, 0 °C-tól +${inside} °C-ig pedig ${inside} °C. Összesen: ${Math.abs(outside)} + ${inside} = ${diff} °C a különbség.`,
    };
  }

  if (variant === 2) {
    // Este pozitív volt, reggelre csökkent (II. kötet 21. o. 6. feladat)
    const evening = randInt(2, 6);
    const drop = randInt(evening + 2, evening + 8);
    const morning = evening - drop;
    return {
      id: uid('neg3-drop'),
      kind: 'negative-numbers',
      topicId,
      title: 'Éjszakai lehűlés a hőmérőn',
      instruction: 'Állapítsd meg, hány Celsius-fokot mutatott reggel a hőmérő! (Előjellel írd be!)',
      subKind: 'temp-change',
      questionText: `Este ${evening} °C volt odakint, ám reggelre ${drop} °C-ot csökkent a hőmérséklet. Hány °C-ot mutatott reggel a hőmérő?`,
      startTemp: evening,
      endTemp: morning,
      unit: '°C',
      exactResult: morning,
      hint: `${evening} °C-ról ${evening} fok csökkenéssel érjük el a 0 °C-ot, és még ${drop - evening} fokot hűlt fagypont alá: ${morning} °C.`,
    };
  }

  // Reggel fagypont alatt volt, délelőtt melegedett (II. kötet 22. o. 10. feladat)
  const morning = -randInt(2, 7);
  const rise = randInt(5, 12);
  const noon = morning + rise;
  return {
    id: uid('neg3-rise'),
    kind: 'negative-numbers',
    topicId,
    title: 'Nappali felmelegedés',
    instruction: 'Számítsd ki, hány °C lett délre a hőmérséklet!',
    subKind: 'temp-change',
    questionText: `Reggel ${morning} °C-ot mértünk, délig pedig ${rise} °C-ot emelkedett (enyhült) a hőmérséklet. Hány °C lett délben?`,
    startTemp: morning,
    endTemp: noon,
    unit: '°C',
    exactResult: noon,
    hint: `${morning} °C + ${rise} °C = ${noon} °C.`,
  };
}

// ============================================================================
// 9. Ismerkedés a törtekkel (II. kötet 67–70. o.)
// ============================================================================
function generateFractions3(topicId: string): FractionsExercise {
  const configs: Array<{
    denominator: number;
    label: string;
    unit: string;
    multiples: number[];
  }> = [
    { denominator: 2, label: 'fele (1 ketted része)', unit: 'm', multiples: [120, 240, 360, 480, 500, 840] },
    { denominator: 3, label: 'harmada (1 harmad része)', unit: 'Ft', multiples: [150, 240, 300, 360, 450, 600] },
    { denominator: 4, label: 'negyede (1 negyed része)', unit: 'm', multiples: [160, 240, 280, 360, 440, 480, 840] },
    { denominator: 5, label: 'ötöde (1 ötöd része)', unit: 'cm', multiples: [150, 250, 300, 450, 500, 650] },
    { denominator: 10, label: 'tizede (1 tized része)', unit: 'dkg', multiples: [150, 250, 300, 450, 500, 650, 1000] },
  ];

  const cfg = pickRandom(configs);
  const wholeValue = pickRandom(cfg.multiples);
  const exactResult = wholeValue / cfg.denominator;

  return {
    id: uid('frac3'),
    kind: 'fractions',
    topicId,
    title: 'Ismerkedés a törtekkel (Egységtörtek)',
    instruction: 'Számítsd ki a megadott mennyiség törtrészét a II. kötet 70. oldala alapján!',
    wholeValue,
    wholeUnit: cfg.unit,
    numerator: 1,
    denominator: cfg.denominator,
    denominatorLabel: cfg.label,
    exactResult,
    hint: `Egy mennyiség ${cfg.label} úgy kapjuk meg, hogy elosztjuk ${cfg.denominator}-val: ${wholeValue} : ${cfg.denominator} = ${exactResult}.`,
  };
}

// ============================================================================
// 10. Időmérés és hosszúságmérés átváltások (II. kötet 71–77. o.)
// ============================================================================
function generateTimeLengthConversion3(topicId: string): UnitConversionExercise {
  const templates: Array<() => Omit<UnitConversionExercise, 'id' | 'kind' | 'topicId'>> = [
    () => {
      const h = randInt(2, 6);
      const m = randInt(12, 52);
      return {
        title: 'Időmértékegységek átváltása (óra és perc → perc)',
        instruction: 'Fejezd ki percben a megadott időtartamot! (1 óra = 60 perc, II. kötet 72. o.)',
        category: 'idő',
        sourceText: `${h} óra ${m} perc`,
        targetUnit: 'perc',
        exactResult: h * 60 + m,
        hint: `1 óra = 60 perc, így ${h} óra = ${h * 60} perc. Hozzáadva a(z) ${m} percet: ${h * 60 + m} perc.`,
      };
    },
    () => {
      const m = randInt(2, 8);
      const dm = randInt(2, 9);
      return {
        title: 'Hosszúság átváltása (m és dm → dm)',
        instruction: 'Váltsd át deciméterre a megadott hosszúságot! (1 m = 10 dm, II. kötet 76. o.)',
        category: 'hosszúság',
        sourceText: `${m} m ${dm} dm`,
        targetUnit: 'dm',
        exactResult: m * 10 + dm,
        hint: `1 m = 10 dm, tehát ${m} m ${dm} dm = ${m * 10} + ${dm} = ${m * 10 + dm} dm.`,
      };
    },
    () => {
      const m = randInt(1, 4);
      const dm = randInt(2, 9);
      return {
        title: 'Hosszúság átváltása (m és dm → cm)',
        instruction: 'Fejezd ki centiméterben a megadott hosszúságot! (1 m = 100 cm, 1 dm = 10 cm)',
        category: 'hosszúság',
        sourceText: `${m} m ${dm} dm`,
        targetUnit: 'cm',
        exactResult: m * 100 + dm * 10,
        hint: `${m} m = ${m * 100} cm, ${dm} dm = ${dm * 10} cm. Összesen: ${m * 100 + dm * 10} cm.`,
      };
    },
    () => {
      const cm = randInt(3, 18);
      const mm = randInt(2, 9);
      return {
        title: 'Hosszúság átváltása (cm és mm → mm)',
        instruction: 'Váltsd át milliméterre a szakasz hosszát! (1 cm = 10 mm)',
        category: 'hosszúság',
        sourceText: `${cm} cm ${mm} mm`,
        targetUnit: 'mm',
        exactResult: cm * 10 + mm,
        hint: `1 cm = 10 mm, így ${cm} cm ${mm} mm = ${cm * 10 + mm} mm.`,
      };
    },
  ];

  const picked = pickRandom(templates)();
  return {
    id: uid('tl3'),
    kind: 'unit-conversion',
    topicId,
    ...picked,
  };
}

// ============================================================================
// 11. Szöveges feladatok fejezetenként (OH-MAT03-I és OH-MAT03-II alapján)
// ============================================================================
function generateWordProblem3(
  topicId: string,
  category:
    | 'ch1-100'
    | 'ch3-200'
    | 'ch4-measure'
    | 'ch5-500'
    | 'ch6-add'
    | 'ch7-sub'
    | 'ch8-geom'
    | 'ch10-mult'
    | 'ch11-perim-time'
    | 'ch12-finance'
): WordProblemExercise {
  switch (category) {
    case 'ch1-100': {
      const templates: Array<() => Omit<WordProblemExercise, 'id' | 'kind' | 'topicId'>> = [
        () => {
          const halfOf100 = 50;
          const diff = randInt(18, 34);
          return {
            title: 'Ausztrál erszényesek számrejtvénye (I. kötet 16. o.)',
            instruction: 'Olvasd el a meghatározást, és számítsd ki a keresett számot!',
            story: `A koala erszényében lévő szám a 100 felénél ${diff}-gyel kisebb.`,
            question: 'Melyik szám rejtőzik a koala erszényében?',
            unit: '',
            exactResult: halfOf100 - diff,
            solutionSteps: `100 : 2 - ${diff} = 50 - ${diff}`,
            hint: `A 100 fele 50. Ebből vond ki a(z) ${diff}-t!`,
          };
        },
        () => {
          const vera = randInt(7, 12);
          const mult = randInt(3, 6);
          return {
            title: 'Matricagyűjtés (I. kötet 17. o.)',
            instruction: 'Oldd meg a szöveges feladatot!',
            story: `Verának ${vera} matricája van, Lillának pedig ${mult}-szor annyi.`,
            question: 'Hány matricája van a két lánynak összesen?',
            unit: 'db',
            exactResult: vera + vera * mult,
            solutionSteps: `${vera} + (${vera} · ${mult}) = ${vera} + ${vera * mult}`,
            hint: `Először számítsd ki Lilla matricáit (${vera} · ${mult} = ${vera * mult}), majd add hozzá Veráét (${vera})!`,
          };
        },
        () => {
          const hamSlices = randInt(21, 39);
          const perSandwich = 4;
          const sandwiches = Math.floor(hamSlices / perSandwich);
          return {
            title: 'Iskolai büfé szendvicsei (I. kötet 20. o.)',
            instruction: 'Számítsd ki maradékos osztással, hány teljes szendvics készíthető!',
            story: `Az iskolai büfében egy szendvicsbe ${perSandwich} szelet sonkát tesznek. A tálcán ${hamSlices} szelet sonka van előkészítve.`,
            question: 'Legfeljebb hány darab ilyen szendvicshez elég ez a sonkamennyiség?',
            unit: 'szendvics',
            exactResult: sandwiches,
            solutionSteps: `${hamSlices} : ${perSandwich} = ${sandwiches} (maradék: ${hamSlices % perSandwich})`,
            hint: `Oszd el a(z) ${hamSlices}-t ${perSandwich}-gyel, és a hányados adja meg az elkészíthető szendvicsek számát!`,
          };
        },
      ];
      return { id: uid('wp3-100'), kind: 'word-problem', topicId, ...pickRandom(templates)() };
    }

    case 'ch3-200': {
      const templates: Array<() => Omit<WordProblemExercise, 'id' | 'kind' | 'topicId'>> = [
        () => {
          const flowerPrice = pickRandom([60, 70, 80, 90]);
          const change = 200 - 2 * flowerPrice;
          return {
            title: 'Akciós virágvásár (I. kötet 46. o.)',
            instruction: 'Számítsd ki a visszajárót!',
            story: `Bence 200 Ft-ot kapott a szüleitől a virágvásárra. Vásárolt 2 darab egyforma virágot, amelyek darabja ${flowerPrice} Ft-ba került.`,
            question: 'Hány forintot kapott vissza Bence a 200 Ft-ból?',
            unit: 'Ft',
            exactResult: change,
            solutionSteps: `200 - 2 · ${flowerPrice} = 200 - ${2 * flowerPrice}`,
            hint: `A két virág ára: 2 · ${flowerPrice} = ${2 * flowerPrice} Ft. Vond ki 200 Ft-ból!`,
          };
        },
        () => {
          const bulbs = pickRandom([120, 140, 160, 180, 200]);
          const perChild = 20;
          return {
            title: 'Virághagymák ültetése (I. kötet 47. o.)',
            instruction: 'Számítsd ki, hány gyerekre volt szükség!',
            story: `Az iskolakert beültetéséhez minden gyereknek ${perChild} darab tulipánhagymát adtak. Összesen ${bulbs} virághagymát ültettek el.`,
            question: 'Hány gyerek vett részt a virághagymák elültetésében?',
            unit: 'gyerek',
            exactResult: bulbs / perChild,
            solutionSteps: `${bulbs} : ${perChild} = ${bulbs / perChild}`,
            hint: `Oszd el a(z) ${bulbs}-at ${perChild}-szal!`,
          };
        },
      ];
      return { id: uid('wp3-200'), kind: 'word-problem', topicId, ...pickRandom(templates)() };
    }

    case 'ch4-measure': {
      const templates: Array<() => Omit<WordProblemExercise, 'id' | 'kind' | 'topicId'>> = [
        () => {
          const mandarin = randInt(42, 65);
          const pineapple = randInt(35, 55);
          const apple = 50; // fél kg
          const total = mandarin + pineapple + apple;
          return {
            title: 'Csenge gyümölcssalátája (I. kötet 48. o.)',
            instruction: 'Váltsd át a fél kilogrammot dekagrammra, majd add össze a mennyiségeket!',
            story: `Csenge gyümölcssalátát készít. Ehhez ${mandarin} dkg mandarint, ${pineapple} dkg ananászt és fél kg almát vásárolt.`,
            question: 'Hány dekagramm gyümölcsöt vásárolt összesen Csenge?',
            unit: 'dkg',
            exactResult: total,
            solutionSteps: `${mandarin} + ${pineapple} + 50 = ${total}`,
            hint: `Fél kg alma = 50 dkg. Add össze: ${mandarin} + ${pineapple} + 50!`,
          };
        },
        () => {
          // Misi Mókus (I. kötet 51. o. 11. feladat)
          const totalKg = 2;
          return {
            title: 'Misi Mókus téli készlete (I. kötet 51. o.)',
            instruction: 'Számítsd ki az összegyűjtött termések tömegét kilogrammban!',
            story: `Misi Mókus az erdőben 30 dkg diót és kétszer annyi (60 dkg) mogyorót gyűjtött. Makkból 50 dkg-mal többet szedett, mint mogyoróból (azaz 110 dkg-ot).`,
            question: 'Összesen hány KILOGRAMM diót, mogyorót és makkot gyűjtött Misi Mókus ezen a napon?',
            unit: 'kg',
            exactResult: totalKg,
            solutionSteps: `(30 + 60 + 110) dkg = 200 dkg = 2 kg`,
            hint: `Add össze dekagrammban: 30 + 60 + 110 = 200 dkg. Mivel 100 dkg = 1 kg, ez pontosan 2 kg!`,
          };
        },
        () => {
          // Géza bácsi tehene (I. kötet 55. o. 12. feladat)
          const totalL = 120;
          const morning = randInt(35, 45);
          const noon = randInt(35, 45);
          const evening = totalL - morning - noon;
          return {
            title: 'Géza bácsi tehene (I. kötet 55. o.)',
            instruction: 'Oldd meg az űrtartalommal kapcsolatos szöveges feladatot!',
            story: `Géza bácsi jól tejelő tehene naponta ${totalL} liter vizet iszik. Reggel ${morning} litert, délben pedig ${noon} litert ivott meg.`,
            question: 'Hány liter vizet iszik meg a tehén este?',
            unit: 'liter',
            exactResult: evening,
            solutionSteps: `${totalL} - (${morning} + ${noon}) = ${totalL} - ${morning + noon}`,
            hint: `Reggel és délben összesen ${morning} + ${noon} = ${morning + noon} litert ivott. Vond ki ${totalL}-ból!`,
          };
        },
      ];
      return { id: uid('wp3-meas'), kind: 'word-problem', topicId, ...pickRandom(templates)() };
    }

    case 'ch5-500': {
      const blackHorses = pickRandom([70, 80, 90, 110]);
      const greyHorses = blackHorses * 3;
      const totalHorses = blackHorses + greyHorses;
      return {
        id: uid('wp3-500'),
        kind: 'word-problem',
        topicId,
        title: 'Lipicai ménesbirtok (I. kötet 76. o.)',
        instruction: 'Oldd meg a többlépéses szöveges feladatot!',
        story: `Egy ménesbirtokon fekete és szürke lipicai lovak élnek. A fekete lovak száma ${blackHorses}, a szürkék száma pedig háromszor annyi, mint a feketéké.`,
        question: 'Hány lipicai ló él ezen a ménesbirtokon összesen (a feketék és a szürkék együtt)?',
        unit: 'ló',
        exactResult: totalHorses,
        solutionSteps: `${blackHorses} + 3 · ${blackHorses} = ${blackHorses} + ${greyHorses}`,
        hint: `A szürke lovak száma: 3 · ${blackHorses} = ${greyHorses}. Összesen: ${blackHorses} + ${greyHorses} = ${totalHorses} ló.`,
      };
    }

    case 'ch6-add': {
      const templates: Array<() => Omit<WordProblemExercise, 'id' | 'kind' | 'topicId'>> = [
        () => {
          const boys = randInt(145, 195);
          const diff = randInt(125, 195);
          const girls = boys + diff;
          return {
            title: 'Zoknibábok készítése (I. kötet 93. o.)',
            instruction: 'Olvasd el figyelmesen a szöveget, és számítsd ki a lányok által készített bábok számát!',
            story: `A kézműves szakkörön a fiúk ${boys} zoknibábot készítettek, ez ${diff}-mal kevesebb, mint amennyit a lányok alkottak.`,
            question: 'Hány zoknibábot készítettek a lányok?',
            unit: 'db',
            exactResult: girls,
            solutionSteps: `${boys} + ${diff} = ${girls}`,
            hint: `Ha a fiúké ${diff}-mal kevesebb, akkor a lányok ${diff}-mal többet készítettek: ${boys} + ${diff}!`,
          };
        },
        () => {
          const sourCream = randInt(235, 295);
          const onion = randInt(135, 185);
          return {
            title: 'Kirakodóvásári pompos (I. kötet 94. o.)',
            instruction: 'Számítsd ki az eladott pomposok számát!',
            story: `A kirakodóvásáron az árusok ${sourCream} darab tejfölös pompost és ${onion} darab hagymás pompost adtak el.`,
            question: 'Hány tejfölös és hagymás pompos fogyott el összesen?',
            unit: 'db',
            exactResult: sourCream + onion,
            solutionSteps: `${sourCream} + ${onion} = ${sourCream + onion}`,
            hint: `Add össze a kétféle pompos darabszámát: ${sourCream} + ${onion}!`,
          };
        },
      ];
      return { id: uid('wp3-add'), kind: 'word-problem', topicId, ...pickRandom(templates)() };
    }

    case 'ch7-sub': {
      const robi = randInt(345, 465);
      const feri = randInt(155, 245);
      return {
        id: uid('wp3-sub'),
        kind: 'word-problem',
        topicId,
        title: 'Ugrókötélhajtó verseny (II. kötet 17. o.)',
        instruction: 'Számítsd ki a két versenyző eredménye közötti különbséget!',
        story: `Az iskolai ugrókötélhajtó versenyen Robi ${robi} ugrást, Feri pedig ${feri} ugrást teljesített.`,
        question: 'Hány ugrással teljesített többet Robi Ferinél?',
        unit: 'ugrás',
        exactResult: robi - feri,
        solutionSteps: `${robi} - ${feri} = ${robi - feri}`,
        hint: `Vond ki Robi eredményéből (${robi}) Feri eredményét (${feri})!`,
      };
    }

    case 'ch8-geom': {
      const templates: Array<() => Omit<WordProblemExercise, 'id' | 'kind' | 'topicId'>> = [
        () => ({
          title: 'A kocka és a téglatest tulajdonságai (II. kötet 25–26. o.)',
          instruction: 'Gondolj a kocka és a téglatest felépítésére!',
          story: `Egy építőkockának 6 egyforma négyzet alakú lapja és 8 csúcsa van.`,
          question: 'Hány éle van egy kockának (vagy téglatestnek)?',
          unit: 'él',
          exactResult: 12,
          solutionSteps: '4 alsó él + 4 felső él + 4 oldalsó él = 12 él',
          hint: 'Számold meg: alul 4 él, felül 4 él és oldalt függőlegesen még 4 él!',
        }),
        () => {
          const usedCubes = randInt(16, 23);
          const targetCube = 27; // 3x3x3-as nagy kocka
          return {
            title: 'Kiskocka-építmény kiegészítése kockává (II. kötet 26. o.)',
            instruction: 'Számítsd ki, hány kis kocka hiányzik még a teljes 3×3×3-as kockához!',
            story: `Egy 3 egység élhosszúságú nagy kocka megépítéséhez összesen 27 darab kis kockára van szükség (3 · 3 · 3 = 27). Az építményünkben már ${usedCubes} darab kis kockát elhelyeztünk.`,
            question: 'Legalább hány kis kockára van még szükségünk, hogy teljes kockává egészítsük ki?',
            unit: 'kis kocka',
            exactResult: targetCube - usedCubes,
            solutionSteps: `27 - ${usedCubes} = ${targetCube - usedCubes}`,
            hint: `A teljes 3×3×3-as kockában 27 kis kocka van. Vond ki belőle a már felhasznált ${usedCubes} darabot!`,
          };
        },
      ];
      return { id: uid('wp3-geom'), kind: 'word-problem', topicId, ...pickRandom(templates)() };
    }

    case 'ch10-mult': {
      const flourFor4 = pickRandom([44, 36, 48]);
      const mult = 2; // 8 személyre a duplája
      return {
        id: uid('wp3-mult'),
        kind: 'word-problem',
        topicId,
        title: 'Sajtos perec recept 8 személyre (II. kötet 65. o.)',
        instruction: 'Számítsd ki a szükséges liszt mennyiségét!',
        story: `Kati és anyukája sajtos perecet süt. A 4 személyre szóló recepthez ${flourFor4} dkg liszt, 28 dkg vaj és 22 dkg reszelt sajt szükséges.`,
        question: 'Hány dekagramm lisztre van szükségük, ha 8 személyre (dupla adagot) készítenek sajtos perecet?',
        unit: 'dkg',
        exactResult: flourFor4 * mult,
        solutionSteps: `2 · ${flourFor4} = ${flourFor4 * mult}`,
        hint: `8 személyre kétszer annyi hozzávaló kell, mint 4 személyre: szorozd meg ${flourFor4}-et 2-vel!`,
      };
    }

    case 'ch11-perim-time': {
      const templates: Array<() => Omit<WordProblemExercise, 'id' | 'kind' | 'topicId'>> = [
        () => {
          const a = randInt(15, 38);
          const b = randInt(12, 28);
          const k = 2 * (a + b);
          return {
            title: 'Medence körbejárása – Téglalap kerülete (II. kötet 80. o.)',
            instruction: 'Számítsd ki a téglalap alakú medence kerületét!',
            story: `Az uszoda téglalap alakú medencéjének hosszabbik oldala ${a} m, rövidebbik oldala pedig ${b} m.`,
            question: 'Hány métert teszünk meg, ha egyszer teljesen körbejárjuk a medencét (mennyi a kerülete)?',
            unit: 'm',
            exactResult: k,
            solutionSteps: `2 · (${a} + ${b}) = 2 · ${a + b} = ${k}`,
            hint: `A téglalap kerülete: K = 2 · (a + b) = ${a} + ${b} + ${a} + ${b} = ${k} m.`,
          };
        },
        () => {
          const a = randInt(5, 9);
          const b = randInt(4, 8);
          return {
            title: 'Téglalap területe négyzetegységekben (II. kötet 82. o.)',
            instruction: 'Számítsd ki, hány négyzetegység fedi le a téglalapot!',
            story: `Egy téglalap alakú virágágyást négyzet alakú járólapokkal rakunk ki. Egy sorba ${a} darab lap fér, és összesen ${b} ilyen sor van egymás alatt.`,
            question: 'Hány darab négyzetegység (járólap) a téglalap területe?',
            unit: 'négyzetegység',
            exactResult: a * b,
            solutionSteps: `${a} · ${b} = ${a * b}`,
            hint: `A téglalap területét a két szomszédos oldal szorzata adja: T = ${a} · ${b} = ${a * b}.`,
          };
        },
        () => ({
          title: 'Balatoni hajómenetrend (II. kötet 71. o.)',
          instruction: 'Számítsd ki a menetidőt percben!',
          story: `A balatoni kirándulóhajó 11:00-kor indul Siófokról, és 11:50-kor érkezik meg Balatonfüredre, majd 10 perc várakozás után, 12:00-kor indul tovább Tihanyba, ahová 12:20-kor fut be.`,
          question: 'Hány percig tartott a teljes út Siófoktól Tihanyig (a füredi megállással együtt)?',
          unit: 'perc',
          exactResult: 80,
          solutionSteps: '11:00-tól 12:20-ig = 1 óra 20 perc = 80 perc',
          hint: '11:00-tól 12:00-ig 60 perc telik el, 12:00-tól 12:20-ig pedig még 20 perc: 60 + 20 = 80 perc.',
        }),
      ];
      return { id: uid('wp3-perim'), kind: 'word-problem', topicId, ...pickRandom(templates)() };
    }

    case 'ch12-finance': {
      const bookPrice = randInt(220, 380);
      const gamePrice = randInt(310, 480);
      const toyPrice = randInt(120, 190);
      const total = bookPrice + gamePrice + toyPrice;
      return {
        id: uid('wp3-fin'),
        kind: 'word-problem',
        topicId,
        title: 'Mindennapi pénzügyeink – Bolhapiac (II. kötet 103. o.)',
        instruction: 'Számítsd ki a bolhapiaci árusítás teljes bevételét!',
        story: `Az iskolai bolhapiacon Dani eladott egy megunt mesekönyvet ${bookPrice} Ft-ért, egy társasjátékot ${gamePrice} Ft-ért és egy kisautót ${toyPrice} Ft-ért.`,
        question: 'Hány forint lett Dani összes bevétele a három termék eladásából?',
        unit: 'Ft',
        exactResult: total,
        solutionSteps: `${bookPrice} + ${gamePrice} + ${toyPrice} = ${total}`,
        hint: `Add össze a három eladott tárgy árát: ${bookPrice} + ${gamePrice} + ${toyPrice}!`,
      };
    }
  }
}

// ============================================================================
// Feladatsor-generátor a 3. osztályos Matematika 12 fejezetéhez
// ============================================================================
export function generateMathGrade3Worksheet(topicId: string, count = 6): Exercise[] {
  const exercises: Exercise[] = [];

  for (let i = 0; i < count; i++) {
    switch (topicId) {
      case 'matek-3-100-muveletek': {
        const mod = i % 3;
        if (mod === 0) exercises.push(generateRemainderDivision100(topicId));
        else if (mod === 1) exercises.push(generateOrderOfOperations3(topicId, 100));
        else exercises.push(generateWordProblem3(topicId, 'ch1-100'));
        break;
      }

      case 'matek-3-romai-szamok': {
        const mod = i % 3;
        if (mod === 0 || mod === 1) exercises.push(generateRomanNumerals3(topicId));
        else exercises.push(generateRemainderDivision100(topicId));
        break;
      }

      case 'matek-3-szamok-200': {
        const mod = i % 4;
        if (mod === 0) exercises.push(generateRoundingNeighbors3(topicId, 200));
        else if (mod === 1) exercises.push(generatePlaceValue3(topicId, 200));
        else if (mod === 2) exercises.push(generateOrderOfOperations3(topicId, 200));
        else exercises.push(generateWordProblem3(topicId, 'ch3-200'));
        break;
      }

      case 'matek-3-tomeg-urtartalom': {
        const mod = i % 2;
        if (mod === 0) exercises.push(generateMassCapacityConversion3(topicId));
        else exercises.push(generateWordProblem3(topicId, 'ch4-measure'));
        break;
      }

      case 'matek-3-szamok-500': {
        const mod = i % 4;
        if (mod === 0) exercises.push(generateRoundingNeighbors3(topicId, 500));
        else if (mod === 1) exercises.push(generateOrderOfOperations3(topicId, 500));
        else if (mod === 2) exercises.push(generatePlaceValue3(topicId, 500));
        else exercises.push(generateWordProblem3(topicId, 'ch5-500'));
        break;
      }

      case 'matek-3-irasbeli-osszeadas': {
        const mod = i % 3;
        if (mod === 0 || mod === 1) exercises.push(generateWrittenAddition3(topicId, 1000));
        else exercises.push(generateWordProblem3(topicId, 'ch6-add'));
        break;
      }

      case 'matek-3-irasbeli-kivonas': {
        const mod = i % 3;
        if (mod === 0 || mod === 1) exercises.push(generateWrittenSubtraction3(topicId));
        else exercises.push(generateWordProblem3(topicId, 'ch7-sub'));
        break;
      }

      case 'matek-3-negativ-testek-sikidomok': {
        const mod = i % 2;
        if (mod === 0) exercises.push(generateNegativeNumbers3(topicId));
        else exercises.push(generateWordProblem3(topicId, 'ch8-geom'));
        break;
      }

      case 'matek-3-szamok-1000': {
        const mod = i % 4;
        if (mod === 0) exercises.push(generateRoundingNeighbors3(topicId, 1000));
        else if (mod === 1) exercises.push(generatePlaceValue3(topicId, 1000));
        else if (mod === 2) exercises.push(generateWrittenAddition3(topicId, 1000));
        else exercises.push(generateWrittenSubtraction3(topicId));
        break;
      }

      case 'matek-3-irasbeli-szorzas': {
        const mod = i % 3;
        if (mod === 0) exercises.push(generateWrittenMultiplication3(topicId));
        else if (mod === 1) exercises.push(generateOrderOfOperations3(topicId, 1000));
        else exercises.push(generateWordProblem3(topicId, 'ch10-mult'));
        break;
      }

      case 'matek-3-tortek-ido-hosszusag-kerulet-terulet': {
        const mod = i % 3;
        if (mod === 0) exercises.push(generateFractions3(topicId));
        else if (mod === 1) exercises.push(generateTimeLengthConversion3(topicId));
        else exercises.push(generateWordProblem3(topicId, 'ch11-perim-time'));
        break;
      }

      case 'matek-3-ev-vegi-ismetles-penzugyek': {
        const mod = i % 6;
        if (mod === 0) exercises.push(generateWrittenAddition3(topicId, 1000));
        else if (mod === 1) exercises.push(generateWrittenSubtraction3(topicId));
        else if (mod === 2) exercises.push(generateWrittenMultiplication3(topicId));
        else if (mod === 3) exercises.push(generateFractions3(topicId));
        else if (mod === 4) exercises.push(generateNegativeNumbers3(topicId));
        else exercises.push(generateWordProblem3(topicId, 'ch12-finance'));
        break;
      }

      default:
        exercises.push(generateRemainderDivision100(topicId));
        break;
    }
  }

  return exercises;
}
