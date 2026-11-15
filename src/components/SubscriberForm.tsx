import { useState, type FormEvent } from 'react'
import { emptySubscriber, type FormErrors, type Subscriber, type SubscriberInput } from '../types.ts'

interface Props {
  existing: Subscriber[]
  saving: boolean
  serverError: string | null
  onSave: (input: SubscriberInput) => void
  onCancel: () => void
}

function validate(v: SubscriberInput, existing: Subscriber[]): FormErrors {
  const e: FormErrors = {}
  if (!v.regNo.trim()) e.regNo = 'Reg. no is required'
  else if (existing.some((s) => s.regNo.trim() === v.regNo.trim()))
    e.regNo = 'This reg. no already exists'
  if (!v.name.trim()) e.name = 'Name is required'
  if (v.pincode && !/^\d{6}$/.test(v.pincode)) e.pincode = 'Pincode must be 6 digits'
  if (v.mobileNo && !/^\d{10}$/.test(v.mobileNo)) e.mobileNo = 'Mobile must be 10 digits'
  if (!Number.isFinite(v.periodYears) || v.periodYears < 1) e.periodYears = 'Must be at least 1'
  return e
}

export default function SubscriberForm({ existing, saving, serverError, onSave, onCancel }: Props) {
  const [values, setValues] = useState<SubscriberInput>(emptySubscriber)
  const [errors, setErrors] = useState<FormErrors>({})

  const set = <K extends keyof SubscriberInput>(key: K, value: SubscriberInput[K]) =>
    setValues((v) => ({ ...v, [key]: value }))

  const text = (key: Exclude<keyof SubscriberInput, 'periodYears'>, label: string, extra?: { inputMode?: 'numeric' | 'tel'; maxLength?: number }) => (
    <label className="field">
      <span>{label}</span>
      <input
        value={values[key]}
        onChange={(e) => set(key, e.target.value)}
        aria-invalid={!!errors[key]}
        {...extra}
      />
      {errors[key] && <small className="error">{errors[key]}</small>}
    </label>
  )

  function submit(e: FormEvent) {
    e.preventDefault()
    const errs = validate(values, existing)
    setErrors(errs)
    if (Object.keys(errs).length === 0) onSave(values)
  }

  return (
    <form className="card form" onSubmit={submit} noValidate>
      <h2>Add subscriber</h2>
      <div className="grid">
        {text('regNo', 'Reg. No *')}
        {text('name', 'Name *')}
        {text('address1', 'Address 1')}
        {text('address2', 'Address 2')}
        {text('city', 'City')}
        {text('district', 'District')}
        {text('pincode', 'Pincode', { inputMode: 'numeric', maxLength: 6 })}
        {text('state', 'State')}
        {text('mobileNo', 'Mobile No', { inputMode: 'tel', maxLength: 10 })}
        {text('years', 'Year(s)')}
        <label className="field">
          <span>Period (years)</span>
          <input
            type="number"
            min={1}
            value={Number.isNaN(values.periodYears) ? '' : values.periodYears}
            onChange={(e) => set('periodYears', e.target.valueAsNumber)}
            aria-invalid={!!errors.periodYears}
          />
          {errors.periodYears && <small className="error">{errors.periodYears}</small>}
        </label>
        {text('pratinidhi', 'Pratinidhi')}
      </div>
      <label className="field">
        <span>Remark</span>
        <textarea rows={2} value={values.remark} onChange={(e) => set('remark', e.target.value)} />
      </label>
      {serverError && <p className="error">{serverError}</p>}
      <div className="actions">
        <button type="button" className="secondary" onClick={onCancel} disabled={saving}>Cancel</button>
        <button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
      </div>
    </form>
  )
}
