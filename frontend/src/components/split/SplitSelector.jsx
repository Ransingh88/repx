import SplitCard from './SplitCard'
import { SPLITS } from '../../constants/splits'

/**
 * Renders all available splits and manages selection state.
 * OCP: new splits are added to constants/splits.js only — this component needs no changes.
 */
const SplitSelector = ({ selected, onSelect }) => (
  <div className="flex flex-col gap-3">
    {SPLITS.map(split => (
      <SplitCard
        key={split.id}
        split={split}
        selected={selected === split.id}
        onSelect={onSelect}
      />
    ))}
  </div>
)

export default SplitSelector
