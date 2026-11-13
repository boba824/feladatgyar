import React, { useState } from 'react';
import {
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  RotateCcw,
  XCircle,
} from 'lucide-react';
import {
  Exercise,
  ExerciseAttemptState,
  WrittenArithmeticExercise,
} from '../types/curriculum';

interface ExerciseCardProps {
  index: number;
  exercise: Exercise;
  attempt: ExerciseAttemptState;
  allowAnswerEdit: boolean;
  onUpdateAttempt: (next: ExerciseAttemptState) => void;
  showPrintSolution?: boolean;
}

function normalizeNumberInput(str: string): string {
  return str.replace(/\s+/g, '').replace(',', '.').trim();
}

export function checkHungarianAnswer(
  rawInput: string,
  exactAnswer: string,
  acceptedAnswers?: string[],
  caseSensitive?: boolean
): boolean {
  const clean = (s: string) => {
    const trimmed = s.trim().replace(/\s+/g, ' ');
    return caseSensitive ? trimmed : trimmed.toLowerCase();
  };
  const user = clean(rawInput || '');
  if (!user) return false;
  const targets = [exactAnswer, ...(acceptedAnswers || [])].map(clean);
  return targets.includes(user);
}

const WrittenGridDisplay: React.FC<{
  ex: WrittenArithmeticExercise;
  userExact: string;
  onChangeExact: (val: string) => void;
  submitted: boolean;
  isExactCorrect: boolean;
  allowAnswerEdit: boolean;
}> = ({ ex, userExact, onChangeExact, submitted, isExactCorrect, allowAnswerEdit }) => {
  const cols = 5;
  const aDigits = String(ex.operandA).padStart(cols, ' ').split('');
  const bDigits = String(ex.operandB).padStart(cols, ' ').split('');
  const exactDisabled = submitted && (!allowAnswerEdit || isExactCorrect);

  return (
    <div className="inline-block bg-white border-2 border-slate-300 rounded-xl p-4 shadow-inner">
      <div className="text-xs font-medium text-slate-400 mb-2 flex justify-between">
        <span>Kockás füzet nézet</span>
        <span className="font-mono">Helyi értékek: E | sz | t | e</span>
      </div>

      {ex.operation === '·' ? (
        // Supports both 1-digit and 2-digit multipliers (e.g. 1124 · 4 or 239 · 36)
        <div className="space-y-2">
          <div className="flex items-center gap-0.5 font-mono text-lg font-bold">
            {String(ex.operandA)
              .split('')
              .map((d, i) => (
                <div
                  key={`ma-${i}`}
                  className="w-9 h-9 flex items-center justify-center border border-sky-200 bg-sky-50/40 text-slate-800"
                >
                  {d}
                </div>
              ))}
            <div className="w-9 h-9 flex items-center justify-center border border-sky-200 bg-amber-50/60 text-amber-700">
              ·
            </div>
            {String(ex.operandB)
              .split('')
              .map((d, i) => (
                <div
                  key={`mb-${i}`}
                  className="w-9 h-9 flex items-center justify-center border border-sky-200 bg-sky-50/40 text-slate-800"
                >
                  {d}
                </div>
              ))}
          </div>
          <div className="border-t-2 border-slate-700 pt-2 flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Szorzat:</span>
            <input
              type="text"
              inputMode="numeric"
              disabled={exactDisabled}
              value={userExact}
              onChange={(e) => onChangeExact(e.target.value)}
              placeholder="Írd be..."
              className={`w-40 px-3 py-1.5 font-mono text-lg font-bold placeholder:font-sans placeholder:text-xs placeholder:font-normal rounded-lg border-2 outline-none transition print:hidden disabled:cursor-not-allowed ${
                submitted
                  ? isExactCorrect
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                    : 'border-rose-500 bg-rose-50 text-rose-900'
                  : 'border-indigo-300 focus:border-indigo-600 bg-white'
              }`}
            />
            <div className="hidden print:grid grid-cols-6 gap-0.5">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={`pm-${idx}`}
                  className="w-9 h-9 border border-slate-300 bg-white"
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-6 gap-0.5 font-mono text-lg font-bold">
            <div className="w-9 h-9 flex items-center justify-center border border-sky-100 bg-slate-50/40 text-slate-400">
              {' '}
            </div>
            {aDigits.map((ch, idx) => (
              <div
                key={`a-${idx}`}
                className="w-9 h-9 flex items-center justify-center border border-sky-200 bg-sky-50/30 text-slate-800"
              >
                {ch}
              </div>
            ))}

            <div className="w-9 h-9 flex items-center justify-center border border-sky-200 bg-amber-50/60 text-amber-700">
              {ex.operation}
            </div>
            {bDigits.map((ch, idx) => (
              <div
                key={`b-${idx}`}
                className="w-9 h-9 flex items-center justify-center border border-sky-200 bg-sky-50/30 text-slate-800"
              >
                {ch}
              </div>
            ))}
          </div>

          <div className="border-t-2 border-slate-800 my-1.5" />

          <div className="flex items-center justify-between gap-2 pt-1">
            <span className="text-xs font-semibold text-slate-500">Eredmény:</span>
            <input
              type="text"
              inputMode="numeric"
              disabled={exactDisabled}
              value={userExact}
              onChange={(e) => onChangeExact(e.target.value)}
              placeholder="Eredmény..."
              className={`w-40 text-right px-3 py-1.5 font-mono text-lg font-bold placeholder:font-sans placeholder:text-xs placeholder:font-normal rounded-lg border-2 outline-none transition print:hidden disabled:cursor-not-allowed ${
                submitted
                  ? isExactCorrect
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                    : 'border-rose-500 bg-rose-50 text-rose-900'
                  : 'border-indigo-300 focus:border-indigo-600 bg-white'
              }`}
            />
            <div className="hidden print:grid grid-cols-6 gap-0.5">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={`p-${idx}`}
                  className="w-9 h-9 border border-slate-300 bg-white"
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  index,
  exercise,
  attempt,
  allowAnswerEdit,
  onUpdateAttempt,
}) => {
  const [showHint, setShowHint] = useState(false);
  const isLocked = attempt.submitted && !allowAnswerEdit;
  const showCorrectAnswer = attempt.submitted && !allowAnswerEdit;

  const setFieldValue = (key: string, value: string) => {
    if (isLocked) return;
    onUpdateAttempt({
      ...attempt,
      submitted: false,
      userValues: {
        ...attempt.userValues,
        [key]: value,
      },
    });
  };

  const evaluateCurrentExercise = () => {
    const vals = attempt.userValues;

    switch (exercise.kind) {
      case 'written-arithmetic': {
        const userEst = normalizeNumberInput(vals.estimate || '');
        const userExact = normalizeNumberInput(vals.exact || '');
        const estOk = Number(userEst) === exercise.estimatedResult && userEst !== '';
        const exactOk = Number(userExact) === exercise.exactResult && userExact !== '';
        const score = (estOk ? 1 : 0) + (exactOk ? 1 : 0);
        onUpdateAttempt({
          ...attempt,
          submitted: true,
          isCorrect: estOk && exactOk,
          score,
          maxScore: 2,
        });
        break;
      }

      case 'written-division': {
        const userQuotient = normalizeNumberInput(vals.quotient || '');
        const userRemainder = normalizeNumberInput(
          vals.remainder === undefined || vals.remainder === '' ? '0' : vals.remainder
        );
        const qOk = userQuotient !== '' && Number(userQuotient) === exercise.quotient;
        const rOk =
          userQuotient !== '' && Number(userRemainder) === exercise.remainder;
        const score = (qOk ? 1 : 0) + (rOk ? 1 : 0);
        onUpdateAttempt({
          ...attempt,
          submitted: true,
          isCorrect: qOk && rOk,
          score,
          maxScore: 2,
        });
        break;
      }

      case 'rounding-neighbors': {
        const sOk =
          Number(normalizeNumberInput(vals.smaller || '')) === exercise.item.smallerNeighbor &&
          (vals.smaller || '').trim() !== '';
        const lOk =
          Number(normalizeNumberInput(vals.larger || '')) === exercise.item.largerNeighbor &&
          (vals.larger || '').trim() !== '';
        const rOk =
          Number(normalizeNumberInput(vals.rounded || '')) === exercise.item.rounded &&
          (vals.rounded || '').trim() !== '';
        const score = (sOk ? 1 : 0) + (lOk ? 1 : 0) + (rOk ? 1 : 0);
        onUpdateAttempt({
          ...attempt,
          submitted: true,
          isCorrect: sOk && lOk && rOk,
          score,
          maxScore: 3,
        });
        break;
      }

      case 'place-value':
      case 'unit-conversion':
      case 'negative-numbers':
      case 'word-problem':
      case 'fractions': {
        const raw = normalizeNumberInput(vals.answer || '');
        const ok = raw !== '' && Number(raw) === exercise.exactResult;
        onUpdateAttempt({
          ...attempt,
          submitted: true,
          isCorrect: ok,
          score: ok ? 1 : 0,
          maxScore: 1,
        });
        break;
      }

      case 'roman-numerals': {
        const raw = (vals.answer || '').trim().toUpperCase().replace(/\.$/, '');
        const expected = exercise.exactAnswer.trim().toUpperCase().replace(/\.$/, '');
        const ok = raw !== '' && raw === expected;
        onUpdateAttempt({
          ...attempt,
          submitted: true,
          isCorrect: ok,
          score: ok ? 1 : 0,
          maxScore: 1,
        });
        break;
      }

      case 'hu-choice': {
        const selected = vals.answer || '';
        const ok = selected !== '' && selected === exercise.correctOption;
        onUpdateAttempt({
          ...attempt,
          submitted: true,
          isCorrect: ok,
          score: ok ? 1 : 0,
          maxScore: 1,
        });
        break;
      }

      case 'hu-text-input': {
        const ok = checkHungarianAnswer(
          vals.answer || '',
          exercise.exactAnswer,
          exercise.acceptedAnswers,
          exercise.caseSensitive
        );
        onUpdateAttempt({
          ...attempt,
          submitted: true,
          isCorrect: ok,
          score: ok ? 1 : 0,
          maxScore: 1,
        });
        break;
      }

      case 'hu-triad': {
        const f0 = exercise.fields[0];
        const f1 = exercise.fields[1];
        const f2 = exercise.fields[2];
        const ok0 = checkHungarianAnswer(vals.f0 || '', f0.exactAnswer, f0.acceptedAnswers, f0.caseSensitive);
        const ok1 = checkHungarianAnswer(vals.f1 || '', f1.exactAnswer, f1.acceptedAnswers, f1.caseSensitive);
        const ok2 = checkHungarianAnswer(vals.f2 || '', f2.exactAnswer, f2.acceptedAnswers, f2.caseSensitive);
        const score = (ok0 ? 1 : 0) + (ok1 ? 1 : 0) + (ok2 ? 1 : 0);
        onUpdateAttempt({
          ...attempt,
          submitted: true,
          isCorrect: ok0 && ok1 && ok2,
          score,
          maxScore: 3,
        });
        break;
      }
    }
  };

  const resetAttempt = () => {
    onUpdateAttempt({
      ...attempt,
      submitted: false,
      isCorrect: false,
      score: 0,
      userValues: {},
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      evaluateCurrentExercise();
    }
  };

  return (
    <div
      onKeyDown={handleKeyDown}
      className={`rounded-2xl border-2 transition-all p-5 bg-white shadow-sm print:shadow-none print:border-slate-300 print:break-inside-avoid ${
        attempt.submitted
          ? attempt.isCorrect
            ? 'border-emerald-400 bg-emerald-50/20'
            : 'border-rose-300 bg-rose-50/15'
          : 'border-slate-200 hover:border-indigo-200'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <span
            className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
              attempt.submitted
                ? attempt.isCorrect
                  ? 'bg-emerald-600 text-white'
                  : 'bg-rose-600 text-white'
                : 'bg-amber-500 text-white'
            }`}
          >
            {index + 1}.
          </span>
          <div>
            <h3 className="font-bold text-slate-800 text-base">{exercise.title}</h3>
            <p className="text-sm text-slate-600">{exercise.instruction}</p>
          </div>
        </div>

        {/* Status badge (hidden when printing) */}
        <div className="flex items-center gap-2 print:hidden shrink-0">
          <button
            type="button"
            onClick={() => setShowHint((prev) => !prev)}
            title="Segítség / Tipp megjelenítése"
            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition"
          >
            <Lightbulb className="w-5 h-5" />
          </button>
          {attempt.submitted && (
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                attempt.isCorrect
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              {attempt.isCorrect ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" /> Hibátlan ({attempt.score}/{attempt.maxScore})
                </>
              ) : (
                <>
                  <XCircle className="w-3.5 h-3.5" /> Javítandó ({attempt.score}/{attempt.maxScore})
                </>
              )}
            </span>
          )}
        </div>
      </div>

      {/* Hint collapsible */}
      {showHint && (
        <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2 print:hidden">
          <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Segítség: </span>
            {exercise.hint}
          </div>
        </div>
      )}

      {/* Body by Exercise Kind */}
      <div className="mt-3">
        {exercise.kind === 'written-arithmetic' && (() => {
          const userEst = normalizeNumberInput(attempt.userValues.estimate || '');
          const userExact = normalizeNumberInput(attempt.userValues.exact || '');
          const isEstCorrect = userEst !== '' && Number(userEst) === exercise.estimatedResult;
          const isExactCorrect = userExact !== '' && Number(userExact) === exercise.exactResult;

          return (
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              <div className="space-y-2 flex-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                  1. Előzetes becslés ({exercise.roundTo === 100 ? 'százasra' : 'tízesre'} kerekítve):
                </label>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-700 text-sm">B.:</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    disabled={attempt.submitted && (!allowAnswerEdit || isEstCorrect)}
                    value={attempt.userValues.estimate || ''}
                    onChange={(e) => setFieldValue('estimate', e.target.value)}
                    placeholder="Becslés..."
                    className={`w-40 px-3 py-1.5 font-mono text-base font-bold placeholder:font-sans placeholder:text-xs placeholder:font-normal rounded-lg border-2 outline-none transition print:hidden disabled:cursor-not-allowed ${
                      attempt.submitted
                        ? isEstCorrect
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                          : 'border-rose-500 bg-rose-50 text-rose-900'
                        : 'border-slate-300 focus:border-indigo-600'
                    }`}
                  />
                  <span className="hidden print:inline-block border-b border-slate-400 w-44 h-6" />
                </div>
                {showCorrectAnswer && !isEstCorrect && (
                  <p className="text-xs text-rose-600 font-medium print:hidden">
                    Helyes becslés: {exercise.estimatedA} {exercise.operation} {exercise.estimatedB} ={' '}
                    <strong>{exercise.estimatedResult}</strong>
                  </p>
                )}
                {showCorrectAnswer && !isExactCorrect && (
                  <p className="text-xs text-rose-600 font-medium print:hidden">
                    Pontos eredmény: <strong>{exercise.exactResult}</strong>
                  </p>
                )}
              </div>

              <div>
                <WrittenGridDisplay
                  ex={exercise}
                  userExact={attempt.userValues.exact || ''}
                  onChangeExact={(val) => setFieldValue('exact', val)}
                  submitted={attempt.submitted}
                  isExactCorrect={isExactCorrect}
                  allowAnswerEdit={allowAnswerEdit}
                />
              </div>
            </div>
          );
        })()}

        {exercise.kind === 'written-division' && (() => {
          const userQ = normalizeNumberInput(attempt.userValues.quotient || '');
          const userR = normalizeNumberInput(
            attempt.userValues.remainder === undefined || attempt.userValues.remainder === ''
              ? '0'
              : attempt.userValues.remainder
          );
          const qOk = userQ !== '' && Number(userQ) === exercise.quotient;
          const rOk = userQ !== '' && Number(userR) === exercise.remainder;

          return (
            <div className="space-y-3 bg-emerald-50/30 p-4 rounded-xl border border-emerald-200">
              <div className="flex flex-wrap items-center gap-3">
                {/* Notebook grid representation of dividend : divisor = */}
                <div className="inline-flex items-center gap-0.5 bg-white p-2 rounded-xl border border-slate-300 font-mono text-lg font-bold shadow-inner">
                  {String(exercise.dividend)
                    .split('')
                    .map((d, i) => (
                      <div
                        key={`div-${i}`}
                        className="w-9 h-9 flex items-center justify-center border border-sky-200 bg-sky-50/40 text-slate-800"
                      >
                        {d}
                      </div>
                    ))}
                  <div className="w-9 h-9 flex items-center justify-center border border-sky-200 bg-amber-50/60 text-amber-700">
                    :
                  </div>
                  <div className="w-9 h-9 flex items-center justify-center border border-sky-200 bg-sky-50/40 text-slate-800">
                    {exercise.divisor}
                  </div>
                  <div className="w-9 h-9 flex items-center justify-center border border-sky-200 bg-slate-50 text-slate-700">
                    =
                  </div>
                </div>

                {/* Quotient Input */}
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold uppercase text-slate-600">
                    Hányados:
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    disabled={attempt.submitted && (!allowAnswerEdit || qOk)}
                    value={attempt.userValues.quotient || ''}
                    onChange={(e) => setFieldValue('quotient', e.target.value)}
                    placeholder="Hányados..."
                    className={`w-36 px-3 py-1.5 font-mono text-lg font-bold placeholder:font-sans placeholder:text-xs placeholder:font-normal rounded-lg border-2 outline-none print:hidden disabled:cursor-not-allowed ${
                      attempt.submitted
                        ? qOk
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                          : 'border-rose-500 bg-rose-50 text-rose-900'
                        : 'border-slate-300 focus:border-indigo-600 bg-white'
                    }`}
                  />
                  <span className="hidden print:inline-block border-b border-slate-400 w-28 h-6" />
                </div>

                {/* Remainder Input */}
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold uppercase text-slate-600">
                    Maradék:
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    disabled={attempt.submitted && (!allowAnswerEdit || rOk)}
                    value={attempt.userValues.remainder ?? ''}
                    onChange={(e) => setFieldValue('remainder', e.target.value)}
                    placeholder="Maradék"
                    className={`w-28 px-3 py-1.5 font-mono text-lg font-bold placeholder:font-sans placeholder:text-xs placeholder:font-normal rounded-lg border-2 outline-none print:hidden disabled:cursor-not-allowed ${
                      attempt.submitted
                        ? rOk
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                          : 'border-rose-500 bg-rose-50 text-rose-900'
                        : 'border-slate-300 focus:border-indigo-600 bg-white'
                    }`}
                  />
                  <span className="hidden print:inline-block border-b border-slate-400 w-16 h-6" />
                </div>
              </div>

              {showCorrectAnswer && (!qOk || !rOk) && (
                <p className="text-xs text-rose-600 font-semibold print:hidden">
                  Helyes megoldás: {exercise.dividend} : {exercise.divisor} ={' '}
                  <strong>{exercise.quotient}</strong>, maradék:{' '}
                  <strong>{exercise.remainder}</strong> (Ellenőrzés: {exercise.quotient} ·{' '}
                  {exercise.divisor}
                  {exercise.remainder > 0 ? ` + ${exercise.remainder}` : ''} = {exercise.dividend})
                </p>
              )}
            </div>
          );
        })()}

        {exercise.kind === 'rounding-neighbors' && (() => {
          const sVal = normalizeNumberInput(attempt.userValues.smaller || '');
          const lVal = normalizeNumberInput(attempt.userValues.larger || '');
          const rVal = normalizeNumberInput(attempt.userValues.rounded || '');
          const sOk = sVal !== '' && Number(sVal) === exercise.item.smallerNeighbor;
          const lOk = lVal !== '' && Number(lVal) === exercise.item.largerNeighbor;
          const rOk = rVal !== '' && Number(rVal) === exercise.item.rounded;

          return (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-center bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">
                    Kisebb {exercise.item.neighborType} szomszéd
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    disabled={attempt.submitted && (!allowAnswerEdit || sOk)}
                    value={attempt.userValues.smaller || ''}
                    onChange={(e) => setFieldValue('smaller', e.target.value)}
                    placeholder="Kisebb..."
                    className={`w-full px-3 py-1.5 font-mono font-bold placeholder:font-sans placeholder:text-xs placeholder:font-normal rounded-lg border-2 outline-none print:hidden disabled:cursor-not-allowed ${
                      attempt.submitted
                        ? sOk
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                          : 'border-rose-500 bg-rose-50 text-rose-900'
                        : 'border-slate-300 focus:border-indigo-600 bg-white'
                    }`}
                  />
                  <div className="hidden print:block h-8 border-b border-slate-400" />
                </div>

                <div className="text-center py-2 bg-indigo-600 text-white rounded-xl font-mono text-xl font-extrabold shadow-sm print:bg-slate-100 print:text-slate-900 print:border print:border-slate-400">
                  {exercise.item.number}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">
                    Nagyobb {exercise.item.neighborType} szomszéd
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    disabled={attempt.submitted && (!allowAnswerEdit || lOk)}
                    value={attempt.userValues.larger || ''}
                    onChange={(e) => setFieldValue('larger', e.target.value)}
                    placeholder="Nagyobb..."
                    className={`w-full px-3 py-1.5 font-mono font-bold placeholder:font-sans placeholder:text-xs placeholder:font-normal rounded-lg border-2 outline-none print:hidden disabled:cursor-not-allowed ${
                      attempt.submitted
                        ? lOk
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                          : 'border-rose-500 bg-rose-50 text-rose-900'
                        : 'border-slate-300 focus:border-indigo-600 bg-white'
                    }`}
                  />
                  <div className="hidden print:block h-8 border-b border-slate-400" />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-indigo-700 mb-1">
                    Kerekített érték (≈)
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    disabled={attempt.submitted && (!allowAnswerEdit || rOk)}
                    value={attempt.userValues.rounded || ''}
                    onChange={(e) => setFieldValue('rounded', e.target.value)}
                    placeholder="≈ kerekítve"
                    className={`w-full px-3 py-1.5 font-mono font-bold placeholder:font-sans placeholder:text-xs placeholder:font-normal rounded-lg border-2 outline-none print:hidden disabled:cursor-not-allowed ${
                      attempt.submitted
                        ? rOk
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                          : 'border-rose-500 bg-rose-50 text-rose-900'
                        : 'border-indigo-300 focus:border-indigo-600 bg-white'
                    }`}
                  />
                  <div className="hidden print:block h-8 border-b border-slate-400" />
                </div>
              </div>

              {showCorrectAnswer && !attempt.isCorrect && (
                <p className="text-xs text-rose-600 font-medium print:hidden">
                  Helyes megoldás: Kisebb szomszéd: <strong>{exercise.item.smallerNeighbor}</strong> | Nagyobb
                  szomszéd: <strong>{exercise.item.largerNeighbor}</strong> | Kerekítve:{' '}
                  <strong>{exercise.item.rounded}</strong>
                </p>
              )}
            </div>
          );
        })()}

        {exercise.kind === 'place-value' && (
          <div className="flex flex-wrap items-center gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="font-mono text-lg font-bold text-slate-800">
              {exercise.expression} =
            </span>
            <input
              type="text"
              inputMode="numeric"
              disabled={isLocked}
              value={attempt.userValues.answer || ''}
              onChange={(e) => setFieldValue('answer', e.target.value)}
              placeholder="Írd be a számot..."
              className={`w-48 px-3 py-1.5 font-mono text-lg font-bold placeholder:font-sans placeholder:text-xs placeholder:font-normal rounded-lg border-2 outline-none print:hidden disabled:cursor-not-allowed ${
                attempt.submitted
                  ? attempt.isCorrect
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                    : 'border-rose-500 bg-rose-50 text-rose-900'
                  : 'border-slate-300 focus:border-indigo-600 bg-white'
              }`}
            />
            <span className="hidden print:inline-block border-b border-slate-400 w-36 h-6" />
            {showCorrectAnswer && !attempt.isCorrect && (
              <span className="text-xs text-rose-600 font-semibold print:hidden">
                Helyes válasz: <strong>{exercise.exactResult}</strong>
              </span>
            )}
          </div>
        )}

        {exercise.kind === 'unit-conversion' && (
          <div className="flex flex-wrap items-center gap-3 bg-sky-50/50 p-3.5 rounded-xl border border-sky-200">
            <span className="font-mono text-lg font-bold text-slate-800">
              {exercise.sourceText} =
            </span>
            <input
              type="text"
              inputMode="numeric"
              disabled={isLocked}
              value={attempt.userValues.answer || ''}
              onChange={(e) => setFieldValue('answer', e.target.value)}
              placeholder="Mennyiség..."
              className={`w-40 px-3 py-1.5 font-mono text-lg font-bold placeholder:font-sans placeholder:text-xs placeholder:font-normal rounded-lg border-2 outline-none print:hidden disabled:cursor-not-allowed ${
                attempt.submitted
                  ? attempt.isCorrect
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                    : 'border-rose-500 bg-rose-50 text-rose-900'
                  : 'border-slate-300 focus:border-indigo-600 bg-white'
              }`}
            />
            <span className="hidden print:inline-block border-b border-slate-400 w-32 h-6" />
            <span className="font-mono text-base font-bold text-sky-900">
              {exercise.targetUnit}
            </span>
            {showCorrectAnswer && !attempt.isCorrect && (
              <span className="text-xs text-rose-600 font-semibold print:hidden">
                Helyes válasz: <strong>{exercise.exactResult} {exercise.targetUnit}</strong>
              </span>
            )}
          </div>
        )}

        {exercise.kind === 'fractions' && (
          <div className="space-y-3 bg-amber-50/50 p-4 rounded-xl border border-amber-200">
            {/* Visual fraction bar (up to 10 segments) */}
            <div className="flex items-center gap-1 max-w-md">
              {Array.from({ length: exercise.denominator }).map((_, segIdx) => {
                const filled = segIdx < exercise.numerator;
                return (
                  <div
                    key={segIdx}
                    className={`h-5 flex-1 rounded border ${
                      filled
                        ? 'bg-amber-400 border-amber-600'
                        : 'bg-white border-amber-300'
                    }`}
                  />
                );
              })}
              <span className="ml-2 text-xs font-mono font-bold text-amber-900">
                ({exercise.numerator}/{exercise.denominator})
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="text-base font-bold text-slate-800">
                A(z) <span className="font-mono text-indigo-700">{exercise.wholeValue} {exercise.wholeUnit}</span>-nak a(z){' '}
                <span className="underline decoration-amber-500 decoration-2">
                  {exercise.denominatorLabel}
                </span>{' '}
                =
              </span>
              <input
                type="text"
                inputMode="numeric"
                disabled={isLocked}
                value={attempt.userValues.answer || ''}
                onChange={(e) => setFieldValue('answer', e.target.value)}
                placeholder="Mennyi?"
                className={`w-36 px-3 py-1.5 font-mono text-lg font-bold placeholder:font-sans placeholder:text-xs placeholder:font-normal rounded-lg border-2 outline-none print:hidden disabled:cursor-not-allowed ${
                  attempt.submitted
                    ? attempt.isCorrect
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                      : 'border-rose-500 bg-rose-50 text-rose-900'
                    : 'border-slate-300 focus:border-indigo-600 bg-white'
                }`}
              />
              <span className="hidden print:inline-block border-b border-slate-400 w-32 h-6" />
              <span className="font-mono font-bold text-slate-700">
                {exercise.wholeUnit}
              </span>
              {showCorrectAnswer && !attempt.isCorrect && (
                <span className="text-xs text-rose-600 font-semibold print:hidden">
                  Helyes válasz: <strong>{exercise.exactResult} {exercise.wholeUnit}</strong> ({exercise.wholeValue} : {exercise.denominator} · {exercise.numerator})
                </span>
              )}
            </div>
          </div>
        )}

        {exercise.kind === 'negative-numbers' && (
          <div className="space-y-2 bg-rose-50/40 p-3.5 rounded-xl border border-rose-200">
            <p className="text-sm font-semibold text-slate-800">{exercise.questionText}</p>
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                disabled={isLocked}
                value={attempt.userValues.answer || ''}
                onChange={(e) => setFieldValue('answer', e.target.value)}
                placeholder="Eredmény..."
                className={`w-40 px-3 py-1.5 font-mono text-lg font-bold placeholder:font-sans placeholder:text-xs placeholder:font-normal rounded-lg border-2 outline-none print:hidden disabled:cursor-not-allowed ${
                  attempt.submitted
                    ? attempt.isCorrect
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                      : 'border-rose-500 bg-rose-50 text-rose-900'
                    : 'border-slate-300 focus:border-indigo-600 bg-white'
                }`}
              />
              <span className="hidden print:inline-block border-b border-slate-400 w-32 h-6" />
              <span className="font-mono font-bold text-slate-700">{exercise.unit}</span>
              {showCorrectAnswer && !attempt.isCorrect && (
                <span className="text-xs text-rose-600 font-semibold print:hidden">
                  Helyes válasz: <strong>{exercise.exactResult} {exercise.unit}</strong>
                </span>
              )}
            </div>
          </div>
        )}

        {exercise.kind === 'roman-numerals' && (
          <div className="flex flex-wrap items-center gap-3 bg-amber-50/50 p-3.5 rounded-xl border border-amber-200">
            <span className="font-mono text-xl font-extrabold text-amber-900 px-3 py-1 bg-white rounded-lg border border-amber-200">
              {exercise.promptValue}
            </span>
            <span className="font-bold text-slate-500">→</span>
            <input
              type="text"
              disabled={isLocked}
              value={attempt.userValues.answer || ''}
              onChange={(e) => setFieldValue('answer', e.target.value)}
              placeholder={
                exercise.direction === 'roman-to-arabic' ? 'Arab számmal...' : 'Római számmal...'
              }
              className={`w-48 px-3 py-1.5 font-mono text-lg font-bold uppercase placeholder:normal-case placeholder:font-sans placeholder:text-xs placeholder:font-normal rounded-lg border-2 outline-none print:hidden disabled:cursor-not-allowed ${
                attempt.submitted
                  ? attempt.isCorrect
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                    : 'border-rose-500 bg-rose-50 text-rose-900'
                  : 'border-slate-300 focus:border-indigo-600 bg-white'
              }`}
            />
            <span className="hidden print:inline-block border-b border-slate-400 w-36 h-6" />
            {showCorrectAnswer && !attempt.isCorrect && (
              <span className="text-xs text-rose-600 font-semibold print:hidden">
                Helyes válasz: <strong>{exercise.exactAnswer}</strong>
              </span>
            )}
          </div>
        )}

        {exercise.kind === 'word-problem' && (
          <div className="space-y-3 bg-violet-50/40 p-4 rounded-xl border border-violet-200">
            <p className="text-slate-800 font-medium leading-relaxed">{exercise.story}</p>
            <p className="text-sm font-bold text-violet-950">{exercise.question}</p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Válasz:
              </span>
              <input
                type="text"
                inputMode="numeric"
                disabled={isLocked}
                value={attempt.userValues.answer || ''}
                onChange={(e) => setFieldValue('answer', e.target.value)}
                placeholder="Számérték..."
                className={`w-40 px-3 py-1.5 font-mono text-lg font-bold placeholder:font-sans placeholder:text-xs placeholder:font-normal rounded-lg border-2 outline-none print:hidden disabled:cursor-not-allowed ${
                  attempt.submitted
                    ? attempt.isCorrect
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                      : 'border-rose-500 bg-rose-50 text-rose-900'
                    : 'border-slate-300 focus:border-indigo-600 bg-white'
                }`}
              />
              <span className="hidden print:inline-block border-b border-slate-400 w-40 h-6" />
              {exercise.unit && (
                <span className="font-mono font-bold text-slate-700">{exercise.unit}</span>
              )}
              {showCorrectAnswer && !attempt.isCorrect && (
                <span className="text-xs text-rose-600 font-semibold print:hidden">
                  Megoldás: {exercise.solutionSteps} →{' '}
                  <strong>
                    {exercise.exactResult} {exercise.unit}
                  </strong>
                </span>
              )}
            </div>
          </div>
        )}

        {exercise.kind === 'hu-choice' && (() => {
          const selected = attempt.userValues.answer || '';
          return (
            <div className="space-y-3 bg-indigo-50/40 p-4 rounded-xl border border-indigo-200">
              <div className="bg-white px-3.5 py-2.5 rounded-xl border border-indigo-100 shadow-sm">
                <p className="text-sm sm:text-base font-bold text-slate-800 leading-relaxed">
                  {exercise.promptText}
                </p>
                {exercise.contextNote && (
                  <p className="text-xs text-slate-500 mt-1">{exercise.contextNote}</p>
                )}
              </div>

              {/* Interactive Choice Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 print:hidden">
                {exercise.options.map((opt, oIdx) => {
                  const isSelected = selected === opt;
                  const isCorrectOption = opt === exercise.correctOption;
                  let btnStyle =
                    'border-slate-300 bg-white text-slate-800 hover:border-indigo-400 hover:bg-indigo-50/40';

                  if (attempt.submitted) {
                    if (isSelected && isCorrectOption) {
                      btnStyle = 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500/20';
                    } else if (isSelected && !isCorrectOption) {
                      btnStyle = 'border-rose-500 bg-rose-50 text-rose-950 ring-2 ring-rose-500/20';
                    } else if (showCorrectAnswer && isCorrectOption) {
                      btnStyle = 'border-emerald-500 bg-emerald-50/70 text-emerald-900';
                    } else {
                      btnStyle = 'border-slate-200 bg-slate-50 text-slate-500 opacity-75';
                    }
                  } else if (isSelected) {
                    btnStyle = 'border-indigo-600 bg-indigo-50 text-indigo-950 ring-2 ring-indigo-600/20';
                  }

                  const optionLetters = ['A', 'B', 'C', 'D', 'E'];

                  return (
                    <button
                      key={oIdx}
                      type="button"
                      disabled={isLocked}
                      onClick={() => setFieldValue('answer', opt)}
                      className={`text-left px-3.5 py-2.5 rounded-xl border-2 text-xs sm:text-sm font-semibold transition flex items-start gap-2.5 disabled:cursor-not-allowed ${btnStyle}`}
                    >
                      <span
                        className={`w-6 h-6 rounded-lg text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected
                            ? attempt.submitted
                              ? isCorrectOption
                                ? 'bg-emerald-600 text-white'
                                : 'bg-rose-600 text-white'
                              : 'bg-indigo-600 text-white'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {optionLetters[oIdx] || oIdx + 1}
                      </span>
                      <span className="leading-snug">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Printable Checkboxes */}
              <div className="hidden print:grid grid-cols-2 gap-2 pt-1 text-xs">
                {exercise.options.map((opt, oIdx) => (
                  <div key={oIdx} className="flex items-start gap-2">
                    <span className="inline-block w-4 h-4 border border-slate-500 rounded-sm shrink-0 mt-0.5" />
                    <span>{opt}</span>
                  </div>
                ))}
              </div>

              {attempt.submitted && (
                <p
                  className={`text-xs font-medium print:hidden ${
                    attempt.isCorrect ? 'text-emerald-800' : 'text-rose-700'
                  }`}
                >
                  { !attempt.isCorrect && (
                    <span>
                      Helyes válasz: <strong>{exercise.correctOption}</strong>.{' '}
                    </span>
                  )}
                  <span>{exercise.explanation}</span>
                </p>
              )}
            </div>
          );
        })()}

        {exercise.kind === 'hu-text-input' && (
          <div className="space-y-3 bg-amber-50/40 p-4 rounded-xl border border-amber-200">
            <p className="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed bg-white px-3.5 py-2.5 rounded-xl border border-amber-100 shadow-sm">
              {exercise.beforeText}
            </p>
            <div className="flex flex-wrap items-center gap-2.5">
              {exercise.targetLabel && (
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  {exercise.targetLabel}
                </span>
              )}
              <input
                type="text"
                disabled={isLocked}
                value={attempt.userValues.answer || ''}
                onChange={(e) => setFieldValue('answer', e.target.value)}
                placeholder={exercise.placeholder || 'Írd be a választ...'}
                className={`w-56 px-3 py-1.5 text-base font-bold placeholder:font-sans placeholder:text-xs placeholder:font-normal rounded-lg border-2 outline-none print:hidden disabled:cursor-not-allowed ${
                  attempt.submitted
                    ? attempt.isCorrect
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                      : 'border-rose-500 bg-rose-50 text-rose-900'
                    : 'border-slate-300 focus:border-indigo-600 bg-white'
                }`}
              />
              <span className="hidden print:inline-block border-b border-slate-400 w-48 h-6" />
              {exercise.afterText && (
                <span className="text-sm font-semibold text-slate-700">{exercise.afterText}</span>
              )}
            </div>
            {showCorrectAnswer && !attempt.isCorrect && (
              <p className="text-xs text-rose-600 font-semibold print:hidden">
                Helyes válasz: <strong>{exercise.exactAnswer}</strong>
                {exercise.explanation ? ` — ${exercise.explanation}` : ''}
              </p>
            )}
          </div>
        )}

        {exercise.kind === 'hu-triad' && (() => {
          const f0 = exercise.fields[0];
          const f1 = exercise.fields[1];
          const f2 = exercise.fields[2];
          const ok0 = checkHungarianAnswer(attempt.userValues.f0 || '', f0.exactAnswer, f0.acceptedAnswers, f0.caseSensitive);
          const ok1 = checkHungarianAnswer(attempt.userValues.f1 || '', f1.exactAnswer, f1.acceptedAnswers, f1.caseSensitive);
          const ok2 = checkHungarianAnswer(attempt.userValues.f2 || '', f2.exactAnswer, f2.acceptedAnswers, f2.caseSensitive);
          const okList = [ok0, ok1, ok2];

          return (
            <div className="space-y-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div className="inline-block px-3 py-1 rounded-lg bg-indigo-600 text-white text-xs font-extrabold shadow-sm print:bg-slate-100 print:text-slate-900 print:border print:border-slate-400">
                {exercise.headerBadge}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {exercise.fields.map((field, fIdx) => {
                  const key = `f${fIdx}`;
                  const isFieldOk = okList[fIdx];
                  const val = attempt.userValues[key] || '';

                  return (
                    <div
                      key={key}
                      className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col justify-between gap-2 shadow-sm"
                    >
                      <label className="block text-xs font-bold text-slate-700 leading-snug">
                        {fIdx + 1}) {field.label}
                      </label>
                      <div className="flex items-center gap-1.5">
                        {field.prefix && (
                          <span className="text-xs font-semibold text-slate-500 shrink-0">
                            {field.prefix}
                          </span>
                        )}
                        <input
                          type="text"
                          disabled={attempt.submitted && (!allowAnswerEdit || isFieldOk)}
                          value={val}
                          onChange={(e) => setFieldValue(key, e.target.value)}
                          placeholder={field.placeholder || 'Válasz...'}
                          className={`w-full px-2.5 py-1.5 text-sm font-bold placeholder:font-sans placeholder:text-xs placeholder:font-normal rounded-lg border-2 outline-none print:hidden disabled:cursor-not-allowed ${
                            attempt.submitted
                              ? isFieldOk
                                ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                                : 'border-rose-500 bg-rose-50 text-rose-900'
                              : 'border-slate-300 focus:border-indigo-600 bg-white'
                          }`}
                        />
                        {field.suffix && (
                          <span className="text-xs font-semibold text-slate-500 shrink-0">
                            {field.suffix}
                          </span>
                        )}
                        <div className="hidden print:block w-full h-7 border-b border-slate-400" />
                      </div>
                    </div>
                  );
                })}
              </div>

              {showCorrectAnswer && !attempt.isCorrect && (
                <p className="text-xs text-rose-600 font-medium print:hidden">
                  Helyes megoldások: 1) <strong>{f0.exactAnswer}</strong> | 2){' '}
                  <strong>{f1.exactAnswer}</strong> | 3) <strong>{f2.exactAnswer}</strong>
                </p>
              )}
            </div>
          );
        })()}
      </div>

      {/* Card Footer with immediate check button (hidden on print) */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-2 print:hidden">
        {attempt.submitted && allowAnswerEdit && (
          <button
            type="button"
            onClick={resetAttempt}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Törlés
          </button>
        )}
        <button
          type="button"
          disabled={isLocked}
          onClick={evaluateCurrentExercise}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 whitespace-nowrap shrink-0"
        >
          <CheckCircle2 className="w-4 h-4" /> {isLocked ? 'Ellenőrizve' : 'Azonnali ellenőrzés'}
        </button>
      </div>
    </div>
  );
};
