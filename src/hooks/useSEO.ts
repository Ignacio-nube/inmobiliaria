import { useEffect } from 'react'
import { useOrganization } from '@/contexts/OrganizationContext'

interface SEOProps {
  title?: string
  description?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  ogType?: string
  canonical?: string
}

const DEFAULT_SITE_NAME = 'Rosario Propiedades'
const DEFAULT_DESCRIPTION = 'Plataforma inmobiliaria profesional - Encontrá tu próximo hogar en Rosario y alrededores'

function setMetaTag(name: string, content: string, attribute: 'name' | 'property' = 'name') {
  let el = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attribute, name)
    document.head.appendChild(el)
  }
  el.content = content
}

function setCanonical(href: string) {
  let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
  if (!el) {
    el = document.createElement('link')
    el.rel = 'canonical'
    document.head.appendChild(el)
  }
  el.href = href
}

export function useSEO({
  title,
  siteName: siteNameProp,
  description = DEFAULT_DESCRIPTION,
  ogTitle,
  ogDescription,
  ogImage,
  ogType = 'website',
  canonical,
}: SEOProps & { siteName?: string } = {}) {
  const { organization } = useOrganization()
  const siteName = siteNameProp ?? organization?.nombre ?? DEFAULT_SITE_NAME

  useEffect(() => {
    // Title
    const fullTitle = title ? `${title} | ${siteName}` : siteName
    document.title = fullTitle

    // Basic meta
    setMetaTag('description', description)

    // Open Graph
    setMetaTag('og:title', ogTitle || fullTitle, 'property')
    setMetaTag('og:description', ogDescription || description, 'property')
    setMetaTag('og:type', ogType, 'property')
    setMetaTag('og:site_name', siteName, 'property')

    if (ogImage) {
      setMetaTag('og:image', ogImage, 'property')
    }

    // Twitter Card
    setMetaTag('twitter:card', ogImage ? 'summary_large_image' : 'summary', 'name')
    setMetaTag('twitter:title', ogTitle || fullTitle, 'name')
    setMetaTag('twitter:description', ogDescription || description, 'name')

    // Canonical
    if (canonical) {
      setCanonical(canonical)
    }

    return () => {
      // Reset to default on unmount
      document.title = siteName
      setMetaTag('description', DEFAULT_DESCRIPTION)
    }
  }, [title, siteName, description, ogTitle, ogDescription, ogImage, ogType, canonical])
}
