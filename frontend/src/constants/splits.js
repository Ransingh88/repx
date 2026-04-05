// Workout split definitions — add new splits here without changing any other code (OCP)
// Each schedule entry lists the exercise IDs to pre-load for that day
export const SPLITS = [
  {
    id: 'PPL',
    name: 'Push / Pull / Legs',
    description: 'High-frequency training hitting each muscle twice a week. Best for intermediate lifters.',
    daysPerWeek: 6,
    color: 'green',
    schedule: [
      { name: 'Push A',  muscles: ['chest', 'shoulders', 'triceps'],         exercises: ['chest-001', 'chest-002', 'sh-001', 'sh-002', 'tr-001', 'tr-003'] },
      { name: 'Pull A',  muscles: ['back', 'biceps'],                        exercises: ['back-002', 'back-003', 'back-007', 'bi-001', 'bi-002'] },
      { name: 'Legs A',  muscles: ['quads', 'hamstrings', 'glutes', 'calves'], exercises: ['qd-001', 'qd-002', 'hm-001', 'hm-002', 'gl-001', 'cv-001'] },
      { name: 'Push B',  muscles: ['chest', 'shoulders', 'triceps'],         exercises: ['chest-007', 'chest-003', 'sh-004', 'sh-005', 'tr-002', 'tr-004'] },
      { name: 'Pull B',  muscles: ['back', 'biceps'],                        exercises: ['back-001', 'back-004', 'back-006', 'bi-003', 'bi-004'] },
      { name: 'Legs B',  muscles: ['quads', 'hamstrings', 'glutes', 'calves'], exercises: ['qd-003', 'qd-005', 'hm-003', 'gl-002', 'cv-002'] },
    ],
  },
  {
    id: 'UPPER_LOWER',
    name: 'Upper / Lower',
    description: 'Balanced split training upper and lower body twice a week. Great for strength and size.',
    daysPerWeek: 4,
    color: 'blue',
    schedule: [
      { name: 'Upper A', muscles: ['chest', 'back', 'shoulders', 'biceps', 'triceps'], exercises: ['chest-001', 'back-002', 'sh-001', 'bi-001', 'tr-001'] },
      { name: 'Lower A', muscles: ['quads', 'hamstrings', 'glutes', 'calves'],         exercises: ['qd-001', 'hm-001', 'gl-001', 'qd-004', 'cv-001'] },
      { name: 'Upper B', muscles: ['chest', 'back', 'shoulders', 'biceps', 'triceps'], exercises: ['chest-002', 'back-003', 'sh-004', 'bi-002', 'tr-002'] },
      { name: 'Lower B', muscles: ['quads', 'hamstrings', 'glutes', 'calves'],         exercises: ['qd-002', 'hm-002', 'gl-002', 'qd-005', 'cv-002'] },
    ],
  },
  {
    id: 'BRO_SPLIT',
    name: 'Bro Split',
    description: 'Classic bodybuilding split — one muscle group per day. Great for isolation focus.',
    daysPerWeek: 5,
    color: 'purple',
    schedule: [
      { name: 'Chest',     muscles: ['chest'],             exercises: ['chest-001', 'chest-002', 'chest-003', 'chest-005', 'chest-006'] },
      { name: 'Back',      muscles: ['back'],               exercises: ['back-001', 'back-002', 'back-003', 'back-004', 'back-006'] },
      { name: 'Shoulders', muscles: ['shoulders'],          exercises: ['sh-001', 'sh-002', 'sh-004', 'sh-005', 'sh-006'] },
      { name: 'Arms',      muscles: ['biceps', 'triceps'],  exercises: ['bi-001', 'bi-002', 'bi-004', 'tr-001', 'tr-003', 'tr-002'] },
      { name: 'Legs',      muscles: ['quads', 'hamstrings', 'glutes', 'calves'], exercises: ['qd-001', 'qd-002', 'hm-001', 'gl-001', 'cv-001'] },
    ],
  },
  {
    id: 'FULL_BODY',
    name: 'Full Body',
    description: 'Train every muscle group each session. Ideal for beginners and maximum frequency.',
    daysPerWeek: 3,
    color: 'orange',
    schedule: [
      { name: 'Full Body A', muscles: ['chest', 'back', 'shoulders', 'quads', 'hamstrings', 'core'], exercises: ['chest-001', 'back-002', 'sh-001', 'qd-001', 'hm-001', 'core-001'] },
      { name: 'Full Body B', muscles: ['chest', 'back', 'shoulders', 'quads', 'hamstrings', 'core'], exercises: ['chest-002', 'back-003', 'sh-004', 'qd-002', 'hm-002', 'core-003'] },
      { name: 'Full Body C', muscles: ['chest', 'back', 'biceps', 'triceps', 'quads', 'core'],       exercises: ['chest-007', 'back-001', 'bi-001', 'tr-001', 'qd-005', 'core-004'] },
    ],
  },
  {
    id: 'ARNOLD',
    name: 'Arnold Split',
    description: "Chest/Back, Shoulders/Arms, Legs on alternating days — Arnold's classic 6-day program.",
    daysPerWeek: 6,
    color: 'red',
    schedule: [
      { name: 'Chest & Back A',      muscles: ['chest', 'back'],                      exercises: ['chest-001', 'chest-003', 'back-002', 'back-004', 'back-007'] },
      { name: 'Shoulders & Arms A',  muscles: ['shoulders', 'biceps', 'triceps'],     exercises: ['sh-001', 'sh-002', 'bi-001', 'bi-002', 'tr-001', 'tr-002'] },
      { name: 'Legs & Core A',       muscles: ['quads', 'hamstrings', 'glutes', 'calves', 'core'], exercises: ['qd-001', 'hm-001', 'gl-001', 'cv-001', 'core-001'] },
      { name: 'Chest & Back B',      muscles: ['chest', 'back'],                      exercises: ['chest-002', 'chest-005', 'back-001', 'back-003', 'back-006'] },
      { name: 'Shoulders & Arms B',  muscles: ['shoulders', 'biceps', 'triceps'],     exercises: ['sh-004', 'sh-005', 'bi-003', 'bi-004', 'tr-003', 'tr-004'] },
      { name: 'Legs & Core B',       muscles: ['quads', 'hamstrings', 'glutes', 'calves', 'core'], exercises: ['qd-002', 'qd-005', 'hm-002', 'cv-002', 'core-003'] },
    ],
  },
]
