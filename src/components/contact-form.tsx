'use client'
import { useState, type FormEvent } from 'react'
import { Button } from './ui/button'

export function ContactForm() {
  const [pending, setPending] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [failed, setFailed] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return
    const form = event.currentTarget
    setPending(true)
    setFeedback('')
    try {
      const response = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      })
      const data: { message?: string } = await response.json()
      setFailed(!response.ok)
      setFeedback(
        data.message || 'The message could not be sent. Please try again.',
      )
      if (response.ok) form.reset()
    } catch {
      setFailed(true)
      setFeedback('The message could not be sent. Please try again.')
    } finally {
      setPending(false)
    }
  }

  return (
    <form className="contact-form" onSubmit={submit}>
      <div className="contact-fields">
        <label>
          Your name
          <input name="name" autoComplete="name" required maxLength={100} />
        </label>
        <label>
          Email address
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
          />
        </label>
      </div>
      <label>
        Subject
        <input name="subject" required maxLength={140} />
      </label>
      <label>
        Message
        <textarea
          name="message"
          required
          minLength={10}
          maxLength={3000}
          rows={4}
        />
      </label>
      <label className="honeypot" aria-hidden="true">
        Leave blank
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <Button type="submit" variant="inverse" disabled={pending}>
        {pending ? 'Sending…' : 'Send enquiry'}
      </Button>
      <p
        role="status"
        className={failed ? 'form-feedback error' : 'form-feedback'}
      >
        {feedback}
      </p>
    </form>
  )
}
