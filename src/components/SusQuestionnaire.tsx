import { useState } from 'react'
import { SUS_ITEMS } from '../data/demoData'
import type { SusAnswer } from '../types'
import { CheckCircle2, AlertCircle } from 'lucide-react'

const LABELS: Record<number, string> = {
  1: 'Sangat Tidak Setuju',
  2: 'Tidak Setuju',
  3: 'Netral',
  4: 'Setuju',
  5: 'Sangat Setuju',
}

interface SusQuestionnaireProps {
  onSubmit: (answers: SusAnswer[]) => void
  disabled?: boolean
}

export default function SusQuestionnaire({ onSubmit, disabled = false }: SusQuestionnaireProps) {
  const [answers, setAnswers] = useState<(SusAnswer | null)[]>(Array(10).fill(null))
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const allAnswered = answers.every(a => a !== null)
  const answered = answers.filter(a => a !== null).length

  function handleSelect(itemIndex: number, value: SusAnswer) {
    setAnswers(prev => {
      const updated = [...prev]
      updated[itemIndex] = value
      return updated
    })
    setError(null)
  }

  function handleSubmit() {
    setSubmitted(true)
    if (!allAnswered) {
      const missing = answers
        .map((a, i) => (a === null ? i + 1 : null))
        .filter((v): v is number => v !== null)
      setError(`Harap jawab semua pertanyaan. Pertanyaan belum dijawab: ${missing.join(', ')}.`)
      return
    }
    setError(null)
    onSubmit(answers as SusAnswer[])
  }

  return (
    <div>
      {/* Progress */}
      <div className="mb-5">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-1.5">
          <span>Progres pengisian</span>
          <span className="font-medium tabular-nums">{answered}/10 pertanyaan dijawab</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-500 rounded-full transition-all duration-300"
            style={{ width: `${(answered / 10) * 100}%` }}
            role="progressbar"
            aria-valuenow={answered}
            aria-valuemin={0}
            aria-valuemax={10}
          />
        </div>
      </div>

      {/* Questions */}
      <fieldset className="space-y-5" disabled={disabled}>
        <legend className="sr-only">Kuesioner System Usability Scale</legend>
        {SUS_ITEMS.map((item, idx) => {
          const isUnanswered = submitted && answers[idx] === null
          return (
            <div
              key={item.number}
              className={`p-4 rounded-lg border transition-colors
                ${isUnanswered ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'}`}
            >
              <p className="text-sm font-medium text-gray-800 mb-3">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary-100 text-primary-700 text-xs font-bold mr-2 shrink-0">
                  {item.number}
                </span>
                {item.text}
              </p>
              <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={`Pertanyaan ${item.number}`}>
                {([1, 2, 3, 4, 5] as SusAnswer[]).map(val => {
                  const selected = answers[idx] === val
                  return (
                    <label
                      key={val}
                      className={`flex flex-col items-center gap-1 cursor-pointer group`}
                    >
                      <input
                        type="radio"
                        name={`sus-q${item.number}`}
                        value={val}
                        checked={selected}
                        onChange={() => handleSelect(idx, val)}
                        className="sr-only"
                        aria-label={`${LABELS[val]}`}
                      />
                      <div
                        className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center text-sm font-semibold transition-all duration-100
                          ${selected
                            ? 'border-primary-600 bg-primary-600 text-white'
                            : 'border-gray-200 text-gray-600 hover:border-primary-400 hover:bg-primary-50 group-hover:text-primary-700'
                          }`}
                      >
                        {val}
                      </div>
                      <span className="text-[10px] text-gray-400 text-center leading-tight max-w-[48px]">
                        {val === 1 ? 'Sangat\nTdk Setuju' : val === 5 ? 'Sangat\nSetuju' : LABELS[val]}
                      </span>
                    </label>
                  )
                })}
              </div>
              {isUnanswered && (
                <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle size={12} /> Pertanyaan ini belum dijawab.
                </p>
              )}
            </div>
          )
        })}
      </fieldset>

      {/* Error */}
      {error && (
        <div className="mt-4 flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Submit */}
      {!disabled && (
        <div className="mt-6 flex items-center gap-3">
          <button
            className="btn-primary"
            onClick={handleSubmit}
            aria-label="Kirim kuesioner SUS"
          >
            <CheckCircle2 size={16} />
            Kirim Kuesioner
          </button>
          <span className="text-xs text-gray-400">
            {allAnswered ? 'Semua pertanyaan telah dijawab.' : `${10 - answered} pertanyaan belum dijawab.`}
          </span>
        </div>
      )}
    </div>
  )
}
