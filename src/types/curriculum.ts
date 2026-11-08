export type SubjectId = 'matek' | 'magyar' | 'kornyezet';
export type GradeId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type VolumeFilter = 'all' | 'vol1' | 'vol2';

export interface SubjectInfo {
  id: SubjectId;
  name: string;
  iconName: string;
  available: boolean;
}

export interface GradeInfo {
  grade: GradeId;
  label: string;
  available: boolean;
}

export interface TopicConfig {
  id: string;
  subjectId: SubjectId;
  grade: GradeId;
  volumeId: 'vol1' | 'vol2';
  chapterOrder: number;
  volume: string;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  color: 'indigo' | 'emerald' | 'amber' | 'rose' | 'sky' | 'violet';
  iconName: string;
  subtopics: string[];
  available: boolean;
}

// --- Exercise Types ---

export type ExerciseKind =
  | 'written-arithmetic'     // Írásbeli összeadás, kivonás, szorzás egyjegyűvel vagy kétjegyűvel (négyzetrácsos + becslés)
  | 'written-division'       // Írásbeli osztás egyjegyű osztóval (hányados + maradék + ellenőrzés)
  | 'rounding-neighbors'     // Kerekítés és számszomszédok táblázatos / kártyás kitöltése
  | 'place-value'            // Helyiérték-bontás (pl. 4E + 12sz + 5t + 8e)
  | 'unit-conversion'        // Mértékegység átváltás (hosszúság, tömeg, űrtartalom, idő)
  | 'negative-numbers'       // Negatív számok (hőmérséklet-változás, relációk, adósság)
  | 'word-problem'           // Szöveges feladat, geometria, pénzügyek vagy nyitott mondat
  | 'roman-numerals'         // Római számok és alapműveletek
  | 'fractions';             // Törtszámok (egész törtrésze, pl. 2400 Ft 3 negyede, 200 cm 4 ötöde)

export interface WrittenArithmeticExercise {
  id: string;
  kind: 'written-arithmetic';
  topicId: string;
  title: string;
  instruction: string;
  operation: '+' | '-' | '·';
  operandA: number;
  operandB: number;
  roundTo: 10 | 100 | 1000;
  estimatedA: number;
  estimatedB: number;
  estimatedResult: number;
  exactResult: number;
  hint: string;
}

export interface WrittenDivisionExercise {
  id: string;
  kind: 'written-division';
  topicId: string;
  title: string;
  instruction: string;
  dividend: number;   // Osztandó (pl. 8512 vagy 4927)
  divisor: number;    // Osztó (2..9)
  quotient: number;   // Hányados
  remainder: number;  // Maradék (0..divisor-1)
  hasRemainder: boolean;
  hint: string;
}

export interface RoundingNeighborsItem {
  number: number;
  smallerNeighbor: number;
  largerNeighbor: number;
  rounded: number;
  neighborType: 'tízes' | 'százas' | 'ezres';
}

export interface RoundingNeighborsExercise {
  id: string;
  kind: 'rounding-neighbors';
  topicId: string;
  title: string;
  instruction: string;
  item: RoundingNeighborsItem;
  hint: string;
}

export interface PlaceValueExercise {
  id: string;
  kind: 'place-value';
  topicId: string;
  title: string;
  instruction: string;
  expression: string; // e.g., "4 E + 12 sz + 5 t + 8 e"
  exactResult: number;
  hint: string;
}

export interface UnitConversionExercise {
  id: string;
  kind: 'unit-conversion';
  topicId: string;
  title: string;
  instruction: string;
  category: 'hosszúság' | 'tömeg' | 'űrtartalom' | 'idő';
  sourceText: string; // e.g. "3 km 450 m" or "180 másodperc"
  targetUnit: string; // e.g. "m" or "perc"
  exactResult: number;
  hint: string;
}

export interface NegativeNumbersExercise {
  id: string;
  kind: 'negative-numbers';
  topicId: string;
  title: string;
  instruction: string;
  subKind: 'temp-change' | 'temp-diff' | 'debt';
  questionText: string;
  startTemp?: number;
  endTemp?: number;
  unit: string;
  exactResult: number;
  hint: string;
}

export interface WordProblemExercise {
  id: string;
  kind: 'word-problem';
  topicId: string;
  title: string;
  instruction: string;
  story: string;
  question: string;
  unit: string;
  exactResult: number;
  solutionSteps: string;
  hint: string;
}

export interface RomanNumeralsExercise {
  id: string;
  kind: 'roman-numerals';
  topicId: string;
  title: string;
  instruction: string;
  direction: 'roman-to-arabic' | 'arabic-to-roman';
  promptValue: string;
  exactAnswer: string;
  hint: string;
}

export interface FractionsExercise {
  id: string;
  kind: 'fractions';
  topicId: string;
  title: string;
  instruction: string;
  wholeValue: number;
  wholeUnit: string;
  numerator: number;
  denominator: number;
  denominatorLabel: string; // pl. "negyede", "ötöde", "harmada", "hatoda"
  exactResult: number;
  hint: string;
}

export type Exercise =
  | WrittenArithmeticExercise
  | WrittenDivisionExercise
  | RoundingNeighborsExercise
  | PlaceValueExercise
  | UnitConversionExercise
  | NegativeNumbersExercise
  | WordProblemExercise
  | RomanNumeralsExercise
  | FractionsExercise;

export interface ExerciseAttemptState {
  exerciseId: string;
  submitted: boolean;
  isCorrect: boolean;
  score: number;      // earned points
  maxScore: number;   // possible points
  userValues: Record<string, string>;
}
