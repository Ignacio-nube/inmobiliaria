import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { consultaSchema, type ConsultaFormData } from '@/lib/validators'
import { supabase } from '@/lib/supabase'
import { useState } from 'react'
import { Send, CheckCircle } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

interface ContactFormProps {
  organizacionId?: string
  propiedadId?: string
  className?: string
}

export default function ContactForm({ organizacionId, propiedadId, className = '' }: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ConsultaFormData>({
    resolver: zodResolver(consultaSchema),
  })

  async function onSubmit(data: ConsultaFormData) {
    setSubmitError(null)

    const { error } = await supabase.from('inmob_consultas').insert({
      nombre: data.nombre,
      telefono: data.telefono || null,
      email: data.email || null,
      mensaje: data.mensaje,
      organizacion_id: organizacionId!,
      propiedad_id: propiedadId ?? null,
    })

    if (error) {
      setSubmitError('Hubo un error al enviar tu consulta. Intenta nuevamente.')
      return
    }

    setSubmitted(true)
    reset()
  }

  if (submitted) {
    return (
      <div className={`rounded-[var(--radius-card)] border border-success/20 bg-success/5 p-8 text-center ${className}`}>
        <CheckCircle size={48} className="mx-auto text-success" />
        <h3 className="mt-4 text-lg font-semibold text-text-primary">
          Consulta enviada
        </h3>
        <p className="mt-2 text-sm text-text-secondary">
          Recibimos tu mensaje. Nos comunicaremos con vos a la brevedad.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-4 text-sm font-medium text-primary hover:text-primary-500"
        >
          Enviar otra consulta
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`space-y-4 ${className}`}
      noValidate
    >
      <Input
        label="Nombre *"
        placeholder="Tu nombre completo"
        error={errors.nombre?.message}
        {...register('nombre')}
      />

      <Input
        label="Email"
        type="email"
        placeholder="tu@email.com"
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        label="Telefono"
        type="tel"
        placeholder="+54 9 341 123-4567"
        error={errors.telefono?.message}
        {...register('telefono')}
      />

      <div>
        <label className="mb-1.5 block text-sm font-medium text-text-primary">
          Mensaje *
        </label>
        <textarea
          rows={4}
          placeholder="Escribi tu consulta..."
          className={`w-full resize-none rounded-[var(--radius-input)] border px-4 py-3 text-sm outline-none transition-colors placeholder:text-text-tertiary focus:border-primary focus:ring-1 focus:ring-primary ${
            errors.mensaje ? 'border-error' : 'border-border'
          }`}
          {...register('mensaje')}
        />
        {errors.mensaje && (
          <p className="mt-1 text-xs text-error">{errors.mensaje.message}</p>
        )}
      </div>

      {submitError && (
        <p className="rounded-lg bg-error/10 px-4 py-2 text-sm text-error">
          {submitError}
        </p>
      )}

      <Button type="submit" loading={isSubmitting} fullWidth size="lg">
        <Send size={16} />
        Enviar consulta
      </Button>
    </form>
  )
}
