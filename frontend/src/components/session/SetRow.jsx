import { Check, Trash2 } from 'lucide-react'

const REST_OPTIONS = [
  { label: '30s', value: 30 },
  { label: '45s', value: 45 },
  { label: '60s', value: 60 },
  { label: '90s', value: 90 },
  { label: '2m',  value: 120 },
  { label: '3m',  value: 180 },
  { label: '5m',  value: 300 },
]

const inputCls = 'w-full text-sm text-center bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 rounded-lg px-1 py-1.5 focus:outline-none focus:border-green-500 disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:text-gray-400 dark:disabled:text-gray-500'

const SetRow = ({ set, exerciseId, prevSet, onUpdate, onRemove, onToggleComplete }) => {
  const change = (field, raw) => {
    const value = field === 'restSeconds' ? Number(raw) : parseFloat(raw) || 0
    onUpdate(exerciseId, set.id, field, value)
  }

  return (
    <div
      className={`grid items-center gap-1.5 py-2 border-b border-gray-50 dark:border-gray-800 last:border-0 ${set.completed ? 'opacity-55' : ''}`}
      style={{ gridTemplateColumns: '22px 1fr 1fr 68px 30px 22px' }}
    >
      {/* Set number */}
      <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 text-center">{set.setNumber}</span>

      {/* Weight */}
      <div>
        <input
          type="number"
          min={0}
          step={0.5}
          value={set.weight === 0 && !set.completed ? '' : set.weight}
          onChange={e => change('weight', e.target.value)}
          disabled={set.completed}
          placeholder={prevSet ? String(prevSet.weight) : '0'}
          className={inputCls}
        />
        {prevSet && (
          <p className="text-[9px] text-gray-300 dark:text-gray-600 text-center mt-0.5">{prevSet.weight}kg</p>
        )}
      </div>

      {/* Reps */}
      <div>
        <input
          type="number"
          min={0}
          value={set.reps === 0 && !set.completed ? '' : set.reps}
          onChange={e => change('reps', e.target.value)}
          disabled={set.completed}
          placeholder={prevSet ? String(prevSet.reps) : '10'}
          className={inputCls}
        />
        {prevSet && (
          <p className="text-[9px] text-gray-300 dark:text-gray-600 text-center mt-0.5">{prevSet.reps}r</p>
        )}
      </div>

      {/* Rest time */}
      <select
        value={set.restSeconds}
        onChange={e => change('restSeconds', e.target.value)}
        disabled={set.completed}
        className="text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg px-1 py-1.5 focus:outline-none focus:border-green-500 disabled:opacity-60 cursor-pointer"
      >
        {REST_OPTIONS.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      {/* Complete toggle */}
      <button
        onClick={() => onToggleComplete(exerciseId, set.id, set.restSeconds)}
        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
          set.completed
            ? 'bg-green-500 text-white'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 hover:bg-green-50 dark:hover:bg-green-950 hover:text-green-500 dark:hover:text-green-400'
        }`}
      >
        <Check size={13} strokeWidth={2.5} />
      </button>

      {/* Delete */}
      <button
        onClick={() => onRemove(exerciseId, set.id)}
        className="text-gray-300 dark:text-gray-600 hover:text-red-400 dark:hover:text-red-500 transition-colors cursor-pointer flex items-center justify-center"
      >
        <Trash2 size={13} />
      </button>
    </div>
  )
}

export default SetRow
