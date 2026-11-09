import {
  Exercise,
  NegativeNumbersExercise,
  PlaceValueExercise,
  RomanNumeralsExercise,
  RoundingNeighborsExercise,
  UnitConversionExercise,
  WordProblemExercise,
  WrittenArithmeticExercise,
  WrittenDivisionExercise,
} from '../types/curriculum';

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function uid(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}-${Date.now().toString(36)}`;
}

export function toRoman(num: number): string {
  const map: [number, string][] = [
    [100, 'C'],
    [90, 'XC'],
    [50, 'L'],
    [40, 'XL'],
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I'],
  ];
  let result = '';
  let remaining = num;
  for (const [val, sym] of map) {
    while (remaining >= val) {
      result += sym;
      remaining -= val;
    }
  }
  return result;
}

// ==========================================
// 1. Írásbeli műveletek (Összeadás, Kivonás, Szorzás egyjegyűvel) + Becslés (I. kötet)
// ==========================================
export function generateWrittenArithmetic(
  topicId: string,
  maxRange: 1000 | 10000 = 10000
): WrittenArithmeticExercise {
  const ops: ('+' | '-' | '·')[] = ['+', '-', '·'];
  const operation = pickRandom(ops);
  const roundTo: 10 | 100 = 100;

  if (operation === '+') {
    const minVal = maxRange === 1000 ? 120 : 1150;
    const maxA = maxRange === 1000 ? 580 : 6200;
    const operandA = randInt(minVal, maxA);
    const operandB = randInt(minVal, maxRange - operandA - 45);
    const exactResult = operandA + operandB;
    const estimatedA = Math.round(operandA / roundTo) * roundTo;
    const estimatedB = Math.round(operandB / roundTo) * roundTo;
    const estimatedResult = estimatedA + estimatedB;

    return {
      id: uid('written-add'),
      kind: 'written-arithmetic',
      topicId,
      title: 'Írásbeli összeadás becsléssel',
      instruction: `Becsüld meg százasra kerekített értékekkel az összeget, majd végezd el az írásbeli összeadást!`,
      operation: '+',
      operandA,
      operandB,
      roundTo,
      estimatedA,
      estimatedB,
      estimatedResult,
      exactResult,
      hint: `Százasra kerekítve: ${operandA} ≈ ${estimatedA}, ${operandB} ≈ ${estimatedB}. Így a becslés: ${estimatedA} + ${estimatedB} = ${estimatedResult}.`,
    };
  }

  if (operation === '-') {
    const minVal = maxRange === 1000 ? 350 : 3200;
    const operandA = randInt(minVal, maxRange - 50);
    const operandB = randInt(maxRange === 1000 ? 115 : 1150, operandA - 120);
    const exactResult = operandA - operandB;
    const estimatedA = Math.round(operandA / roundTo) * roundTo;
    const estimatedB = Math.round(operandB / roundTo) * roundTo;
    const estimatedResult = estimatedA - estimatedB;

    return {
      id: uid('written-sub'),
      kind: 'written-arithmetic',
      topicId,
      title: 'Írásbeli kivonás becsléssel',
      instruction: `Becsüld meg százasra kerekített értékekkel a különbséget, majd végezd el az írásbeli kivonást!`,
      operation: '-',
      operandA,
      operandB,
      roundTo,
      estimatedA,
      estimatedB,
      estimatedResult,
      exactResult,
      hint: `Százasra kerekítve: ${operandA} ≈ ${estimatedA}, ${operandB} ≈ ${estimatedB}. Így a becslés: ${estimatedA} - ${estimatedB} = ${estimatedResult}.`,
    };
  }

  // Multiplication by single digit ('·')
  const operandB = randInt(2, 8);
  const maxMultiplicand = Math.floor((maxRange - 100) / operandB);
  const minMultiplicand = maxRange === 1000 ? 112 : 340;
  const operandA = randInt(minMultiplicand, Math.max(minMultiplicand + 50, maxMultiplicand));
  const exactResult = operandA * operandB;
  const multRoundTo: 10 | 100 = maxRange === 1000 ? 10 : 100;
  const estimatedA = Math.round(operandA / multRoundTo) * multRoundTo;
  const estimatedB = operandB;
  const estimatedResult = estimatedA * estimatedB;

  return {
    id: uid('written-mul'),
    kind: 'written-arithmetic',
    topicId,
    title: 'Írásbeli szorzás egyjegyű számmal',
    instruction: `Becsüld meg a szorzatot a szorzandó ${
      multRoundTo === 100 ? 'százasra' : 'tízesre'
    } kerekítésével, majd végezd el a szorzást!`,
    operation: '·',
    operandA,
    operandB,
    roundTo: multRoundTo,
    estimatedA,
    estimatedB,
    estimatedResult,
    exactResult,
    hint: `${operandA} ≈ ${estimatedA}, így a becslés: ${estimatedA} · ${operandB} = ${estimatedResult}.`,
  };
}

// ==========================================
// 2. Írásbeli szorzás kétjegyű szorzóval (II. kötet 52–65. o.)
// ==========================================
export function generateTwoDigitMultiplication(topicId: string): WrittenArithmeticExercise {
  const isThreeDigit = Math.random() > 0.45;
  const operandB = randInt(12, 68);
  // Ensure product stays ≤ 10 000 as per 4th grade number range
  const maxA = Math.min(isThreeDigit ? 395 : 98, Math.floor(9900 / operandB));
  const minA = isThreeDigit ? 105 : 23;
  const operandA = randInt(minA, Math.max(minA + 10, maxA));

  const exactResult = operandA * operandB;
  const estimatedA = Math.round(operandA / 10) * 10;
  const estimatedB = Math.round(operandB / 10) * 10;
  const estimatedResult = estimatedA * estimatedB;

  return {
    id: uid('written-mul2'),
    kind: 'written-arithmetic',
    topicId,
    title: 'Írásbeli szorzás kétjegyű szorzóval',
    instruction:
      'Végezz becslést mindkét tényező tízesre kerekített értékével, majd számítsd ki a pontos szorzatot!',
    operation: '·',
    operandA,
    operandB,
    roundTo: 10,
    estimatedA,
    estimatedB,
    estimatedResult,
    exactResult,
    hint: `Tízesre kerekítve: ${operandA} ≈ ${estimatedA} és ${operandB} ≈ ${estimatedB}. Becslés: ${estimatedA} · ${estimatedB} = ${estimatedResult}. Részletszorzatok: ${operandA} · ${Math.floor(
      operandB / 10
    )}0 = ${operandA * Math.floor(operandB / 10) * 10}, és ${operandA} · ${
      operandB % 10
    } = ${operandA * (operandB % 10)}. Összesen: ${exactResult}.`,
  };
}

// ==========================================
// 3. Írásbeli osztás egyjegyű osztóval (II. kötet 4–23. o.)
// ==========================================
export function generateWrittenDivision(topicId: string): WrittenDivisionExercise {
  const divisor = randInt(2, 9);
  const hasRemainder = Math.random() > 0.45;
  const maxQuotient = Math.floor(9800 / divisor);
  const quotient = randInt(115, maxQuotient);
  const remainder = hasRemainder ? randInt(1, divisor - 1) : 0;
  const dividend = quotient * divisor + remainder;

  return {
    id: uid('written-div'),
    kind: 'written-division',
    topicId,
    title: hasRemainder
      ? 'Maradékos írásbeli osztás egyjegyű osztóval'
      : 'Írásbeli osztás egyjegyű osztóval (maradék nélkül)',
    instruction:
      'Végezd el az írásbeli osztást! Írd be a hányadost és a maradékot is (ha nincs maradék, írj 0-t)!',
    dividend,
    divisor,
    quotient,
    remainder,
    hasRemainder,
    hint: `Ellenőrzés szorzással: ${quotient} · ${divisor} = ${quotient * divisor}${
      remainder > 0 ? `, + ${remainder} (maradék) = ${dividend}` : ` = ${dividend}`
    }.`,
  };
}

// ==========================================
// 4. Számszomszédok és kerekítés
// ==========================================
export function generateRoundingNeighbors(
  topicId: string,
  maxRange: 1000 | 10000 = 10000
): RoundingNeighborsExercise {
  const neighborTypes: ('tízes' | 'százas' | 'ezres')[] =
    maxRange === 1000 ? ['tízes', 'százas'] : ['tízes', 'százas', 'ezres'];
  const neighborType = pickRandom(neighborTypes);
  const divisor = neighborType === 'tízes' ? 10 : neighborType === 'százas' ? 100 : 1000;

  let num = randInt(maxRange === 1000 ? 112 : 1123, maxRange - 112);
  if (num % divisor === 0) {
    num += randInt(1, divisor - 1);
  }

  const smallerNeighbor = Math.floor(num / divisor) * divisor;
  const largerNeighbor = smallerNeighbor + divisor;
  const remainder = num % divisor;
  const rounded = remainder >= divisor / 2 ? largerNeighbor : smallerNeighbor;

  return {
    id: uid('rounding'),
    kind: 'rounding-neighbors',
    topicId,
    title: `Számszomszédok és kerekítés (${neighborType})`,
    instruction: `Írd le a(z) ${num} kisebb és nagyobb ${neighborType} számszomszédját, valamint a ${neighborType}re kerekített értékét!`,
    item: {
      number: num,
      smallerNeighbor,
      largerNeighbor,
      rounded,
      neighborType,
    },
    hint: `A(z) ${num} a ${smallerNeighbor} és a ${largerNeighbor} között van. Mivel az utolsó végződés ${remainder}, a kerekített érték ${rounded}.`,
  };
}

// ==========================================
// 5. Helyiérték-bontás
// ==========================================
export function generatePlaceValue(
  topicId: string,
  maxRange: 1000 | 10000 = 10000
): PlaceValueExercise {
  if (maxRange === 1000) {
    const sz = randInt(1, 8);
    const t = randInt(0, 14);
    const e = randInt(1, 18);
    const exactResult = sz * 100 + t * 10 + e;

    const parts = [
      { label: `${sz} sz`, val: sz },
      { label: `${t} t`, val: t },
      { label: `${e} e`, val: e },
    ].filter((p) => p.val > 0);

    if (Math.random() > 0.4) {
      parts.sort(() => Math.random() - 0.5);
    }

    const expression = parts.map((p) => p.label).join(' + ');

    return {
      id: uid('place-val'),
      kind: 'place-value',
      topicId,
      title: 'Helyiérték-rejtvény (1000-ig)',
      instruction:
        'Melyik számra gondoltam? Figyelj a helyi értékek sorrendjére és az átváltásokra is!',
      expression,
      exactResult,
      hint: `${sz} százas = ${sz * 100}, ${t} tízes = ${t * 10}, ${e} egyes = ${e}. Összesen: ${exactResult}.`,
    };
  }

  const E = randInt(1, 8);
  const hasCarry = Math.random() > 0.35;
  const sz = hasCarry ? randInt(10, 15) : randInt(0, 9);
  const t = randInt(0, 9);
  const e = hasCarry ? randInt(11, 28) : randInt(1, 9);

  const exactResult = E * 1000 + sz * 100 + t * 10 + e;

  const parts = [
    { label: `${E} E`, val: E },
    { label: `${sz} sz`, val: sz },
    { label: `${t} t`, val: t },
    { label: `${e} e`, val: e },
  ].filter((p) => p.val > 0);

  if (Math.random() > 0.45) {
    parts.sort(() => Math.random() - 0.5);
  }

  const expression = parts.map((p) => p.label).join(' + ');

  return {
    id: uid('place-val'),
    kind: 'place-value',
    topicId,
    title: 'Helyiérték-bontás (10 000-ig)',
    instruction:
      'Mennyi a szám valódi értéke? Vigyázz: a helyi értékek felcserélve is szerepelhetnek, vagy 10-nél több is lehet belőlük!',
    expression,
    exactResult,
    hint: `${E} ezres (${E * 1000}) + ${sz} százas (${sz * 100}) + ${t} tízes (${t * 10}) + ${e} egyes (${e}) = ${exactResult}.`,
  };
}

// ==========================================
// 6. Mértékegység-átváltás (Hosszúság, Tömeg, Űrtartalom - I. kötet)
// ==========================================
export function generateUnitConversion(topicId: string): UnitConversionExercise {
  const templateIndex = randInt(0, 10);

  switch (templateIndex) {
    case 0: {
      const km = randInt(1, 9);
      const m = randInt(1, 9) * 100 + randInt(0, 9) * 10;
      return {
        id: uid('unit'),
        kind: 'unit-conversion',
        topicId,
        title: 'Hosszúság átváltása (km → m)',
        instruction: 'Váltsd át a megadott hosszúságot méterre!',
        category: 'hosszúság',
        sourceText: `${km} km ${m} m`,
        targetUnit: 'm',
        exactResult: km * 1000 + m,
        hint: `1 km = 1000 m, tehát ${km} km ${m} m = ${km * 1000} m + ${m} m = ${km * 1000 + m} m.`,
      };
    }
    case 1: {
      const dm = randInt(12, 95) * 10;
      return {
        id: uid('unit'),
        kind: 'unit-conversion',
        topicId,
        title: 'Hosszúság átváltása (dm → m)',
        instruction: 'Váltsd át a deciméterben megadott értéket méterre!',
        category: 'hosszúság',
        sourceText: `${dm} dm`,
        targetUnit: 'm',
        exactResult: dm / 10,
        hint: `10 dm = 1 m, ezért ${dm} dm = ${dm / 10} m.`,
      };
    }
    case 2: {
      const cm = randInt(15, 450);
      return {
        id: uid('unit'),
        kind: 'unit-conversion',
        topicId,
        title: 'Hosszúság átváltása (cm → mm)',
        instruction: 'Váltsd át a centimétert milliméterre!',
        category: 'hosszúság',
        sourceText: `${cm} cm`,
        targetUnit: 'mm',
        exactResult: cm * 10,
        hint: `1 cm = 10 mm, tehát ${cm} cm = ${cm * 10} mm.`,
      };
    }
    case 3: {
      const kg = randInt(1, 8);
      const dkg = randInt(5, 95);
      return {
        id: uid('unit'),
        kind: 'unit-conversion',
        topicId,
        title: 'Tömeg átváltása (kg és dkg → dkg)',
        instruction: 'Fejezd ki a tömeget dekagrammban!',
        category: 'tömeg',
        sourceText: `${kg} kg ${dkg} dkg`,
        targetUnit: 'dkg',
        exactResult: kg * 100 + dkg,
        hint: `1 kg = 100 dkg, így ${kg} kg ${dkg} dkg = ${kg * 100 + dkg} dkg.`,
      };
    }
    case 4: {
      const dkg = randInt(12, 95);
      return {
        id: uid('unit'),
        kind: 'unit-conversion',
        topicId,
        title: 'Tömeg átváltása (dkg → g)',
        instruction: 'Váltsd át a dekagrammot grammra!',
        category: 'tömeg',
        sourceText: `${dkg} dkg`,
        targetUnit: 'g',
        exactResult: dkg * 10,
        hint: `1 dkg = 10 g, tehát ${dkg} dkg = ${dkg * 10} g.`,
      };
    }
    case 5: {
      const l = randInt(2, 9);
      const dl = randInt(1, 9);
      return {
        id: uid('unit'),
        kind: 'unit-conversion',
        topicId,
        title: 'Űrtartalom átváltása (l és dl → dl)',
        instruction: 'Váltsd át a folyadékmennyiséget deciliterre!',
        category: 'űrtartalom',
        sourceText: `${l} l ${dl} dl`,
        targetUnit: 'dl',
        exactResult: l * 10 + dl,
        hint: `1 l = 10 dl, így ${l} l ${dl} dl = ${l * 10 + dl} dl.`,
      };
    }
    case 6: {
      const cl = randInt(15, 350);
      return {
        id: uid('unit'),
        kind: 'unit-conversion',
        topicId,
        title: 'Űrtartalom átváltása (cl → ml)',
        instruction: 'Fejezd ki a centilitert milliliterben!',
        category: 'űrtartalom',
        sourceText: `${cl} cl`,
        targetUnit: 'ml',
        exactResult: cl * 10,
        hint: `1 cl = 10 ml, így ${cl} cl = ${cl * 10} ml.`,
      };
    }
    case 7: {
      const sideCm = randInt(15, 220);
      return {
        id: uid('unit-perim'),
        kind: 'unit-conversion',
        topicId,
        title: 'Négyzet kerületének kiszámítása',
        instruction: `Egy négyzet alakú terítő minden oldala ${sideCm} cm. Hány centiméter szalag kell a körbeszegéséhez (mennyi a kerülete)?`,
        category: 'hosszúság',
        sourceText: `Négyzet oldala: a = ${sideCm} cm`,
        targetUnit: 'cm (kerület)',
        exactResult: sideCm * 4,
        hint: `A négyzet kerülete K = 4 · a = 4 · ${sideCm} cm = ${sideCm * 4} cm.`,
      };
    }
    case 8: {
      // OH-MAT04MB 110. o. 37. feladat: Sült hús tömegvesztesége
      const rawKg = randInt(1, 3);
      const rawDkg = rawKg * 100;
      const lostDkg = rawDkg / 5;
      const roastedDkg = rawDkg - lostDkg;
      return {
        id: uid('unit-meat'),
        kind: 'unit-conversion',
        topicId,
        title: 'Tömegmérés a konyhában – Sült hús',
        instruction: `A hús a sütés során elveszíti tömegének ötödrészét. Hány dekagramm sült hús lesz ${rawKg} kg (${rawDkg} dkg) nyers húsból?`,
        category: 'tömeg',
        sourceText: `${rawKg} kg nyers hús (-1/5 rész)`,
        targetUnit: 'dkg sült hús',
        exactResult: roastedDkg,
        hint: `${rawKg} kg = ${rawDkg} dkg. Az ötödrésze: ${rawDkg} : 5 = ${lostDkg} dkg veszteség. Marad: ${rawDkg} - ${lostDkg} = ${roastedDkg} dkg.`,
      };
    }
    case 9: {
      // OH-MAT04MB 109. o. 34/c: Óriáspanda bambuszfogyasztása
      const dailyKg = randInt(20, 25);
      const days = pickRandom([30, 100, 365]);
      const totalKg = dailyKg * days;
      return {
        id: uid('unit-panda'),
        kind: 'unit-conversion',
        topicId,
        title: 'Tömegszámítás – Az óriáspanda étvágya',
        instruction: `Egy óriáspanda naponta átlagosan ${dailyKg} kg bambuszt eszik meg. Hány kilogramm bambuszt fogyaszt el ${days} nap alatt?`,
        category: 'tömeg',
        sourceText: `${days} nap × ${dailyKg} kg/nap`,
        targetUnit: 'kg bambusz',
        exactResult: totalKg,
        hint: `Szorozd meg a napi adagot (${dailyKg} kg) a napok számával (${days}): ${dailyKg} · ${days} = ${totalKg} kg.`,
      };
    }
    default: {
      const a = randInt(4, 15);
      const b = randInt(3, 12);
      return {
        id: uid('unit-area'),
        kind: 'unit-conversion',
        topicId,
        title: 'Téglalap területének meghatározása',
        instruction: `Egy téglalap alakú szoba oldalai ${a} m és ${b} m hosszúak. Hány négyzetméter (1 m × 1 m-es egységnégyzet) a területe?`,
        category: 'hosszúság',
        sourceText: `Oldalak: a = ${a} m, b = ${b} m`,
        targetUnit: 'm² (egység)',
        exactResult: a * b,
        hint: `A téglalap területe: T = a · b = ${a} · ${b} = ${a * b}.`,
      };
    }
  }
}

// ==========================================
// 7. Negatív számok (I. kötet 82–87. o. + OH-MAT04MB 96–99., 109–110. o.)
// ==========================================
export function generateNegativeNumbers(topicId: string): NegativeNumbersExercise {
  const variant = randInt(0, 4);

  if (variant === 0) {
    const startTemp = randInt(-14, 12);
    const delta = randInt(4, 18);
    const isCooling = Math.random() > 0.45;
    const endTemp = isCooling ? startTemp - delta : startTemp + delta;

    return {
      id: uid('neg-temp'),
      kind: 'negative-numbers',
      topicId,
      title: 'Hőmérséklet-változás számítása',
      instruction: `A hőmérő reggel ${startTemp} °C-ot mutatott, estére pedig ${endTemp} °C-ra változott.`,
      subKind: 'temp-diff',
      questionText: `Hány °C-kal lett ${isCooling ? 'hidegebb (hűlt le)' : 'melegebb (emelkedett)'} a levegő?`,
      startTemp,
      endTemp,
      unit: '°C-kal',
      exactResult: delta,
      hint: `${startTemp} °C és ${endTemp} °C között a különbség ${delta} °C.`,
    };
  }

  if (variant === 1) {
    const morning = randInt(-12, -1);
    const warmUp = randInt(3, 10);
    const coolDown = randInt(4, 9);
    const evening = morning + warmUp - coolDown;

    return {
      id: uid('neg-calc'),
      kind: 'negative-numbers',
      topicId,
      title: 'Napi hőmérséklet alakulása',
      instruction: `Reggel ${morning} °C volt. Délig melegedett ${warmUp} °C-ot, majd déltől estig lehűlt ${coolDown} °C-ot.`,
      subKind: 'temp-change',
      questionText: 'Hány °C-ot mutatott a hőmérő este? (Negatív számnál írj mínuszjelet is!)',
      startTemp: morning,
      endTemp: evening,
      unit: '°C',
      exactResult: evening,
      hint: `Délben: ${morning} + ${warmUp} = ${morning + warmUp} °C. Este: ${
        morning + warmUp
      } - ${coolDown} = ${evening} °C.`,
    };
  }

  if (variant === 2) {
    // OH-MAT04MB 109. o. 34/b: Sivatagi teve hőmérséklet-tűrése
    const minCold = randInt(-30, -20);
    const diffRange = randInt(68, 82);
    const maxHeat = minCold + diffRange;

    return {
      id: uid('neg-camel'),
      kind: 'negative-numbers',
      topicId,
      title: 'A sivatagi teve hőmérséklet-tűrése',
      instruction: `A sivatagi teve jól tűri a szélsőséges időjárást: elviseli a ${minCold} °C-os hideget és az ennél ${diffRange} °C-kal melegebb hőséget is.`,
      subKind: 'temp-change',
      questionText: 'Hány °C a legnagyobb hőség, amit még elvisel a sivatagi teve?',
      startTemp: minCold,
      endTemp: maxHeat,
      unit: '°C',
      exactResult: maxHeat,
      hint: `A ${minCold} °C-tól 0 °C-ig ${Math.abs(minCold)} °C van, így ${diffRange} - ${Math.abs(
        minCold
      )} = ${maxHeat} °C.`,
    };
  }

  if (variant === 3) {
    // OH-MAT04MB 110. o. 35. feladat: Csütörtök-péntek-szombat éjszakai hőmérséklet
    const thursdayNight = randInt(-9, -2);
    const fridayDrop = randInt(2, 5);
    const saturdayRise = randInt(4, 9);
    const fridayNight = thursdayNight - fridayDrop;
    const saturdayNight = fridayNight + saturdayRise;

    return {
      id: uid('neg-forecast'),
      kind: 'negative-numbers',
      topicId,
      title: 'Háromnapos időjárás-előrejelzés',
      instruction: `Csütörtök éjszaka ${thursdayNight} °C-ot mértek. Péntek éjszaka ${fridayDrop} °C-kal hidegebb volt, majd szombat éjszakára a péntekihez képest ${saturdayRise} °C-kal enyhült az idő.`,
      subKind: 'temp-change',
      questionText: 'Hány °C volt szombat éjszaka?',
      startTemp: thursdayNight,
      endTemp: saturdayNight,
      unit: '°C',
      exactResult: saturdayNight,
      hint: `Péntek éjjel: ${thursdayNight} - ${fridayDrop} = ${fridayNight} °C. Szombat éjjel: ${fridayNight} + ${saturdayRise} = ${saturdayNight} °C.`,
    };
  }

  const savings = randInt(4, 15) * 50;
  const debt = randInt(15, 45) * 100;
  const needed = debt - savings;

  return {
    id: uid('neg-debt'),
    kind: 'negative-numbers',
    topicId,
    title: 'Vagyon és tartozás',
    instruction: `A malacperselyben ${savings} Ft megtakarításunk van, de ki kell egyenlítenünk egy ${debt} Ft-os tartozást (-${debt} Ft).`,
    subKind: 'debt',
    questionText: `Mennyi pénzt kell még gyűjtenünk a ${savings} Ft-hoz, hogy a tartozást teljesen kifizessük (0 Ft-ra jussunk)?`,
    unit: 'Ft',
    exactResult: needed,
    hint: `${debt} Ft - ${savings} Ft = ${needed} Ft-ot kell még összegyűjteni.`,
  };
}

// ==========================================
// 8. Római számok (I. kötet 19. o.)
// ==========================================
export function generateRomanNumerals(topicId: string): RomanNumeralsExercise {
  const num = randInt(4, 49);
  const roman = toRoman(num);
  const direction = Math.random() > 0.5 ? 'roman-to-arabic' : 'arabic-to-roman';

  if (direction === 'roman-to-arabic') {
    return {
      id: uid('roman'),
      kind: 'roman-numerals',
      topicId,
      title: 'Római számok átváltása arab számra',
      instruction: 'Írd le arab számjegyekkel a megadott római számot!',
      direction,
      promptValue: `${roman}.`,
      exactAnswer: String(num),
      hint: `I = 1, V = 5, X = 10, L = 50. A(z) ${roman} értéke arab számmal: ${num}.`,
    };
  }

  return {
    id: uid('roman'),
    kind: 'roman-numerals',
    topicId,
    title: 'Arab számok leírása római számjegyekkel',
    instruction: 'Írd le római számjegyekkel a megadott számot (nagybetűkkel, pont nélkül)!',
    direction,
    promptValue: String(num),
    exactAnswer: roman,
    hint: `I = 1, IV = 4, V = 5, IX = 9, X = 10, XL = 40, L = 50. A helyes válasz: ${roman}.`,
  };
}

// ==========================================
// 9. Törtszámok (II. kötet 66–71. o. + OH-MAT04MB 110. o.)
// ==========================================
export function generateFractionsExercise(topicId: string): Exercise {
  // 30% chance to generate a multi-step fraction word problem from OH-MAT04MB
  if (Math.random() < 0.3) {
    const wordVar = randInt(0, 1);
    if (wordVar === 0) {
      // OH-MAT04MB 110. o. 38. feladat: Testvérek osztoznak a cukorkán
      const totalCandies = pickRandom([24, 30, 36, 42, 48]);
      const oldestShare = totalCandies / 2;
      const middleShare = totalCandies / 3;
      const youngestShare = totalCandies - oldestShare - middleShare;
      return {
        id: uid('frac-candies'),
        kind: 'word-problem',
        topicId,
        title: 'Törtrész szöveges feladat – Testvérek osztoznak',
        instruction: 'Számítsd ki külön a felét és a harmadát, majd vond ki őket az összesből!',
        story: `Három testvér osztozik ${totalCandies} szem cukorkán. A legidősebb kapja a cukorkák felét, a középső a cukorkák harmadát, a legkisebb testvér pedig a maradékot.`,
        question: 'Hány szem cukorkát kap a legkisebb testvér?',
        unit: 'szem',
        exactResult: youngestShare,
        solutionSteps: `Fele: ${totalCandies} : 2 = ${oldestShare}. Harmada: ${totalCandies} : 3 = ${middleShare}. Maradék: ${totalCandies} - ${oldestShare} - ${middleShare} = ${youngestShare} szem.`,
        hint: `A fele ${oldestShare} szem, a harmada ${middleShare} szem. Kettőjüknek együtt ${
          oldestShare + middleShare
        } jut, a többi a legkisebbé!`,
      };
    }

    // OH-MAT04MB 110. o. 39. feladat: Alvás és álmodás (24 óra vagy 12 év alatt)
    const years = pickRandom([12, 24, 36, 60]);
    const sleepYears = years / 3;
    const dreamYears = sleepYears / 4;
    return {
      id: uid('frac-sleep'),
      kind: 'word-problem',
      topicId,
      title: 'Törtrész szöveges feladat – Alvás és álmodás',
      instruction: 'Először számítsd ki az idő harmadát, majd a kapott eredmény negyedét!',
      story: `A kutatók szerint az ember az élete során az idő harmadát átalussza, és az alvással töltött idő negyedében álmodik.`,
      question: `Hány évet tölt álmodással egy ember ${years} év alatt?`,
      unit: 'év',
      exactResult: dreamYears,
      solutionSteps: `Alvás (harmada): ${years} : 3 = ${sleepYears} év. Álmodás (az alvás negyede): ${sleepYears} : 4 = ${dreamYears} év.`,
      hint: `${years} év harmada ${sleepYears} év alvás. Ennek a negyede: ${sleepYears} : 4 = ${dreamYears} év.`,
    };
  }

  const denomOptions: { d: number; singular: string; plural: string }[] = [
    { d: 2, singular: 'fele', plural: 'fele' },
    { d: 3, singular: 'harmada', plural: 'harmada' },
    { d: 4, singular: 'negyede', plural: 'negyede' },
    { d: 5, singular: 'ötöde', plural: 'ötöde' },
    { d: 6, singular: 'hatoda', plural: 'hatoda' },
    { d: 8, singular: 'nyolcada', plural: 'nyolcada' },
    { d: 10, singular: 'tizede', plural: 'tizede' },
  ];

  const chosen = pickRandom(denomOptions);
  const isUnitFraction = Math.random() > 0.5;
  const numerator = isUnitFraction ? 1 : randInt(2, chosen.d - 1);

  const units = [
    { unit: 'Ft', multiplier: randInt(2, 12) * 10 },
    { unit: 'cm', multiplier: randInt(4, 25) * 2 },
    { unit: 'db', multiplier: randInt(3, 18) },
    { unit: 'm', multiplier: randInt(5, 40) * 5 },
  ];
  const u = pickRandom(units);
  const wholeValue = chosen.d * u.multiplier;
  const onePart = wholeValue / chosen.d;
  const exactResult = onePart * numerator;

  const denominatorLabel =
    numerator === 1 && chosen.d === 2
      ? 'fele'
      : `${numerator} ${chosen.singular}`;

  return {
    id: uid('fraction'),
    kind: 'fractions',
    topicId,
    title: isUnitFraction
      ? 'Mennyiség egységtört részének kiszámítása'
      : 'Mennyiség többszörös törtrészének kiszámítása',
    instruction:
      'Először számítsd ki az 1 törtrészt osztással, majd szorozd meg a számlálóval!',
    wholeValue,
    wholeUnit: u.unit,
    numerator,
    denominator: chosen.d,
    denominatorLabel,
    exactResult,
    hint: `1 ${chosen.singular}: ${wholeValue} : ${chosen.d} = ${onePart} ${u.unit}. ${
      numerator > 1
        ? `${numerator} ${chosen.singular}: ${onePart} · ${numerator} = ${exactResult} ${u.unit}.`
        : `Így az eredmény: ${exactResult} ${u.unit}.`
    }`,
  };
}

// ==========================================
// 10. Síkidomok, sokszögek, kör és testek (II. kötet 24–51. o. + OH-MAT04MB 111. o.)
// ==========================================
export function generateGeometrySolidsExercise(topicId: string): WordProblemExercise {
  const variant = randInt(0, 5);

  switch (variant) {
    case 0: {
      // Kocka éleinek összege (testháló és élek - II. kötet 31-35. o.)
      const edgeCm = randInt(4, 25);
      const totalEdges = edgeCm * 12;
      return {
        id: uid('geom-cube'),
        kind: 'word-problem',
        topicId,
        title: 'A kocka tulajdonságai és élei',
        instruction: 'Gondold át, hány egyenlő hosszú éle van egy kockának!',
        story: `Drótból szeretnénk elkészíteni egy ${edgeCm} cm élhosszúságú kocka vázát. (A kockának 6 lapja, 8 csúcsa és 12 egyenlő hosszú éle van.)`,
        question: 'Hány centiméter drótra van szükségünk összesen a 12 él megépítéséhez?',
        unit: 'cm',
        exactResult: totalEdges,
        solutionSteps: `12 · ${edgeCm} cm = ${totalEdges} cm`,
        hint: `A kockának 12 egyforma éle van, ezért: 12 · ${edgeCm} = ${totalEdges} cm.`,
      };
    }
    case 1: {
      // Kör sugara (körzőnyílás) és átmérője / teniszlabdák doboza (II. kötet 29–34. o.)
      const radiusMm = randInt(18, 65);
      const countBalls = randInt(3, 6);
      const diameterMm = radiusMm * 2;
      const boxLength = diameterMm * countBalls;
      return {
        id: uid('geom-circle'),
        kind: 'word-problem',
        topicId,
        title: 'Kör és gömb – Labdák tárolódoboza',
        instruction: 'Figyelj a sugár (körzőnyílás) és a teljes szélesség (átmérő) kapcsolatára!',
        story: `Egy labda szélessége (átmérője) ${diameterMm} mm. Egy hosszúkás tárolódobozba szorosan egymás mellé egy sorba ${countBalls} darab ilyen labdát teszünk.`,
        question: 'Legalább hány milliméter hosszú legyen a tárolódoboz?',
        unit: 'mm',
        exactResult: boxLength,
        solutionSteps: `${countBalls} · ${diameterMm} mm = ${boxLength} mm`,
        hint: `Szorozd meg egy labda szélességét (${diameterMm} mm) a labdák számával (${countBalls})!`,
      };
    }
    case 2: {
      // Téglatest lapjai, élei, csúcsai (II. kötet 31–33. o.)
      const a = randInt(5, 15);
      const b = randInt(4, 12);
      const c = randInt(3, 10);
      const sumEdges = 4 * (a + b + c);
      return {
        id: uid('geom-cuboid'),
        kind: 'word-problem',
        topicId,
        title: 'Téglatest éleinek hossza',
        instruction: 'A téglatestnek 12 éle van: 4-4 darab az a, b és c hosszúságú élekből!',
        story: `Egy téglatest alakú díszdoboz három különböző élének hossza: a = ${a} cm, b = ${b} cm és c = ${c} cm. Minden élére színes zsinórt ragasztunk.`,
        question: 'Hány centiméter zsinórra van szükség a téglatest mind a 12 élére összesen?',
        unit: 'cm',
        exactResult: sumEdges,
        solutionSteps: `4 · ${a} + 4 · ${b} + 4 · ${c} = ${4 * a} + ${4 * b} + ${4 * c} = ${sumEdges} cm`,
        hint: `Minden élhosszúságból 4 darab van: 4 · (${a} + ${b} + ${c}) = 4 · ${
          a + b + c
        } = ${sumEdges} cm.`,
      };
    }
    case 3: {
      // Sokszögek csúcsai és oldalai (II. kötet 24–27. o.)
      const triangles = randInt(3, 8);
      const visQuads = randInt(2, 6);
      const hexas = randInt(2, 5);
      const totalSides = triangles * 3 + visQuads * 4 + hexas * 6;
      return {
        id: uid('geom-polygons'),
        kind: 'word-problem',
        topicId,
        title: 'Síkidomok és sokszögek oldalai',
        instruction: 'Számold össze a sokszögek oldalait!',
        story: `Egy mozaikkép kirakásához felhasználtunk ${triangles} db háromszöget, ${visQuads} db négyszöget és ${hexas} db hatszöget (melyek nem érnek össze).`,
        question: 'Hány oldala van ezeknek a síkidomoknak összesen?',
        unit: 'oldal',
        exactResult: totalSides,
        solutionSteps: `${triangles} · 3 + ${visQuads} · 4 + ${hexas} · 6 = ${
          triangles * 3
        } + ${visQuads * 4} + ${hexas * 6} = ${totalSides}`,
        hint: `Háromszögek: ${triangles}·3=${triangles * 3}, négyszögek: ${visQuads}·4=${
          visQuads * 4
        }, hatszögek: ${hexas}·6=${hexas * 6}. Add össze őket!`,
      };
    }
    case 4: {
      // OH-MAT04MB 111. o. 47. feladat: Tábla csokoládé belső és szélső kockái
      const rows = randInt(4, 6);
      const cols = randInt(6, 9);
      const totalSquares = rows * cols;
      const innerSquares = (rows - 2) * (cols - 2);
      const borderSquares = totalSquares - innerSquares;
      return {
        id: uid('geom-choco'),
        kind: 'word-problem',
        topicId,
        title: 'Téglalap és négyzetháló – Tábla csokoládé',
        instruction: 'Képzeld el a tábla csokoládét négyzethálóként, vagy számold ki a belső kockák számát!',
        story: `Egy téglalap alakú tábla csokoládé ${rows} sorból és soronként ${cols} négyzet alakú csokikockából áll (összesen ${totalSquares} kocka).`,
        question: 'Hány csokikocka helyezkedik el közvetlenül a tábla csokoládé szélén?',
        unit: 'db kocka',
        exactResult: borderSquares,
        solutionSteps: `Összesen: ${rows} · ${cols} = ${totalSquares}. Belső kockák: ${
          rows - 2
        } · ${cols - 2} = ${innerSquares}. Szélső kockák: ${totalSquares} - ${innerSquares} = ${borderSquares} db.`,
        hint: `A belső (nem szélső) rész ${rows - 2} × ${
          cols - 2
        } = ${innerSquares} kockából áll. Vond ki ezt az összes (${totalSquares}) kockából!`,
      };
    }
    default: {
      // Nagyítás / kicsinyítés négyzethálón (II. kötet 39. o.)
      const origA = randInt(3, 9);
      const origB = randInt(4, 11);
      const scale = randInt(2, 3);
      const newPerim = 2 * (origA * scale + origB * scale);
      return {
        id: uid('geom-scale'),
        kind: 'word-problem',
        topicId,
        title: 'Nagyítás és kicsinyítés',
        instruction: `Ha egy alakzatot ${scale}-szeresére nagyítunk, minden oldala a ${scale}-szeresére nő!`,
        story: `Egy négyzethálóra rajzolt téglalap oldalai ${origA} cm és ${origB} cm hosszúak. A rajzot ${scale}-szeresére nagyítjuk.`,
        question: 'Hány centiméter lesz a felnagyított téglalap kerülete?',
        unit: 'cm',
        exactResult: newPerim,
        solutionSteps: `Új oldalak: ${origA * scale} cm és ${
          origB * scale
        } cm. Kerület: 2 · (${origA * scale} + ${origB * scale}) = ${newPerim} cm.`,
        hint: `A nagyított oldalak ${origA * scale} cm és ${
          origB * scale
        } cm. Kerülete: 2 · (${origA * scale} + ${origB * scale}) = ${newPerim} cm.`,
      };
    }
  }
}

// ==========================================
// 11. Az idő mérése (II. kötet 72–83. o. + OH-MAT04MB 109. o.)
// ==========================================
export function generateTimeMeasurementExercise(topicId: string): Exercise {
  const variant = randInt(0, 6);

  if (variant === 0) {
    // másodperc -> perc (II. kötet 78. o. 2. feladat)
    const mins = pickRandom([2, 3, 5, 8, 9, 12, 15, 25, 40, 60, 90]);
    const secs = mins * 60;
    return {
      id: uid('time-sec-min'),
      kind: 'unit-conversion',
      topicId,
      title: 'Időmértékegységek átváltása (másodperc → perc)',
      instruction: 'Váltsd át a másodpercben megadott időtartamot percre! (1 perc = 60 másodperc)',
      category: 'idő',
      sourceText: `${secs} másodperc`,
      targetUnit: 'perc',
      exactResult: mins,
      hint: `1 perc = 60 másodperc, ezért ${secs} : 60 = ${mins} perc.`,
    };
  }

  if (variant === 1) {
    // perc -> másodperc
    const mins = randInt(4, 35);
    const secs = mins * 60;
    return {
      id: uid('time-min-sec'),
      kind: 'unit-conversion',
      topicId,
      title: 'Időmértékegységek átváltása (perc → másodperc)',
      instruction: 'Váltsd át a percet másodpercre!',
      category: 'idő',
      sourceText: `${mins} perc`,
      targetUnit: 'másodperc',
      exactResult: secs,
      hint: `1 perc = 60 másodperc, így ${mins} · 60 = ${secs} másodperc.`,
    };
  }

  if (variant === 2) {
    // óra és perc -> perc
    const hours = randInt(2, 8);
    const extraMins = randInt(1, 11) * 5;
    const totalMins = hours * 60 + extraMins;
    return {
      id: uid('time-hr-min'),
      kind: 'unit-conversion',
      topicId,
      title: 'Időmértékegységek átváltása (óra és perc → perc)',
      instruction: 'Számítsd ki, hány perc összesen a megadott időtartam!',
      category: 'idő',
      sourceText: `${hours} óra ${extraMins} perc`,
      targetUnit: 'perc',
      exactResult: totalMins,
      hint: `1 óra = 60 perc, tehát ${hours} · 60 + ${extraMins} = ${hours * 60} + ${extraMins} = ${totalMins} perc.`,
    };
  }

  if (variant === 3) {
    // Állatkerti látogatás / tanulási időtartam (II. kötet 74–78. o.)
    const startH = randInt(8, 15);
    const startM = pickRandom([10, 15, 20, 25, 30, 40, 45]);
    const durationMins = randInt(35, 135);
    const totalEndMins = startH * 60 + startM + durationMins;
    const endH = Math.floor(totalEndMins / 60);
    const endM = totalEndMins % 60;

    const fmt = (h: number, m: number) =>
      `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;

    return {
      id: uid('time-duration'),
      kind: 'word-problem',
      topicId,
      title: 'Időtartam kiszámítása',
      instruction: 'Számítsd ki, hány perc telt el a kezdés és a befejezés között!',
      story: `Az állatkerti látogatás során a gyerekek ${fmt(
        startH,
        startM
      )}-kor érkeztek a látványetetésre, és ${fmt(endH, endM)}-kor indultak tovább.`,
      question: 'Hány percet töltöttek a látványetetés helyszínén összesen?',
      unit: 'perc',
      exactResult: durationMins,
      solutionSteps: `${fmt(startH, startM)}-tól ${fmt(endH, endM)}-ig összesen ${durationMins} perc telt el.`,
      hint: `Számold ki, hány perc kell a következő egész óráig (${60 - startM} perc), majd add hozzá a további perceket!`,
    };
  }

  if (variant === 4) {
    // OH-MAT04MB 109. o. 34/a: Strucctojás főzési ideje
    const quarterHours = pickRandom([
      { label: 'fél óráig (30 percig)', mins: 30 },
      { label: 'háromnegyed óráig (45 percig)', mins: 45 },
      { label: 'negyed óráig (15 percig)', mins: 15 },
    ]);
    const totalSecs = quarterHours.mins * 60;
    return {
      id: uid('time-ostrich'),
      kind: 'word-problem',
      topicId,
      title: 'Időmérés – Strucctojás főzése',
      instruction: 'Váltsd át a perceket másodpercre (1 perc = 60 másodperc)!',
      story: `Egy hatalmas strucctojást keményre főzni ${quarterHours.label} tart.`,
      question: 'Hány másodpercig kell főzni a strucctojást?',
      unit: 'másodperc',
      exactResult: totalSecs,
      solutionSteps: `${quarterHours.mins} perc · 60 = ${totalSecs} másodperc`,
      hint: `1 perc = 60 másodperc, ezért szorozd meg a ${quarterHours.mins} percet 60-nal!`,
    };
  }

  if (variant === 5) {
    // OH-MAT04MB 109. o. 34/d: Aranyfácán fiókái (hetek -> órák)
    const weeks = randInt(1, 3);
    const days = weeks * 7;
    const totalHours = days * 24;
    return {
      id: uid('time-pheasant'),
      kind: 'word-problem',
      topicId,
      title: 'Időmérés – Az aranyfácán fiókái',
      instruction: '1 hét = 7 nap, és 1 nap = 24 óra!',
      story: `Az aranyfácán fiókái nagyon gyorsan fejlődnek: ${weeks} hetes korukban már önállóan repülnek.`,
      question: `Hány órás korukban tudnak már repülni (${weeks} hét hány óra)?`,
      unit: 'óra',
      exactResult: totalHours,
      solutionSteps: `${weeks} hét = ${days} nap. ${days} · 24 óra = ${totalHours} óra.`,
      hint: `${weeks} hét az ${days} nap. Szorozd meg a ${days}-et 24-gyel!`,
    };
  }

  // Napok és hetek (II. kötet 72. o.)
  const weeks = randInt(4, 16);
  const extraDays = randInt(1, 6);
  const totalDays = weeks * 7 + extraDays;
  return {
    id: uid('time-weeks'),
    kind: 'unit-conversion',
    topicId,
    title: 'Hetek és napok átváltása',
    instruction: 'Fejezd ki napokban a megadott időtartamot! (1 hét = 7 nap)',
    category: 'idő',
    sourceText: `${weeks} hét ${extraDays} nap`,
    targetUnit: 'nap',
    exactResult: totalDays,
    hint: `1 hét = 7 nap, így ${weeks} · 7 + ${extraDays} = ${weeks * 7} + ${extraDays} = ${totalDays} nap.`,
  };
}

// ==========================================
// 12. Mindennapi pénzügyeink, kombinatorika, halmazok & Rendszerezés
//     (II. kötet 84–103. o. + OH-MAT04MB 100., 111. o.)
// ==========================================
export function generateFinancialExercise(topicId: string): WordProblemExercise {
  const variant = randInt(0, 7);

  switch (variant) {
    case 0: {
      // Bence zsebpénze a táborban (II. kötet 96. o. 1. feladat)
      const pocketMoney = pickRandom([6000, 8000, 10000]);
      const dailyLimit = pickRandom([450, 500, 650, 750, 800]);
      const days = 7;
      const spent = dailyLimit * days;
      const remaining = pocketMoney - spent;
      return {
        id: uid('fin-camp'),
        kind: 'word-problem',
        topicId,
        title: 'Mindennapi pénzügyeink – Tábori zsebpénz',
        instruction: 'Számítsd ki az egyhetes (7 napos) költést, majd a megmaradt összeget!',
        story: `Bence ${pocketMoney} Ft zsebpénzt kapott a szüleitől. Elhatározta, hogy az egyhetes (7 napos) tábor alatt naponta legfeljebb ${dailyLimit} Ft-ot fog költeni, a többit félreteszi görkorcsolyára.`,
        question: 'Legalább hány forintja maradt a tábor után Bencének, ha betartotta a tervét?',
        unit: 'Ft',
        exactResult: remaining,
        solutionSteps: `Költés: 7 · ${dailyLimit} = ${spent} Ft. Maradt: ${pocketMoney} - ${spent} = ${remaining} Ft.`,
        hint: `7 nap alatt 7 · ${dailyLimit} = ${spent} Ft-ot költött el. Vond ki ezt a ${pocketMoney} Ft-ból!`,
      };
    }
    case 1: {
      // 6 darabos vs 12 darabos készlet (II. kötet 96. o. 2. feladat)
      const sixPackPrice = randInt(580, 790);
      const twelvePackPrice = sixPackPrice * 2 - randInt(110, 260);
      const savings = sixPackPrice * 2 - twelvePackPrice;
      return {
        id: uid('fin-pencils'),
        kind: 'word-problem',
        topicId,
        title: 'Mindennapi pénzügyeink – Tudatos vásárlás',
        instruction: 'Hasonlítsd össze két 6 darabos csomag árát egy 12 darabos csomag árával!',
        story: `Dóra az üzletben színes ceruzákat nézegetett. A 6 darabos készlet ára ${sixPackPrice} Ft, a 12 darabos készlet ára pedig ${twelvePackPrice} Ft.`,
        question:
          'Hány forintot takarít meg Dóra 12 darab ceruza vásárlásakor, ha két 6 darabos helyett a nagy (12 darabos) csomagot választja?',
        unit: 'Ft',
        exactResult: savings,
        solutionSteps: `Két 6 darabos ára: 2 · ${sixPackPrice} = ${
          sixPackPrice * 2
        } Ft. Megtakarítás: ${sixPackPrice * 2} - ${twelvePackPrice} = ${savings} Ft.`,
        hint: `2 darab 6-os csomag ára: 2 · ${sixPackPrice} = ${
          sixPackPrice * 2
        } Ft. Vond ki belőle a ${twelvePackPrice} Ft-ot!`,
      };
    }
    case 2: {
      // Családi strandbelépő vs külön jegyek (II. kötet 103. o. 12. feladat)
      const adultTicket = pickRandom([1200, 1400, 1600]);
      const studentTicket = pickRandom([800, 900, 1000]);
      const childrenCount = randInt(2, 3);
      const separateTotal = 2 * adultTicket + childrenCount * studentTicket;
      const familyTicket = separateTotal - randInt(600, 1300);
      const saved = separateTotal - familyTicket;

      return {
        id: uid('fin-beach'),
        kind: 'word-problem',
        topicId,
        title: 'Mindennapi pénzügyeink – Családi strandbelépő',
        instruction: 'Számítsd ki, mennyibe kerülnének a jegyek külön-külön, és hasonlítsd össze a családi jeggyel!',
        story: `A strandon a napi felnőttbelépő ${adultTicket} Ft, a diákbelépő ${studentTicket} Ft, a családi belépő (2 felnőtt és a gyerekek részére) pedig ${familyTicket} Ft. A két szülő ${childrenCount} iskoláskorú gyermekével érkezik.`,
        question: 'Hány forintot spórol a család, ha külön jegyek helyett családi belépőt váltanak?',
        unit: 'Ft',
        exactResult: saved,
        solutionSteps: `Külön jegyek: 2 · ${adultTicket} + ${childrenCount} · ${studentTicket} = ${separateTotal} Ft. Megtakarítás: ${separateTotal} - ${familyTicket} = ${saved} Ft.`,
        hint: `Külön-külön: 2 · ${adultTicket} + ${childrenCount} · ${studentTicket} = ${separateTotal} Ft. Vond ki belőle a ${familyTicket} Ft-os családi jegyet!`,
      };
    }
    case 3: {
      // OH-MAT04MB 111. o. 44. feladat: Sakkverseny körmérkőzés (kombinatorika)
      const players = randInt(4, 8);
      const matches = (players * (players - 1)) / 2;
      return {
        id: uid('comb-chess'),
        kind: 'word-problem',
        topicId,
        title: 'Rendszerezés és kombinatorika – Sakkverseny',
        instruction: 'Vigyázz: ha két gyerek már játszott egymással, azt a párost nem számoljuk kétszer!',
        story: `Az iskolai sakkversenyen ${players} gyerek vesz részt. Mindenki mindenkivel pontosan egy játszmát játszik.`,
        question: 'Hány játszma lesz a versenyen összesen?',
        unit: 'játszma',
        exactResult: matches,
        solutionSteps: `${players} · ${players - 1} : 2 = ${matches} játszma`,
        hint: `Mindenki ${players - 1} ellenféllel játszik, de minden meccset kétszer számolnánk: (${players} · ${
          players - 1
        }) : 2 = ${matches}.`,
      };
    }
    case 4: {
      // OH-MAT04MB 111. o. 45. feladat: Kétgombócos fagylalt kombinációk
      const flavors = randInt(4, 7);
      const combinations = (flavors * (flavors - 1)) / 2;
      return {
        id: uid('comb-icecream'),
        kind: 'word-problem',
        topicId,
        title: 'Kombinatorika – Fagylaltválasztás',
        instruction: 'A két különböző gombóc sorrendje most nem számít!',
        story: `A cukrászdában ${flavors}-féle fagylaltból lehet választani. Kétgombócos fagylaltot szeretnénk kérni két különböző ízből.`,
        question: 'Hányféle kétgombócos fagylaltot állíthatunk össze, ha a gombócok sorrendje nem számít?',
        unit: '-féle',
        exactResult: combinations,
        solutionSteps: `${flavors} · ${flavors - 1} : 2 = ${combinations}`,
        hint: `Az első gombóc ${flavors}-féle, a második ${
          flavors - 1
        }-féle lehet, és mivel a sorrend nem számít, osztjuk 2-vel: ${combinations}.`,
      };
    }
    case 5: {
      // OH-MAT04MB 111. o. 46. feladat: Halmazok – Sportolók az osztályban
      const both = randInt(4, 8);
      const swimmersTotal = both + randInt(5, 10);
      const cyclistsTotal = both + randInt(6, 11);
      const neither = randInt(2, 5);
      const classSize = swimmersTotal + cyclistsTotal - both + neither;
      return {
        id: uid('sets-sports'),
        kind: 'word-problem',
        topicId,
        title: 'Halmazok és logika – Sportolók az osztályban',
        instruction: 'Ügyelj azokra a gyerekekre, akik mindkét sportot űzik (őket ne számold duplán)!',
        story: `Egy osztályban ${swimmersTotal} gyerek jár úszni, ${cyclistsTotal} gyerek szokott kerékpározni. Közülük ${both} tanuló mindkét sportot űzi, ${neither} gyerek pedig egyiket sem.`,
        question: 'Hány tanuló jár ebbe az osztályba összesen?',
        unit: 'fő',
        exactResult: classSize,
        solutionSteps: `Csak úszik: ${swimmersTotal - both}, csak kerékpározik: ${
          cyclistsTotal - both
        }, mindkettő: ${both}, egyik sem: ${neither}. Összesen: ${classSize} fő.`,
        hint: `Add össze az úszókat (${swimmersTotal}) és kerékpározókat (${cyclistsTotal}), vond ki a közös részt (${both}), majd add hozzá a ${neither} főt!`,
      };
    }
    case 6: {
      // OH-MAT04MB 100. o. 1–3. feladat: Esélylatolgatás dobókockával
      const diceCount = randInt(2, 4);
      const minSum = diceCount * 1;
      const maxSum = diceCount * 6;
      const sumDiff = maxSum - minSum;
      return {
        id: uid('prob-dice'),
        kind: 'word-problem',
        topicId,
        title: 'Valószínűség és esélylatolgatás – Dobókockák',
        instruction: 'Egy szabályos dobókockán a legkisebb pöttyök száma 1, a legnagyobb 6!',
        story: `Egyszerre feldobunk ${diceCount} darab szabályos dobókockát, majd összeadjuk a felülre került pöttyök számát.`,
        question: `Mennyi a különbség a dobható legnagyobb és legkisebb összeg között (${diceCount} kockával)?`,
        unit: '',
        exactResult: sumDiff,
        solutionSteps: `Legnagyobb összeg: ${diceCount} · 6 = ${maxSum}. Legkisebb összeg: ${diceCount} · 1 = ${minSum}. Különbség: ${maxSum} - ${minSum} = ${sumDiff}.`,
        hint: `Legtöbb pötty: ${diceCount}·6 = ${maxSum}, legkevesebb: ${diceCount}·1 = ${minSum}. Vond ki őket egymásból!`,
      };
    }
    default: {
      // Cili néni ökozacskói - hány darabot kell készíteni? (II. kötet 102. o. 11. feladat)
      const profitPerBag = pickRandom([250, 400, 500]);
      const targetAmount = pickRandom([6000, 8000, 10000]);
      const bagsNeeded = targetAmount / profitPerBag;
      return {
        id: uid('fin-ecobag'),
        kind: 'word-problem',
        topicId,
        title: 'Mindennapi pénzügyeink – Bevétel és haszon',
        instruction: 'Számítsd ki osztással, hány darabot kell elkészíteni a célösszeghez!',
        story: `Cili néni környezetbarát kenyértartó zsákokat varr. Összeszámolta, hogy minden egyes zsák eladásakor ${profitPerBag} Ft tiszta haszna keletkezik.`,
        question: `Hány zsákot kell elkészítenie és eladnia, ha ${targetAmount} Ft-ot szeretne összegyűjteni?`,
        unit: 'db',
        exactResult: bagsNeeded,
        solutionSteps: `${targetAmount} : ${profitPerBag} = ${bagsNeeded} db`,
        hint: `Oszd el a ${targetAmount} Ft-ot ${profitPerBag} Ft-tal!`,
      };
    }
  }
}

// ==========================================
// 13. Szöveges feladatok, számszomszéd-pótlás & Műveleti sorrend
//     (I. kötet + OH-MAT04MB 4–5., 25., 41., 56., 70., 110. o.)
// ==========================================
export function generateWordProblem(
  topicId: string,
  maxRange: 1000 | 10000 = 10000
): WordProblemExercise {
  if (maxRange === 1000) {
    const subVariant = randInt(0, 4);
    if (subVariant === 0) {
      const a = randInt(120, 250);
      const b = randInt(2, 4);
      const c = randInt(110, 220);
      const res = a * b - c;
      return {
        id: uid('word-order-1000'),
        kind: 'word-problem',
        topicId,
        title: 'Műveletek sorrendje (1000-ig)',
        instruction: 'Ügyelj a műveletek helyes sorrendjére! Először a szorzást végezd el!',
        story: `Számítsd ki az alábbi műveletsor eredményét:  ${a} · ${b} - ${c} = ?`,
        question: 'Mennyi a műveletsor eredménye?',
        unit: '',
        exactResult: res,
        solutionSteps: `${a} · ${b} - ${c} = ${a * b} - ${c} = ${res}`,
        hint: `Először szorzunk: ${a} · ${b} = ${a * b}, majd kivonjuk a ${c}-t: ${res}.`,
      };
    }
    if (subVariant === 1) {
      const firstPond = randInt(380, 560);
      const diff = randInt(150, 280);
      const secondPond = firstPond - diff;
      const thirdPond = firstPond + secondPond;
      return {
        id: uid('word-pond'),
        kind: 'word-problem',
        topicId,
        title: 'Szöveges feladat – Halgazdaság',
        instruction: 'Olvasd el figyelmesen a szöveget, és számítsd ki a választ!',
        story: `A halgazdaság egyik tavába ${firstPond} halivadékot telepítettek, a másikba ${diff}-val kevesebbet. A harmadik tóba az előző kettő összegét telepítették.`,
        question: 'Hány halivadékot telepítettek a harmadik tóba?',
        unit: 'db',
        exactResult: thirdPond,
        solutionSteps: `Második tó: ${firstPond} - ${diff} = ${secondPond}. Harmadik tó: ${firstPond} + ${secondPond} = ${thirdPond}.`,
        hint: `Először számold ki a második tavat (${firstPond} - ${diff} = ${secondPond}), majd add hozzá az elsőhöz!`,
      };
    }
    if (subVariant === 2) {
      // OH-MAT04MB 5. o. 3–4. feladat: Pótlás a nagyobb százas számszomszédra
      const num = randInt(112, 889);
      const nextHundred = (Math.floor(num / 100) + 1) * 100;
      const diff = nextHundred - num;
      return {
        id: uid('word-neighbor-1000'),
        kind: 'word-problem',
        topicId,
        title: 'Pótlás a nagyobb százas számszomszédra',
        instruction: 'Állapítsd meg a szám nagyobb százas számszomszédját, majd pótold addig!',
        story: `A(z) ${num} számhoz hozzáadunk egy számot úgy, hogy pontosan a nagyobb százas számszomszédját (${nextHundred}-at) kapjuk:  ${num} + □ = ${nextHundred}`,
        question: 'Melyik szám kerül a □ helyére?',
        unit: '',
        exactResult: diff,
        solutionSteps: `${nextHundred} - ${num} = ${diff}`,
        hint: `A(z) ${num} nagyobb százas számszomszédja a ${nextHundred}. Vond ki belőle a ${num}-t!`,
      };
    }
    if (subVariant === 3) {
      // OH-MAT04MB 110. o. 36. feladat: Csiga Csaba és barátja találkozása
      const speedA = randInt(3, 6);
      const speedB = randInt(5, 9);
      const hours = randInt(4, 9);
      const totalDist = (speedA + speedB) * hours;
      return {
        id: uid('word-snail'),
        kind: 'word-problem',
        topicId,
        title: 'Szöveges feladat – Csiga Csaba találkozója',
        instruction: 'Számítsd ki, hány centimétert közelednek egymáshoz 1 óra alatt!',
        story: `Csiga Csaba és barátja ${totalDist} cm távolságra vannak egymástól. Egyszerre indulnak el egymással szemben: Csaba óránként ${speedA} cm, barátja pedig óránként ${speedB} cm utat tesz meg.`,
        question: 'Hány óra múlva találkoznak?',
        unit: 'óra',
        exactResult: hours,
        solutionSteps: `1 óra alatt: ${speedA} + ${speedB} = ${
          speedA + speedB
        } cm. Találkozás: ${totalDist} : ${speedA + speedB} = ${hours} óra.`,
        hint: `Egy óra alatt együtt ${speedA} + ${speedB} = ${
          speedA + speedB
        } cm-t tesznek meg. Oszd el ezzel a ${totalDist} cm-t!`,
      };
    }

    const distToShore = randInt(420, 750);
    const pierLength = randInt(45, 125);
    const totalWalk = distToShore + pierLength;
    return {
      id: uid('word-pier'),
      kind: 'word-problem',
      topicId,
      title: 'Szöveges feladat – Horgásztanya',
      instruction: 'Készíts tervet és számítsd ki a választ!',
      story: `Pista bácsi horgásztanyája a tó partjától ${distToShore} m távolságra van, ahol egy ${pierLength} m hosszú stég található.`,
      question:
        'Hány métert kell a horgásztanyától sétálnia, ha a stég tőle távolabbi végéről szeretne pecázni?',
      unit: 'm',
      exactResult: totalWalk,
      solutionSteps: `${distToShore} m + ${pierLength} m = ${totalWalk} m`,
      hint: `A partig ${distToShore} m-t, majd a stég végéig még ${pierLength} m-t sétál.`,
    };
  }

  const template = randInt(0, 8);
  switch (template) {
    case 0: {
      const base = randInt(2, 4) * 2000;
      const add = randInt(12, 35) * 100;
      const ans = base / 2 + add;
      return {
        id: uid('word-think'),
        kind: 'word-problem',
        topicId,
        title: 'Melyik számra gondoltam?',
        instruction: 'Írd fel fejben vagy papíron művelettel, és számítsd ki!',
        story: `Gondoltam egy számra, amely a ${base} felénél ${add}-zal nagyobb.`,
        question: 'Melyik számra gondoltam?',
        unit: '',
        exactResult: ans,
        solutionSteps: `${base} : 2 + ${add} = ${base / 2} + ${add} = ${ans}`,
        hint: `A ${base} fele ${base / 2}. Ehhez adj hozzá ${add}-t!`,
      };
    }
    case 1: {
      const pears = randInt(12, 35) * 100;
      const moreApples = randInt(4, 15) * 100;
      const apples = pears + moreApples;
      const total = pears + apples;
      return {
        id: uid('word-market'),
        kind: 'word-problem',
        topicId,
        title: 'Szöveges feladat – Őszi piac',
        instruction: 'Kétlépéses szöveges feladat: ügyelj arra, hogy az összes eladott gyümölcsöt kérdezi!',
        story: `A piacon ${pears} kg körtét és ${moreApples} kg-mal több almát adtak el az őszi vásáron.`,
        question: 'Hány kilogramm alma és körte fogyott el összesen?',
        unit: 'kg',
        exactResult: total,
        solutionSteps: `Alma: ${pears} + ${moreApples} = ${apples} kg. Összesen: ${pears} + ${apples} = ${total} kg.`,
        hint: `Először számold ki az almát (${pears} + ${moreApples} = ${apples} kg), majd add hozzá a körtét (${pears} kg)!`,
      };
    }
    case 2: {
      // OH-MAT04MB 56. o. 4–5. feladat: Vígszínház – A Pál utcai fiúk
      const seats = randInt(320, 680);
      const shows = randInt(5, 9);
      const totalTickets = seats * shows;
      return {
        id: uid('word-theater'),
        kind: 'word-problem',
        topicId,
        title: 'Szöveges feladat – A Pál utcai fiúk előadás',
        instruction: 'Számítsd ki az eladott jegyek számát írásbeli szorzással!',
        story: `A színházban a hónapban ${shows} alkalommal játszották A Pál utcai fiúk című előadást, amelyre minden jegy elkelt. A nézőtéren előadásonként ${seats} diák foglalt helyet.`,
        question: 'Hány néző látta összesen az előadásokat ebben a hónapban?',
        unit: 'fő',
        exactResult: totalTickets,
        solutionSteps: `${seats} · ${shows} = ${totalTickets}`,
        hint: `Szorozd meg az egy előadásra jutó nézőszámot (${seats}) az előadások számával (${shows})!`,
      };
    }
    case 3: {
      const swamMeters = randInt(2150, 7890);
      const remaining = 10000 - swamMeters;
      return {
        id: uid('word-swim'),
        kind: 'word-problem',
        topicId,
        title: 'Szöveges feladat – Balatoni úszóverseny',
        instruction: 'Váltsd át fejben a 10 km-t méterre, majd számítsd ki a hátralévő távot!',
        story: `Egy nyílt vízi úszóversenyen 10 km (10 000 m) hosszú távot kell teljesíteni. Éva már leúszott ${swamMeters} métert.`,
        question: 'Hány méter hosszú távot kell még megtennie a célig?',
        unit: 'm',
        exactResult: remaining,
        solutionSteps: `10 000 m - ${swamMeters} m = ${remaining} m`,
        hint: `10 km = 10 000 m. Vond ki belőle a megtett ${swamMeters} métert!`,
      };
    }
    case 4: {
      // OH-MAT04MB 41. o. 5. feladat: Az év madara szavazás
      const owl1 = randInt(2800, 3600);
      const owl2 = randInt(1900, 2600);
      const owl3 = randInt(1100, 1750);
      const totalVotes = owl1 + owl2 + owl3;
      return {
        id: uid('word-birds'),
        kind: 'word-problem',
        topicId,
        title: 'Szöveges feladat – Az év madara szavazás',
        instruction: 'Add össze a három bagolyfajra leadott szavazatok számát!',
        story: `Az év madara szavazáson három bagolyfajra lehetett szavazni: az erdei fülesbagoly ${owl1}, a füleskuvik ${owl2}, az uráli bagoly pedig ${owl3} szavazatot kapott.`,
        question: 'Hány szavazat érkezett a három madárra összesen?',
        unit: 'szavazat',
        exactResult: totalVotes,
        solutionSteps: `${owl1} + ${owl2} + ${owl3} = ${totalVotes}`,
        hint: `Írd egymás alá a három számot (${owl1}, ${owl2}, ${owl3}), és add össze őket!`,
      };
    }
    case 5: {
      // OH-MAT04MB 25. o. 5. feladat: Pótlás a nagyobb ezres számszomszédra
      const num = randInt(1120, 8890);
      const nextThousand = (Math.floor(num / 1000) + 1) * 1000;
      const diff = nextThousand - num;
      return {
        id: uid('word-neighbor-10000'),
        kind: 'word-problem',
        topicId,
        title: 'Pótlás a nagyobb ezres számszomszédra',
        instruction: 'Keresd meg a szám nagyobb ezres számszomszédját, és számítsd ki a hiányzó tagot!',
        story: `Mennyit kell adni a(z) ${num}-hoz, hogy a nagyobb ezres számszomszédját (${nextThousand}-et) kapjuk?  ${num} + □ = ${nextThousand}`,
        question: 'Melyik szám kerül a □ helyére?',
        unit: '',
        exactResult: diff,
        solutionSteps: `${nextThousand} - ${num} = ${diff}`,
        hint: `Vond ki a ${nextThousand}-ből a ${num}-t!`,
      };
    }
    case 6: {
      // OH-MAT04MB 70. o. 3. feladat: Hiányzó osztandó keresése
      const divisor = randInt(2, 7);
      const quotient = randInt(320, 1350);
      const remainder = randInt(1, divisor - 1);
      const dividend = quotient * divisor + remainder;
      return {
        id: uid('word-div-reverse'),
        kind: 'word-problem',
        topicId,
        title: 'Bennefoglalás és osztás ellenőrzése',
        instruction: 'Emlékezz az osztás ellenőrzésére: hányados · osztó + maradék = osztandó!',
        story: `Egy maradékos osztásban az osztó ${divisor}, a hányados ${quotient}, a maradék pedig ${remainder}.`,
        question: 'Melyik szám volt az osztandó?',
        unit: '',
        exactResult: dividend,
        solutionSteps: `${quotient} · ${divisor} + ${remainder} = ${quotient * divisor} + ${remainder} = ${dividend}`,
        hint: `Szorozd meg a hányadost (${quotient}) az osztóval (${divisor}), majd add hozzá a maradékot (${remainder})!`,
      };
    }
    case 7: {
      // OH-MAT04MB 110. o. 41. feladat: Szalag szétvágása arányosan
      const ratio = randInt(4, 7);
      const shortPiece = randInt(25, 110);
      const longPiece = shortPiece * ratio;
      const totalRibbon = shortPiece + longPiece;
      return {
        id: uid('word-ribbon'),
        kind: 'word-problem',
        topicId,
        title: 'Szöveges feladat – Szalag feldarabolása',
        instruction: `Ha az egyik darab ${ratio}-szer olyan hosszú, mint a másik, akkor együtt ${ratio + 1} egyenlő résznek felelnek meg!`,
        story: `Egy ${totalRibbon} cm hosszú díszszalagot két részre vágtak úgy, hogy a hosszabb darab pontosan ${ratio}-szor olyan hosszú lett, mint a rövidebb.`,
        question: 'Hány centiméteres lett a rövidebb szalagdarab?',
        unit: 'cm',
        exactResult: shortPiece,
        solutionSteps: `Összesen ${ratio} + 1 = ${
          ratio + 1
        } rész. Rövidebb darab: ${totalRibbon} : ${ratio + 1} = ${shortPiece} cm.`,
        hint: `A rövidebb darab 1 rész, a hosszabb ${ratio} rész, ez összesen ${
          ratio + 1
        } egyenlő rész. Oszd el a ${totalRibbon}-t ${ratio + 1}-gyel!`,
      };
    }
    default: {
      const beforeReg = 1419;
      const afterReg = 962;
      const diff = beforeReg - afterReg;
      return {
        id: uid('word-tisza'),
        kind: 'word-problem',
        topicId,
        title: 'Szöveges feladat – A Tisza szabályozása',
        instruction: 'Valós földrajzi adatok a munkafüzetből: számolj írásbeli kivonással!',
        story: `Hazánk második legnagyobb folyója, a Tisza a folyószabályozása előtt ${beforeReg} km hosszú volt, ma ${afterReg} km.`,
        question: 'Hány kilométerrel lett rövidebb a szabályozással a folyó?',
        unit: 'km',
        exactResult: diff,
        solutionSteps: `${beforeReg} km - ${afterReg} km = ${diff} km`,
        hint: `Vond ki a ${beforeReg}-ből a ${afterReg}-t!`,
      };
    }
  }
}

// ==========================================
// Main Worksheet Dispatcher (Chapters 1–12)
// ==========================================
export function generateWorksheet(topicId: string, count: number = 8): Exercise[] {
  const exercises: Exercise[] = [];

  for (let i = 0; i < count; i++) {
    switch (topicId) {
      // --- VOLUME I ---
      case 'matek-4-1000-ismetles': {
        const mod = i % 4;
        if (mod === 0) exercises.push(generatePlaceValue(topicId, 1000));
        else if (mod === 1) exercises.push(generateRoundingNeighbors(topicId, 1000));
        else if (mod === 2) exercises.push(generateRomanNumerals(topicId));
        else exercises.push(generateWordProblem(topicId, 1000));
        break;
      }

      case 'matek-4-szamok-10000': {
        const mod = i % 3;
        if (mod === 0) exercises.push(generatePlaceValue(topicId, 10000));
        else if (mod === 1) exercises.push(generateRoundingNeighbors(topicId, 10000));
        else exercises.push(generateWordProblem(topicId, 10000));
        break;
      }

      case 'matek-4-meresek': {
        exercises.push(generateUnitConversion(topicId));
        break;
      }

      case 'matek-4-irasbeli-10000': {
        exercises.push(generateWrittenArithmetic(topicId, 10000));
        break;
      }

      case 'matek-4-negativ-szamok': {
        exercises.push(generateNegativeNumbers(topicId));
        break;
      }

      case 'matek-4-szoveges-vegyes': {
        const mod = i % 6;
        if (mod === 0) exercises.push(generatePlaceValue(topicId, 10000));
        else if (mod === 1) exercises.push(generateRoundingNeighbors(topicId, 10000));
        else if (mod === 2) exercises.push(generateWrittenArithmetic(topicId, 10000));
        else if (mod === 3) exercises.push(generateUnitConversion(topicId));
        else if (mod === 4) exercises.push(generateNegativeNumbers(topicId));
        else exercises.push(generateWordProblem(topicId, 10000));
        break;
      }

      // --- VOLUME II ---
      case 'matek-4-osztas-egyjegyuvel': {
        exercises.push(generateWrittenDivision(topicId));
        break;
      }

      case 'matek-4-geometria-testek': {
        exercises.push(generateGeometrySolidsExercise(topicId));
        break;
      }

      case 'matek-4-szorzas-ketjegyuvel': {
        exercises.push(generateTwoDigitMultiplication(topicId));
        break;
      }

      case 'matek-4-tortszamok': {
        exercises.push(generateFractionsExercise(topicId));
        break;
      }

      case 'matek-4-ido-merese': {
        exercises.push(generateTimeMeasurementExercise(topicId));
        break;
      }

      case 'matek-4-penzugyek-rendszerezes':
      default: {
        // Year-end review + Everyday finances + Combinatorics/Sets (Chapters 7–12 + OH-MAT04MB)
        const mod = i % 5;
        if (mod === 0 || mod === 1) exercises.push(generateFinancialExercise(topicId));
        else if (mod === 2) exercises.push(generateWrittenDivision(topicId));
        else if (mod === 3) exercises.push(generateTwoDigitMultiplication(topicId));
        else exercises.push(generateFractionsExercise(topicId));
        break;
      }
    }
  }

  return exercises;
}
