import { useState } from 'react'
import { MUSCLE_GROUPS } from '../../constants/muscles'
import Input from '../ui/Input'
import Button from '../ui/Button'

const EQUIPMENT_OPTIONS = [
  'Barbell', 'Dumbbell', 'Cable', 'Machine', 'Bodyweight', 'EZ-Bar', 'Kettlebell', 'Bands', 'Other',
]

const CATEGORY_OPTIONS = ['compound', 'isolation']

const emptyForm = { name: '', muscles: [], equipment: 'Barbell', category: 'compound' }

const AddCustomExerciseForm = ({ onSave, onCancel }) => {
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')

  const toggleMuscle = (id) =>
    setForm(prev => ({
      ...prev,
      muscles: prev.muscles.includes(id)
        ? prev.muscles.filter(m => m !== id)
        : [...prev.muscles, id],
    }))

  const handleSave = () => {
    if (!form.name.trim()) { setError('Exercise name is required.'); return }
    if (form.muscles.length === 0) { setError('Select at least one muscle.'); return }
    setError('')
    onSave({
      id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: form.name.trim(),
      muscles: form.muscles,
      equipment: form.equipment,
      category: form.category,
      difficulty: 'beginner',
      suggestedSets: 3,
      suggestedReps: 10,
      isCustom: true,
    })
    setForm(emptyForm)
  }

  return (
    <div className="flex flex-col gap-4 p-5">
      <Input
        label="Exercise Name"
        placeholder="e.g. Incline Cable Fly"
        value={form.name}
        onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
        required
      />

      <div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Target Muscles <span className="text-red-500">*</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {MUSCLE_GROUPS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => toggleMuscle(id)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer capitalize ${
                form.muscles.includes(id)
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Equipment</p>
        <select
          value={form.equipment}
          onChange={e => setForm(prev => ({ ...prev, equipment: e.target.value }))}
          className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-green-500 cursor-pointer"
        >
          {EQUIPMENT_OPTIONS.map(eq => <option key={eq} value={eq}>{eq}</option>)}
        </select>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</p>
        <div className="flex gap-2">
          {CATEGORY_OPTIONS.map(cat => (
            <button
              key={cat}
              onClick={() => setForm(prev => ({ ...prev, category: cat }))}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer capitalize ${
                form.category === cat
                  ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-red-500 dark:text-red-400">{error}</p>}

      <div className="flex gap-2 pt-1">
        {onCancel && (
          <Button variant="secondary" onClick={onCancel} className="flex-1">Cancel</Button>
        )}
        <Button onClick={handleSave} className="flex-1">Save Exercise</Button>
      </div>
    </div>
  )
}

export default AddCustomExerciseForm
