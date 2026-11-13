import { useMemo, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Award,
  BookOpen,
  Calculator,
  Check,
  CheckCheck,
  ChevronDown,
  ChevronUp,
  Clock,
  Compass,
  Divide,
  Grid,
  Hash,
  PieChart,
  Printer,
  RefreshCw,
  Ruler,
  Shapes,
  Sparkles,
  ThermometerSnowflake,
  Trophy,
  Wallet,
} from 'lucide-react';
import { GRADES, SUBJECTS, TOPICS } from './data/curriculum';
import {
  Exercise,
  ExerciseAttemptState,
  GradeId,
  SubjectId,
  VolumeFilter,
} from './types/curriculum';
import { generateWorksheet } from './generators/mathGrade4';
import { generateMathGrade3Worksheet } from './generators/mathGrade3';
import { generateMathGrade2Worksheet } from './generators/mathGrade2';
import { generateHungarianWorksheet } from './generators/hungarianGrade4';
import { checkHungarianAnswer, ExerciseCard } from './components/ExerciseCard';

declare const __APP_VERSION__: string;

function generateAnyWorksheet(topicId: string, count: number): Exercise[] {
  if (topicId.startsWith('magyar-')) {
    return generateHungarianWorksheet(topicId, count);
  }
  if (topicId.startsWith('matek-3-')) {
    return generateMathGrade3Worksheet(topicId, count);
  }
  if (topicId.startsWith('matek-2-')) {
    return generateMathGrade2Worksheet(topicId, count);
  }
  return generateWorksheet(topicId, count);
}

function getMaxScoreForExercise(ex: Exercise): number {
  if (ex.kind === 'written-arithmetic' || ex.kind === 'written-division') return 2;
  if (ex.kind === 'rounding-neighbors' || ex.kind === 'hu-triad') return 3;
  return 1;
}

function normalizeNumberInput(str: string): string {
  return str.replace(/\s+/g, '').replace(',', '.').trim();
}

function evaluateSingleAttempt(ex: Exercise, userValues: Record<string, string>): {
  isCorrect: boolean;
  score: number;
  maxScore: number;
} {
  switch (ex.kind) {
    case 'written-arithmetic': {
      const userEst = normalizeNumberInput(userValues.estimate || '');
      const userExact = normalizeNumberInput(userValues.exact || '');
      const estOk = userEst !== '' && Number(userEst) === ex.estimatedResult;
      const exactOk = userExact !== '' && Number(userExact) === ex.exactResult;
      return {
        isCorrect: estOk && exactOk,
        score: (estOk ? 1 : 0) + (exactOk ? 1 : 0),
        maxScore: 2,
      };
    }
    case 'written-division': {
      const userQ = normalizeNumberInput(userValues.quotient || '');
      const userR = normalizeNumberInput(
        userValues.remainder === undefined || userValues.remainder === ''
          ? '0'
          : userValues.remainder
      );
      const qOk = userQ !== '' && Number(userQ) === ex.quotient;
      const rOk = userQ !== '' && Number(userR) === ex.remainder;
      return {
        isCorrect: qOk && rOk,
        score: (qOk ? 1 : 0) + (rOk ? 1 : 0),
        maxScore: 2,
      };
    }
    case 'rounding-neighbors': {
      const sVal = normalizeNumberInput(userValues.smaller || '');
      const lVal = normalizeNumberInput(userValues.larger || '');
      const rVal = normalizeNumberInput(userValues.rounded || '');
      const sOk = sVal !== '' && Number(sVal) === ex.item.smallerNeighbor;
      const lOk = lVal !== '' && Number(lVal) === ex.item.largerNeighbor;
      const rOk = rVal !== '' && Number(rVal) === ex.item.rounded;
      return {
        isCorrect: sOk && lOk && rOk,
        score: (sOk ? 1 : 0) + (lOk ? 1 : 0) + (rOk ? 1 : 0),
        maxScore: 3,
      };
    }
    case 'roman-numerals': {
      const raw = (userValues.answer || '').trim().toUpperCase().replace(/\.$/, '');
      const expected = ex.exactAnswer.trim().toUpperCase().replace(/\.$/, '');
      const ok = raw !== '' && raw === expected;
      return { isCorrect: ok, score: ok ? 1 : 0, maxScore: 1 };
    }
    case 'hu-choice': {
      const selected = userValues.answer || '';
      const ok = selected !== '' && selected === ex.correctOption;
      return { isCorrect: ok, score: ok ? 1 : 0, maxScore: 1 };
    }
    case 'hu-text-input': {
      const ok = checkHungarianAnswer(
        userValues.answer || '',
        ex.exactAnswer,
        ex.acceptedAnswers,
        ex.caseSensitive
      );
      return { isCorrect: ok, score: ok ? 1 : 0, maxScore: 1 };
    }
    case 'hu-triad': {
      const f0 = ex.fields[0];
      const f1 = ex.fields[1];
      const f2 = ex.fields[2];
      const ok0 = checkHungarianAnswer(userValues.f0 || '', f0.exactAnswer, f0.acceptedAnswers, f0.caseSensitive);
      const ok1 = checkHungarianAnswer(userValues.f1 || '', f1.exactAnswer, f1.acceptedAnswers, f1.caseSensitive);
      const ok2 = checkHungarianAnswer(userValues.f2 || '', f2.exactAnswer, f2.acceptedAnswers, f2.caseSensitive);
      const score = (ok0 ? 1 : 0) + (ok1 ? 1 : 0) + (ok2 ? 1 : 0);
      return {
        isCorrect: ok0 && ok1 && ok2,
        score,
        maxScore: 3,
      };
    }
    default: {
      const raw = normalizeNumberInput(userValues.answer || '');
      const ok = raw !== '' && Number(raw) === ex.exactResult;
      return { isCorrect: ok, score: ok ? 1 : 0, maxScore: 1 };
    }
  }
}

export function App() {
  const [selectedSubject, setSelectedSubject] = useState<SubjectId>('matek');
  const [selectedGrade, setSelectedGrade] = useState<GradeId>(4);
  const [volumeFilter, setVolumeFilter] = useState<VolumeFilter>('all');
  const [selectedTopicId, setSelectedTopicId] = useState<string>('matek-4-1000-ismetles');
  const [isTopicPickerOpen, setIsTopicPickerOpen] = useState<boolean>(false);
  const [exerciseCount, setExerciseCount] = useState<number>(6);
  const [allowAnswerEdit, setAllowAnswerEdit] = useState<boolean>(false);
  const [includePrintKey, setIncludePrintKey] = useState<boolean>(true);

  const [exercises, setExercises] = useState<Exercise[]>(() =>
    generateAnyWorksheet('matek-4-1000-ismetles', 6)
  );

  const [attempts, setAttempts] = useState<Record<string, ExerciseAttemptState>>(() => {
    const map: Record<string, ExerciseAttemptState> = {};
    for (const ex of exercises) {
      map[ex.id] = {
        exerciseId: ex.id,
        submitted: false,
        isCorrect: false,
        score: 0,
        maxScore: getMaxScoreForExercise(ex),
        userValues: {},
      };
    }
    return map;
  });

  const filteredTopics = useMemo(
    () =>
      TOPICS.filter(
        (t) =>
          t.subjectId === selectedSubject &&
          t.grade === selectedGrade &&
          (volumeFilter === 'all' || t.volumeId === volumeFilter)
      ).sort((a, b) => a.chapterOrder - b.chapterOrder),
    [selectedSubject, selectedGrade, volumeFilter]
  );

  const activeTopic = useMemo(
    () => TOPICS.find((t) => t.id === selectedTopicId) || filteredTopics[0],
    [selectedTopicId, filteredTopics]
  );

  const summaryBoxRef = useRef<HTMLElement | null>(null);

  const handleRegenerate = (topicId = selectedTopicId, count = exerciseCount) => {
    const nextExercises = generateAnyWorksheet(topicId, count);
    setExercises(nextExercises);
    const nextAttempts: Record<string, ExerciseAttemptState> = {};
    for (const ex of nextExercises) {
      nextAttempts[ex.id] = {
        exerciseId: ex.id,
        submitted: false,
        isCorrect: false,
        score: 0,
        maxScore: getMaxScoreForExercise(ex),
        userValues: {},
      };
    }
    setAttempts(nextAttempts);
  };

  const handleSelectSubject = (subjId: SubjectId) => {
    if (subjId === selectedSubject) return;
    setSelectedSubject(subjId);
    setVolumeFilter('all');
    let firstTopic = TOPICS.find((t) => t.subjectId === subjId && t.grade === selectedGrade);
    if (!firstTopic) {
      firstTopic = TOPICS.find((t) => t.subjectId === subjId);
      if (firstTopic) {
        setSelectedGrade(firstTopic.grade);
      }
    }
    if (firstTopic) {
      setSelectedTopicId(firstTopic.id);
      handleRegenerate(firstTopic.id, exerciseCount);
    }
  };

  const handleSelectGrade = (gradeId: GradeId) => {
    if (gradeId === selectedGrade) return;
    setSelectedGrade(gradeId);
    setVolumeFilter('all');
    let firstTopic = TOPICS.find((t) => t.subjectId === selectedSubject && t.grade === gradeId);
    if (!firstTopic) {
      firstTopic = TOPICS.find((t) => t.grade === gradeId);
      if (firstTopic) {
        setSelectedSubject(firstTopic.subjectId);
      }
    }
    if (firstTopic) {
      setSelectedTopicId(firstTopic.id);
      handleRegenerate(firstTopic.id, exerciseCount);
    }
  };

  const handleSelectTopic = (topicId: string) => {
    setSelectedTopicId(topicId);
    setIsTopicPickerOpen(false);
    handleRegenerate(topicId, exerciseCount);
  };

  const handleCheckAll = () => {
    const nextAttempts: Record<string, ExerciseAttemptState> = {};
    let totalEarned = 0;
    let totalPossible = 0;

    for (const ex of exercises) {
      const current = attempts[ex.id] || {
        exerciseId: ex.id,
        submitted: false,
        isCorrect: false,
        score: 0,
        maxScore: getMaxScoreForExercise(ex),
        userValues: {},
      };
      const evalRes = evaluateSingleAttempt(ex, current.userValues);
      totalEarned += evalRes.score;
      totalPossible += evalRes.maxScore;

      nextAttempts[ex.id] = {
        ...current,
        submitted: true,
        isCorrect: evalRes.isCorrect,
        score: evalRes.score,
        maxScore: evalRes.maxScore,
      };
    }

    setAttempts(nextAttempts);

    if (totalPossible > 0 && totalEarned / totalPossible >= 0.8) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // Ignore confetti errors in headless/print environments
      }
    }
  };

  const stats = useMemo(() => {
    let earnedScore = 0;
    let submittedMaxScore = 0;
    let totalMaxScore = 0;
    let submittedCount = 0;
    let perfectExercises = 0;

    for (const ex of exercises) {
      const att = attempts[ex.id];
      const maxS = getMaxScoreForExercise(ex);
      totalMaxScore += maxS;
      if (att?.submitted) {
        submittedCount += 1;
        earnedScore += att.score;
        submittedMaxScore += maxS;
        if (att.isCorrect) perfectExercises += 1;
      }
    }

    const percentage =
      submittedMaxScore > 0 ? Math.round((earnedScore / submittedMaxScore) * 100) : 0;

    let evaluationText = 'Kezdd el a feladatok megoldását, vagy kattints az Összes ellenőrzésére!';
    let evaluationEmoji = '✏️';
    if (submittedCount > 0) {
      if (percentage >= 90) {
        evaluationText = 'Elégedett vagyok, nagyon jól sikerült! Kitűnő munka!';
        evaluationEmoji = '😄';
      } else if (percentage >= 75) {
        evaluationText = 'Jól sikerült! Csak néhány apróságra kell figyelni.';
        evaluationEmoji = '🙂';
      } else if (percentage >= 50) {
        evaluationText = 'Még gyakorolnom kell! Nézd át a javításokat és a segítségeket.';
        evaluationEmoji = '😐';
      } else {
        evaluationText = 'Sokat kell még gyakorolnom! Használd a villanykörte tippeket!';
        evaluationEmoji = '😟';
      }
    }

    return {
      earnedScore,
      submittedMaxScore,
      totalMaxScore,
      submittedCount,
      perfectExercises,
      percentage,
      evaluationText,
      evaluationEmoji,
    };
  }, [exercises, attempts]);

  const renderTopicIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className="w-4 h-4" />;
      case 'Hash':
        return <Hash className="w-4 h-4" />;
      case 'Grid':
        return <Grid className="w-4 h-4" />;
      case 'Ruler':
        return <Ruler className="w-4 h-4" />;
      case 'ThermometerSnowflake':
        return <ThermometerSnowflake className="w-4 h-4" />;
      case 'Divide':
        return <Divide className="w-4 h-4" />;
      case 'Shapes':
        return <Shapes className="w-4 h-4" />;
      case 'PieChart':
        return <PieChart className="w-4 h-4" />;
      case 'Clock':
        return <Clock className="w-4 h-4" />;
      case 'Wallet':
        return <Wallet className="w-4 h-4" />;
      default:
        return <Award className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Navbar (Hidden in Print) */}
      <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white shadow-md print:hidden">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center shadow-inner">
              {selectedSubject === 'magyar' ? (
                <BookOpen className="w-6 h-6 text-amber-300" />
              ) : (
                <Calculator className="w-6 h-6 text-amber-300" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold tracking-tight">
                  Tudásépítő Feladatgenerátor
                </h1>
              </div>
              <p className="text-xs text-blue-100">
                Otthoni interaktív gyakorlófeladatok (NAT 2020)
              </p>
            </div>
          </div>

          {/* Subject Selector */}
          <div className="flex flex-wrap items-center gap-2">
            {SUBJECTS.map((subj) => {
              const active = subj.id === selectedSubject;
              return (
                <button
                  key={subj.id}
                  type="button"
                  disabled={!subj.available}
                  onClick={() => handleSelectSubject(subj.id)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                    active
                      ? 'bg-white text-blue-900 shadow-sm'
                      : subj.available
                      ? 'bg-white/10 text-white hover:bg-white/20'
                      : 'bg-white/5 text-blue-200/50 cursor-not-allowed'
                  }`}
                >
                  {subj.id === 'matek' && <Calculator className="w-4 h-4" />}
                  {subj.id === 'magyar' && <BookOpen className="w-4 h-4" />}
                  {subj.id === 'kornyezet' && <Compass className="w-4 h-4" />}
                  <span>{subj.name}</span>
                  {!subj.available && (
                    <span className="text-[10px] opacity-75">(Hamarosan)</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grade Selector Bar */}
        <div className="bg-blue-950/40 border-t border-white/10">
          <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2 flex items-center gap-1 sm:gap-2 overflow-x-auto">
            <span className="text-[11px] sm:text-xs font-semibold text-blue-200 shrink-0 mr-0.5 sm:mr-1">
              Évfolyam:
            </span>
            {GRADES.map((g) => {
              const isSelected = g.grade === selectedGrade;
              return (
                <button
                  key={g.grade}
                  type="button"
                  disabled={!g.available}
                  onClick={() => handleSelectGrade(g.grade)}
                  className={`px-2 sm:px-3 py-1 rounded-lg text-[11px] sm:text-xs font-bold shrink-0 transition ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 shadow-sm'
                      : g.available
                      ? 'text-blue-100 hover:bg-white/10'
                      : 'text-blue-300/40 cursor-not-allowed'
                  }`}
                >
                  {g.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl w-full mx-auto px-4 py-6 flex-1 space-y-6">
        {/* Action Toolbar, Collapsible Topic Selector & Live Score Summary (Hidden in Print) */}
        <section
          ref={summaryBoxRef}
          className="bg-gradient-to-br from-blue-100/80 via-blue-50/50 to-indigo-100/70 rounded-2xl border-2 border-blue-200 p-4 shadow-md print:hidden scroll-mt-3"
        >
          {/* Active Topic Header Bar */}
          <div className="pb-3.5 mb-3.5 border-b border-blue-200/80">
            {/* Top row: Combined Chapter Badge + Switcher Button & Volume Tag */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
              <button
                type="button"
                onClick={() => setIsTopicPickerOpen((prev) => !prev)}
                aria-expanded={isTopicPickerOpen}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition shadow-md ${
                  isTopicPickerOpen
                    ? 'bg-slate-900 text-white hover:bg-slate-800 ring-2 ring-slate-800/20'
                    : 'bg-blue-700 text-white hover:bg-blue-800 active:scale-95 ring-2 ring-blue-700/25'
                }`}
              >
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/20 text-white text-xs font-bold">
                  {activeTopic && renderTopicIcon(activeTopic.iconName)}
                  <span>{activeTopic?.badge}</span>
                </span>
                <span>{isTopicPickerOpen ? 'Fejezetek elrejtése' : 'Fejezet váltása'}</span>
                {isTopicPickerOpen ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              <span className="text-xs font-bold text-blue-900 bg-white/85 px-2.5 py-1 rounded-lg border border-blue-200 shadow-sm">
                {activeTopic?.volume}
              </span>
            </div>

            {/* Full-width Title & Description (aligned to left edge on mobile & desktop) */}
            <div
              onClick={() => setIsTopicPickerOpen((prev) => !prev)}
              className="cursor-pointer rounded-xl p-1 -m-1 hover:bg-white/40 transition"
            >
              <h2 className="text-base sm:text-lg font-extrabold text-blue-950 leading-snug">
                {activeTopic?.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 mt-1 leading-relaxed">
                {activeTopic?.description}
              </p>
            </div>

            {/* Expandable Compact Topic Selector Panel */}
            {isTopicPickerOpen && (
              <div className="mt-3.5 pt-3.5 border-t border-blue-200/80 bg-white/95 rounded-2xl p-3 border shadow-inner">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-950">
                    Válassz fejezetet ({selectedGrade}. osztály –{' '}
                    {selectedSubject === 'magyar' ? 'Magyar nyelv' : 'Matematika'})
                  </span>

                  {/* Volume Filter Pills */}
                  <div className="inline-flex bg-blue-50 p-1 rounded-xl self-start border border-blue-200">
                    {[
                      { id: 'all' as VolumeFilter, label: 'Mind (1–12.)' },
                      {
                        id: 'vol1' as VolumeFilter,
                        label: selectedSubject === 'magyar' ? 'I. rész (1–6.)' : 'I. kötet (1–6.)',
                      },
                      {
                        id: 'vol2' as VolumeFilter,
                        label: selectedSubject === 'magyar' ? 'II. rész (7–12.)' : 'II. kötet (7–12.)',
                      },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setVolumeFilter(tab.id)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                          volumeFilter === tab.id
                            ? 'bg-blue-700 text-white shadow-sm'
                            : 'text-blue-900 hover:bg-white/60'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Compact 1-col (mobile) / 2-col (tablet & desktop) Topic List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[60vh] overflow-y-auto pr-0.5">
                  {filteredTopics.map((topic) => {
                    const isSelected = topic.id === selectedTopicId;
                    return (
                      <button
                        key={topic.id}
                        type="button"
                        onClick={() => handleSelectTopic(topic.id)}
                        className={`text-left px-3 py-2.5 rounded-xl border-2 transition-all flex flex-col justify-between gap-1 ${
                          isSelected
                            ? 'border-blue-700 bg-blue-50/70 shadow-sm ring-1 ring-blue-700/20'
                            : 'border-slate-200 bg-white hover:bg-blue-50/30 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 w-full">
                          <div className="flex items-center gap-2 min-w-0">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-bold shrink-0 ${
                                isSelected
                                  ? 'bg-blue-700 text-white'
                                  : topic.volumeId === 'vol1'
                                  ? 'bg-blue-100 text-blue-900'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {renderTopicIcon(topic.iconName)}
                              <span>{topic.chapterOrder}.</span>
                            </span>
                            <span className="font-bold text-slate-900 text-xs sm:text-sm leading-snug">
                              {topic.title}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-[10px] font-semibold text-slate-400 hidden md:inline">
                              {topic.volumeId === 'vol1'
                                ? selectedSubject === 'magyar'
                                   ? 'I. rész'
                                  : 'I. kötet'
                                : selectedSubject === 'magyar'
                                ? 'II. rész'
                                : 'II. kötet'}
                            </span>
                            {isSelected && (
                              <span className="w-5 h-5 rounded-full bg-blue-700 text-white flex items-center justify-center">
                                <Check className="w-3 h-3" />
                              </span>
                            )}
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-600 leading-snug w-full">
                          {topic.subtitle}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Left controls: Count & Regenerate */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 bg-white/90 border border-indigo-200/80 px-3 py-1.5 rounded-xl shadow-sm">
                <label
                  htmlFor="count-select"
                  className="text-xs font-bold text-slate-600"
                >
                  Feladatok száma:
                </label>
                <select
                  id="count-select"
                  value={exerciseCount}
                  onChange={(e) => {
                    const nextCount = Number(e.target.value);
                    setExerciseCount(nextCount);
                    handleRegenerate(selectedTopicId, nextCount);
                  }}
                  className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 outline-none"
                >
                  <option value={4}>4 feladat (Gyors)</option>
                  <option value={6}>6 feladat (Normál)</option>
                  <option value={8}>8 feladat (Alapos)</option>
                  <option value={10}>10 feladat (Felmérő)</option>
                  <option value={12}>12 feladat (Maraton)</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => handleRegenerate(selectedTopicId, exerciseCount)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 active:scale-95 transition shadow-sm"
              >
                <RefreshCw className="w-4 h-4" /> Új feladatsor generálása
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 text-white hover:bg-slate-900 transition"
              >
                <Printer className="w-4 h-4" /> Nyomtatás (A4 feladatlap)
              </button>

              <div className="flex flex-col gap-1.5">
                <label className="inline-flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={allowAnswerEdit}
                    onChange={(e) => setAllowAnswerEdit(e.target.checked)}
                    className="rounded border-slate-300 text-slate-900 focus:ring-slate-800"
                  />
                  <span>Beírt válasz javítható</span>
                </label>

                <label className="inline-flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={includePrintKey}
                    onChange={(e) => setIncludePrintKey(e.target.checked)}
                    className="rounded border-slate-300 text-slate-900 focus:ring-slate-800"
                  />
                  <span>Megoldókulcs nyomtatása</span>
                </label>
              </div>
            </div>

            {/* Right: Percentage Evaluation Box */}
            <div className="flex items-center gap-4 bg-white/90 border border-slate-300 px-4 py-2.5 rounded-xl shadow-sm">
              <div className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-amber-500 shrink-0" />
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-extrabold text-slate-950 font-mono">
                      {stats.percentage}%
                    </span>
                    <span className="text-xs font-semibold text-slate-600">
                      ({stats.earnedScore} / {stats.submittedCount > 0 ? stats.submittedMaxScore : stats.totalMaxScore} pont • {stats.submittedCount}/{exercises.length} feladat)
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 font-medium">
                    {stats.evaluationEmoji} {stats.evaluationText}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Print Header (Visible ONLY when printing) */}
        <section className="hidden print:block border-b-2 border-slate-800 pb-4 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-xl font-bold">
                {selectedSubject === 'magyar' ? 'Magyar nyelv' : 'Matematika'} {selectedGrade}. osztály – Gyakorló feladatlap (NAT 2020)
              </h1>
              <p className="text-sm text-slate-700 font-semibold mt-0.5">
                Témakör: {activeTopic?.badge} – {activeTopic?.title} ({activeTopic?.volume})
              </p>
            </div>
            <div className="text-right text-sm space-y-1">
              <div>Név: _______________________________</div>
              <div>Dátum: ____________ Pontszám: ____ / {stats.totalMaxScore}</div>
            </div>
          </div>
        </section>

        {/* Exercises List */}
        <section className="space-y-4">
          {exercises.map((ex, idx) => {
            const att = attempts[ex.id] || {
              exerciseId: ex.id,
              submitted: false,
              isCorrect: false,
              score: 0,
              maxScore: getMaxScoreForExercise(ex),
              userValues: {},
            };
            return (
              <ExerciseCard
                key={ex.id}
                index={idx}
                exercise={ex}
                attempt={att}
                allowAnswerEdit={allowAnswerEdit}
                onUpdateAttempt={(next) =>
                  setAttempts((prev) => ({ ...prev, [ex.id]: next }))
                }
              />
            );
          })}
        </section>

        {/* Bottom Evaluation Card */}
        <section className="bg-gradient-to-br from-blue-100/80 via-blue-50/50 to-indigo-100/70 rounded-2xl border-2 border-blue-200 p-6 shadow-md print:hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-lg font-extrabold text-blue-950">
                Értékeld a munkádat! – Összesített eredmény
              </h3>
              <p className="text-xs text-slate-600">
                A munkafüzet értékelő táblázata alapján (ellenőrzött feladatok: {stats.submittedCount} / {exercises.length})
              </p>
            </div>
            <button
              type="button"
              onClick={handleCheckAll}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95 shadow-sm transition"
            >
              <CheckCheck className="w-4 h-4" /> Összes ellenőrzése & Értékelés
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-4 bg-white/90 rounded-full overflow-hidden mb-5 border border-blue-200 shadow-inner">
            <div
              className={`h-full transition-all duration-500 ${
                stats.percentage >= 85
                  ? 'bg-emerald-500'
                  : stats.percentage >= 60
                  ? 'bg-amber-500'
                  : 'bg-rose-500'
              }`}
              style={{ width: `${stats.percentage}%` }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
            {[
              {
                range: '90% – 100%',
                active: stats.submittedCount > 0 && stats.percentage >= 90,
                label: 'Elégedett vagyok, nagyon jól sikerült.',
                emoji: '😄',
              },
              {
                range: '75% – 89%',
                active:
                  stats.submittedCount > 0 &&
                  stats.percentage >= 75 &&
                  stats.percentage < 90,
                label: 'Jól sikerült.',
                emoji: '🙂',
              },
              {
                range: '50% – 74%',
                active:
                  stats.submittedCount > 0 &&
                  stats.percentage >= 50 &&
                  stats.percentage < 75,
                label: 'Még gyakorolnom kell.',
                emoji: '😐',
              },
              {
                range: '0% – 49%',
                active: stats.submittedCount > 0 && stats.percentage < 50,
                label: 'Nem sikerült, sokat kell gyakorolnom.',
                emoji: '😟',
              },
            ].map((tier, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border-2 transition ${
                  tier.active
                    ? 'border-blue-700 bg-white shadow-md scale-[1.02]'
                    : 'border-blue-200/70 bg-white/80 opacity-85'
                }`}
              >
                <div className="text-2xl mb-1">{tier.emoji}</div>
                <div className="text-xs font-extrabold text-blue-950 mb-1">
                  {tier.range}
                </div>
                <div className="text-xs font-medium text-slate-700">
                  {tier.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Printable Answer Key for Parents */}
        {includePrintKey && (
          <section className="hidden print:block pt-8 mt-8 border-t-2 border-dashed border-slate-400 break-before-page">
            <h2 className="text-lg font-bold mb-3">
              Megoldókulcs szülőknek – {activeTopic?.badge}: {activeTopic?.title}
            </h2>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {exercises.map((ex, i) => (
                <div key={ex.id} className="p-2 border border-slate-300 rounded">
                  <span className="font-bold">{i + 1}. feladat: </span>
                  {ex.kind === 'written-arithmetic' && (
                    <span>
                      Becslés: {ex.estimatedA} {ex.operation} {ex.estimatedB} ={' '}
                      <strong>{ex.estimatedResult}</strong> | Pontos eredmény:{' '}
                      <strong>{ex.exactResult}</strong>
                    </span>
                  )}
                  {ex.kind === 'written-division' && (
                    <span>
                      {ex.dividend} : {ex.divisor} = <strong>{ex.quotient}</strong>, maradék:{' '}
                      <strong>{ex.remainder}</strong>
                    </span>
                  )}
                  {ex.kind === 'rounding-neighbors' && (
                    <span>
                      Szám: {ex.item.number} → Kisebb: <strong>{ex.item.smallerNeighbor}</strong>,
                      Nagyobb: <strong>{ex.item.largerNeighbor}</strong>, Kerekítve:{' '}
                      <strong>{ex.item.rounded}</strong>
                    </span>
                  )}
                  {ex.kind === 'place-value' && (
                    <span>
                      {ex.expression} = <strong>{ex.exactResult}</strong>
                    </span>
                  )}
                  {ex.kind === 'unit-conversion' && (
                    <span>
                      {ex.sourceText} ={' '}
                      <strong>
                        {ex.exactResult} {ex.targetUnit}
                      </strong>
                    </span>
                  )}
                  {ex.kind === 'fractions' && (
                    <span>
                      {ex.wholeValue} {ex.wholeUnit}-nak a(z) {ex.denominatorLabel} ={' '}
                      <strong>
                        {ex.exactResult} {ex.wholeUnit}
                      </strong>
                    </span>
                  )}
                  {ex.kind === 'negative-numbers' && (
                    <span>
                      <strong>
                        {ex.exactResult} {ex.unit}
                      </strong>{' '}
                      ({ex.hint})
                    </span>
                  )}
                  {ex.kind === 'roman-numerals' && (
                    <span>
                      {ex.promptValue} → <strong>{ex.exactAnswer}</strong>
                    </span>
                  )}
                  {ex.kind === 'word-problem' && (
                    <span>
                      <strong>
                        {ex.exactResult} {ex.unit}
                      </strong>{' '}
                      ({ex.solutionSteps})
                    </span>
                  )}
                  {ex.kind === 'hu-choice' && (
                    <span>
                      <strong>{ex.correctOption}</strong>
                    </span>
                  )}
                  {ex.kind === 'hu-text-input' && (
                    <span>
                      <strong>{ex.exactAnswer}</strong>
                    </span>
                  )}
                  {ex.kind === 'hu-triad' && (
                    <span>
                      1) <strong>{ex.fields[0].exactAnswer}</strong> | 2){' '}
                      <strong>{ex.fields[1].exactAnswer}</strong> | 3){' '}
                      <strong>{ex.fields[2].exactAnswer}</strong>
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-xs text-slate-500 print:hidden">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 items-center gap-2">
          <span className="text-center sm:text-left">
            Készült az Oktatási Hivatal NAT 2020 munkafüzetei alapján.
          </span>
          <div className="flex justify-center">
            <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono text-[11px] font-semibold">
              v{__APP_VERSION__}
            </span>
          </div>
          <span className="text-center sm:text-right font-medium text-slate-600">
            Kapcsolat:{' '}
            <a
              href="mailto:szabobalint@outlook.com"
              className="text-slate-800 font-semibold hover:text-slate-950 hover:underline transition"
            >
              szabobalint@outlook.com
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}
export default App;
