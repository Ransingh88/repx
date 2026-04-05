// Exercise library — add new entries here without touching any other code (OCP)
// id convention: {muscle_prefix}-{zero-padded number}
export const EXERCISES = [
  // ── CHEST ─────────────────────────────────────────────────────────────────
  { id: 'chest-001', name: 'Barbell Bench Press',     muscles: ['chest'],            equipment: 'Barbell',   category: 'compound',  difficulty: 'intermediate', suggestedSets: 4, suggestedReps: 8 },
  { id: 'chest-002', name: 'Incline Dumbbell Press',  muscles: ['chest', 'shoulders'], equipment: 'Dumbbell', category: 'compound',  difficulty: 'beginner',     suggestedSets: 3, suggestedReps: 10 },
  { id: 'chest-003', name: 'Cable Fly',               muscles: ['chest'],            equipment: 'Cable',     category: 'isolation', difficulty: 'beginner',     suggestedSets: 3, suggestedReps: 12 },
  { id: 'chest-004', name: 'Push-ups',                muscles: ['chest', 'triceps'], equipment: 'Bodyweight',category: 'compound',  difficulty: 'beginner',     suggestedSets: 3, suggestedReps: 15 },
  { id: 'chest-005', name: 'Chest Dips',              muscles: ['chest', 'triceps'], equipment: 'Bodyweight',category: 'compound',  difficulty: 'intermediate', suggestedSets: 3, suggestedReps: 10 },
  { id: 'chest-006', name: 'Pec Deck',                muscles: ['chest'],            equipment: 'Machine',   category: 'isolation', difficulty: 'beginner',     suggestedSets: 3, suggestedReps: 12 },
  { id: 'chest-007', name: 'Dumbbell Bench Press',    muscles: ['chest'],            equipment: 'Dumbbell',  category: 'compound',  difficulty: 'beginner',     suggestedSets: 3, suggestedReps: 10 },

  // ── BACK ──────────────────────────────────────────────────────────────────
  { id: 'back-001', name: 'Pull-ups',                 muscles: ['back', 'biceps'],   equipment: 'Bodyweight',category: 'compound',  difficulty: 'intermediate', suggestedSets: 3, suggestedReps: 8 },
  { id: 'back-002', name: 'Barbell Row',              muscles: ['back'],             equipment: 'Barbell',   category: 'compound',  difficulty: 'intermediate', suggestedSets: 4, suggestedReps: 8 },
  { id: 'back-003', name: 'Lat Pulldown',             muscles: ['back', 'biceps'],   equipment: 'Cable',     category: 'compound',  difficulty: 'beginner',     suggestedSets: 3, suggestedReps: 10 },
  { id: 'back-004', name: 'Seated Cable Row',         muscles: ['back'],             equipment: 'Cable',     category: 'compound',  difficulty: 'beginner',     suggestedSets: 3, suggestedReps: 10 },
  { id: 'back-005', name: 'Deadlift',                 muscles: ['back', 'hamstrings', 'glutes'], equipment: 'Barbell', category: 'compound', difficulty: 'advanced', suggestedSets: 4, suggestedReps: 5 },
  { id: 'back-006', name: 'Single Arm Dumbbell Row',  muscles: ['back'],             equipment: 'Dumbbell',  category: 'compound',  difficulty: 'beginner',     suggestedSets: 3, suggestedReps: 10 },
  { id: 'back-007', name: 'Face Pulls',               muscles: ['back', 'shoulders'],equipment: 'Cable',     category: 'isolation', difficulty: 'beginner',     suggestedSets: 3, suggestedReps: 15 },

  // ── SHOULDERS ─────────────────────────────────────────────────────────────
  { id: 'sh-001', name: 'Overhead Press',             muscles: ['shoulders'],        equipment: 'Barbell',   category: 'compound',  difficulty: 'intermediate', suggestedSets: 4, suggestedReps: 8 },
  { id: 'sh-002', name: 'Dumbbell Lateral Raise',     muscles: ['shoulders'],        equipment: 'Dumbbell',  category: 'isolation', difficulty: 'beginner',     suggestedSets: 3, suggestedReps: 15 },
  { id: 'sh-003', name: 'Front Raise',                muscles: ['shoulders'],        equipment: 'Dumbbell',  category: 'isolation', difficulty: 'beginner',     suggestedSets: 3, suggestedReps: 12 },
  { id: 'sh-004', name: 'Arnold Press',               muscles: ['shoulders'],        equipment: 'Dumbbell',  category: 'compound',  difficulty: 'intermediate', suggestedSets: 3, suggestedReps: 10 },
  { id: 'sh-005', name: 'Rear Delt Fly',              muscles: ['shoulders', 'back'],equipment: 'Dumbbell',  category: 'isolation', difficulty: 'beginner',     suggestedSets: 3, suggestedReps: 15 },
  { id: 'sh-006', name: 'Dumbbell Shoulder Press',    muscles: ['shoulders'],        equipment: 'Dumbbell',  category: 'compound',  difficulty: 'beginner',     suggestedSets: 3, suggestedReps: 10 },

  // ── BICEPS ────────────────────────────────────────────────────────────────
  { id: 'bi-001', name: 'Barbell Curl',               muscles: ['biceps'],           equipment: 'Barbell',   category: 'isolation', difficulty: 'beginner',     suggestedSets: 3, suggestedReps: 10 },
  { id: 'bi-002', name: 'Dumbbell Hammer Curl',       muscles: ['biceps'],           equipment: 'Dumbbell',  category: 'isolation', difficulty: 'beginner',     suggestedSets: 3, suggestedReps: 12 },
  { id: 'bi-003', name: 'Incline Dumbbell Curl',      muscles: ['biceps'],           equipment: 'Dumbbell',  category: 'isolation', difficulty: 'beginner',     suggestedSets: 3, suggestedReps: 12 },
  { id: 'bi-004', name: 'Preacher Curl',              muscles: ['biceps'],           equipment: 'EZ-Bar',    category: 'isolation', difficulty: 'intermediate', suggestedSets: 3, suggestedReps: 10 },
  { id: 'bi-005', name: 'Cable Curl',                 muscles: ['biceps'],           equipment: 'Cable',     category: 'isolation', difficulty: 'beginner',     suggestedSets: 3, suggestedReps: 12 },

  // ── TRICEPS ───────────────────────────────────────────────────────────────
  { id: 'tr-001', name: 'Tricep Pushdown',            muscles: ['triceps'],          equipment: 'Cable',     category: 'isolation', difficulty: 'beginner',     suggestedSets: 3, suggestedReps: 12 },
  { id: 'tr-002', name: 'Overhead Tricep Extension',  muscles: ['triceps'],          equipment: 'Dumbbell',  category: 'isolation', difficulty: 'beginner',     suggestedSets: 3, suggestedReps: 12 },
  { id: 'tr-003', name: 'Skull Crushers',             muscles: ['triceps'],          equipment: 'EZ-Bar',    category: 'isolation', difficulty: 'intermediate', suggestedSets: 3, suggestedReps: 10 },
  { id: 'tr-004', name: 'Tricep Dips',                muscles: ['triceps', 'chest'], equipment: 'Bodyweight',category: 'compound',  difficulty: 'intermediate', suggestedSets: 3, suggestedReps: 10 },
  { id: 'tr-005', name: 'Close Grip Bench Press',     muscles: ['triceps', 'chest'], equipment: 'Barbell',   category: 'compound',  difficulty: 'intermediate', suggestedSets: 3, suggestedReps: 8 },

  // ── QUADS ─────────────────────────────────────────────────────────────────
  { id: 'qd-001', name: 'Barbell Squat',              muscles: ['quads', 'glutes'],  equipment: 'Barbell',   category: 'compound',  difficulty: 'intermediate', suggestedSets: 4, suggestedReps: 8 },
  { id: 'qd-002', name: 'Leg Press',                  muscles: ['quads', 'glutes'],  equipment: 'Machine',   category: 'compound',  difficulty: 'beginner',     suggestedSets: 4, suggestedReps: 10 },
  { id: 'qd-003', name: 'Hack Squat',                 muscles: ['quads'],            equipment: 'Machine',   category: 'compound',  difficulty: 'intermediate', suggestedSets: 3, suggestedReps: 10 },
  { id: 'qd-004', name: 'Leg Extension',              muscles: ['quads'],            equipment: 'Machine',   category: 'isolation', difficulty: 'beginner',     suggestedSets: 3, suggestedReps: 12 },
  { id: 'qd-005', name: 'Bulgarian Split Squat',      muscles: ['quads', 'glutes'],  equipment: 'Dumbbell',  category: 'compound',  difficulty: 'intermediate', suggestedSets: 3, suggestedReps: 10 },
  { id: 'qd-006', name: 'Walking Lunges',             muscles: ['quads', 'glutes'],  equipment: 'Dumbbell',  category: 'compound',  difficulty: 'beginner',     suggestedSets: 3, suggestedReps: 12 },

  // ── HAMSTRINGS ────────────────────────────────────────────────────────────
  { id: 'hm-001', name: 'Romanian Deadlift',          muscles: ['hamstrings', 'glutes'], equipment: 'Barbell', category: 'compound', difficulty: 'intermediate', suggestedSets: 4, suggestedReps: 8 },
  { id: 'hm-002', name: 'Lying Leg Curl',             muscles: ['hamstrings'],       equipment: 'Machine',   category: 'isolation', difficulty: 'beginner',     suggestedSets: 3, suggestedReps: 12 },
  { id: 'hm-003', name: 'Seated Leg Curl',            muscles: ['hamstrings'],       equipment: 'Machine',   category: 'isolation', difficulty: 'beginner',     suggestedSets: 3, suggestedReps: 12 },
  { id: 'hm-004', name: 'Good Morning',               muscles: ['hamstrings', 'back'], equipment: 'Barbell', category: 'compound',  difficulty: 'intermediate', suggestedSets: 3, suggestedReps: 10 },

  // ── GLUTES ────────────────────────────────────────────────────────────────
  { id: 'gl-001', name: 'Hip Thrust',                 muscles: ['glutes'],           equipment: 'Barbell',   category: 'compound',  difficulty: 'intermediate', suggestedSets: 4, suggestedReps: 10 },
  { id: 'gl-002', name: 'Glute Bridge',               muscles: ['glutes'],           equipment: 'Bodyweight',category: 'compound',  difficulty: 'beginner',     suggestedSets: 3, suggestedReps: 15 },
  { id: 'gl-003', name: 'Cable Kickback',             muscles: ['glutes'],           equipment: 'Cable',     category: 'isolation', difficulty: 'beginner',     suggestedSets: 3, suggestedReps: 15 },
  { id: 'gl-004', name: 'Sumo Deadlift',              muscles: ['glutes', 'hamstrings'], equipment: 'Barbell', category: 'compound', difficulty: 'intermediate', suggestedSets: 4, suggestedReps: 6 },

  // ── CALVES ────────────────────────────────────────────────────────────────
  { id: 'cv-001', name: 'Standing Calf Raise',        muscles: ['calves'],           equipment: 'Machine',   category: 'isolation', difficulty: 'beginner',     suggestedSets: 4, suggestedReps: 15 },
  { id: 'cv-002', name: 'Seated Calf Raise',          muscles: ['calves'],           equipment: 'Machine',   category: 'isolation', difficulty: 'beginner',     suggestedSets: 3, suggestedReps: 15 },
  { id: 'cv-003', name: 'Single Leg Calf Raise',      muscles: ['calves'],           equipment: 'Bodyweight',category: 'isolation', difficulty: 'beginner',     suggestedSets: 3, suggestedReps: 15 },

  // ── CORE ──────────────────────────────────────────────────────────────────
  { id: 'core-001', name: 'Plank',                    muscles: ['core'],             equipment: 'Bodyweight',category: 'compound',  difficulty: 'beginner',     suggestedSets: 3, suggestedReps: 60 },
  { id: 'core-002', name: 'Crunches',                 muscles: ['core'],             equipment: 'Bodyweight',category: 'isolation', difficulty: 'beginner',     suggestedSets: 3, suggestedReps: 20 },
  { id: 'core-003', name: 'Hanging Leg Raises',       muscles: ['core'],             equipment: 'Bodyweight',category: 'isolation', difficulty: 'intermediate', suggestedSets: 3, suggestedReps: 12 },
  { id: 'core-004', name: 'Russian Twists',           muscles: ['core'],             equipment: 'Bodyweight',category: 'isolation', difficulty: 'beginner',     suggestedSets: 3, suggestedReps: 20 },
  { id: 'core-005', name: 'Ab Wheel Rollout',         muscles: ['core'],             equipment: 'Equipment', category: 'compound',  difficulty: 'advanced',     suggestedSets: 3, suggestedReps: 10 },
  { id: 'core-006', name: 'Cable Crunch',             muscles: ['core'],             equipment: 'Cable',     category: 'isolation', difficulty: 'beginner',     suggestedSets: 3, suggestedReps: 15 },
]
