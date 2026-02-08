import { MessageCircle } from 'lucide-react'
import { useOrganization } from '@/hooks/useOrganization'
import { getWhatsAppUrl } from '@/lib/formatters'

export default function WhatsAppFab() {
  const { organization } = useOrganization()

  if (!organization?.whatsapp) return null

  return (
    <a
      href={getWhatsAppUrl(organization.whatsapp)}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-accent-whatsapp text-white shadow-lg transition-transform hover:scale-110 active:scale-95"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle size={28} />
    </a>
  )
}
