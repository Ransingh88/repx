import SetRow from './SetRow'

const SetTable = ({ sets, exerciseId, prevSets, onUpdate, onRemove, onToggleComplete }) => (
  <div>
    {/* Column headers */}
    <div
      className="grid text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-semibold mb-1 py-1 border-b border-gray-100 dark:border-gray-800"
      style={{ gridTemplateColumns: '22px 1fr 1fr 68px 30px 22px' }}
    >
      <span className="text-center">Set</span>
      <span className="text-center">kg</span>
      <span className="text-center">Reps</span>
      <span className="text-center">Rest</span>
      <span />
      <span />
    </div>

    {sets.map((set, idx) => (
      <SetRow
        key={set.id}
        set={set}
        exerciseId={exerciseId}
        prevSet={prevSets?.[idx] ?? null}
        onUpdate={onUpdate}
        onRemove={onRemove}
        onToggleComplete={onToggleComplete}
      />
    ))}
  </div>
)

export default SetTable
