import { useId, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { DOCUMENT_TYPES, STATUS_OPTIONS } from '../../data/documents.js'
import { Field, FieldError, Select } from '../ui/FormControls.jsx'
import { buttonClass, cx, fieldClass, labelClass } from '../ui/styles.js'

const APPLICANT_TYPES = [
  { value: 'yes', label: 'Yes', hint: 'This is my first application' },
  { value: 'no', label: 'No (Renewal)', hint: "I've been issued this document before" },
]

function validate({ age, firstTime }) {
  const errors = {}
  const ageNumber = Number(age)

  if (age === '') {
    errors.age = 'Enter your age.'
  } else if (!Number.isInteger(ageNumber) || ageNumber < 0 || ageNumber > 120) {
    errors.age = 'Enter a whole number between 0 and 120.'
  }

  if (!firstTime) errors.firstTime = 'Select whether you are a first-time applicant.'

  return errors
}

function FormStep({ number, title, children, ...props }) {
  return (
    <div className="py-6 first:pt-0 last:pb-0">
      <fieldset className="min-w-0" {...props}>
        <legend className="mb-4 w-full">
          <span className="flex items-center gap-3 text-base font-semibold text-primary">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
              {number}
            </span>
            {title}
          </span>
        </legend>
        {children}
      </fieldset>
    </div>
  )
}

export default function RequirementForm({ defaultPurpose, onSubmit }) {
  const id = useId()
  const [values, setValues] = useState({
    purpose: defaultPurpose ?? DOCUMENT_TYPES[0].id,
    age: '',
    status: STATUS_OPTIONS[0].value,
    firstTime: '',
  })
  const [errors, setErrors] = useState({})

  function handleChange(event) {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => (current[name] ? { ...current, [name]: undefined } : current))
  }

  function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = validate(values)
    const firstInvalid = Object.keys(nextErrors)[0]

    if (firstInvalid) {
      setErrors(nextErrors)
      const field = event.currentTarget.elements.namedItem(firstInvalid)
      ;(field instanceof RadioNodeList ? field[0] : field).focus()
      return
    }

    setErrors({})
    onSubmit({
      purpose: values.purpose,
      age: Number(values.age),
      status: values.status,
      isFirstTime: values.firstTime === 'yes',
    })
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="mt-6">
      <div className="divide-y divide-slate-200">
        <FormStep number={1} title="Application Purpose">
          <Field id={`${id}-purpose`} label="What document are you applying for?">
            <Select id={`${id}-purpose`} name="purpose" value={values.purpose} onChange={handleChange}>
              {DOCUMENT_TYPES.map((documentType) => (
                <option key={documentType.id} value={documentType.id}>
                  {documentType.optionLabel}
                </option>
              ))}
            </Select>
          </Field>
        </FormStep>

        <FormStep number={2} title="Personal Details">
          <Field id={`${id}-age`} label="Age" error={errors.age}>
            <input
              id={`${id}-age`}
              type="number"
              name="age"
              inputMode="numeric"
              min={0}
              max={120}
              placeholder="Enter your age"
              value={values.age}
              onChange={handleChange}
              aria-invalid={Boolean(errors.age)}
              aria-describedby={errors.age ? `${id}-age-error` : undefined}
              className={cx(fieldClass, 'sm:max-w-xs')}
            />
          </Field>
        </FormStep>

        <FormStep number={3} title="Employment / Civil Status">
          <Field id={`${id}-status`} label="Current Status">
            <Select id={`${id}-status`} name="status" value={values.status} onChange={handleChange}>
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </Field>
        </FormStep>

        <FormStep
          number={4}
          title="Applicant Type"
          aria-describedby={cx(`${id}-first-time-question`, errors.firstTime && `${id}-firstTime-error`)}
        >
          <p id={`${id}-first-time-question`} className={labelClass}>
            Are you a first-time applicant?
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {APPLICANT_TYPES.map((option) => (
              <label
                key={option.value}
                className={cx(
                  'flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border bg-white px-4 py-3 transition-colors hover:border-slate-400 has-checked:border-secondary has-checked:bg-secondary-soft has-focus-visible:ring-3 has-focus-visible:ring-secondary/30',
                  errors.firstTime ? 'border-red-600' : 'border-slate-300',
                )}
              >
                <input
                  type="radio"
                  name="firstTime"
                  value={option.value}
                  checked={values.firstTime === option.value}
                  onChange={handleChange}
                  className="size-5 shrink-0 cursor-pointer accent-secondary focus-visible:outline-none"
                />
                <span>
                  <span className="block font-semibold text-ink">{option.label}</span>
                  <span className="block text-sm text-slate-500">{option.hint}</span>
                </span>
              </label>
            ))}
          </div>
          <FieldError id={`${id}-firstTime-error`}>{errors.firstTime}</FieldError>
        </FormStep>
      </div>

      <div className="mt-8 border-t border-slate-200 pt-6">
        <button type="submit" className={buttonClass({ size: 'lg', className: 'w-full sm:w-auto' })}>
          Get My Requirements Checklist
          <ArrowRight className="hidden size-5 sm:block" aria-hidden="true" />
        </button>
      </div>
    </form>
  )
}
