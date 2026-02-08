import { useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import type { Imagen } from '@/types/property'

interface ImageGalleryProps {
  images: Imagen[]
  title: string
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const sorted = [...images].sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0))

  if (sorted.length === 0) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-[var(--radius-card)] bg-bg-subtle text-text-tertiary">
        Sin imagenes
      </div>
    )
  }

  function openLightbox(index: number) {
    setCurrentIndex(index)
    setLightboxOpen(true)
  }

  function navigate(dir: 'prev' | 'next') {
    setCurrentIndex((prev) =>
      dir === 'prev'
        ? (prev - 1 + sorted.length) % sorted.length
        : (prev + 1) % sorted.length
    )
  }

  return (
    <>
      {/* Gallery grid */}
      <div className="grid gap-2 overflow-hidden rounded-[var(--radius-card)]">
        {sorted.length === 1 ? (
          <button type="button" onClick={() => openLightbox(0)} className="cursor-pointer">
            <img
              src={sorted[0].url}
              alt={sorted[0].alt_text ?? title}
              className="aspect-video w-full object-cover"
            />
          </button>
        ) : sorted.length === 2 ? (
          <div className="grid grid-cols-2 gap-2">
            {sorted.map((img, i) => (
              <button key={img.id} type="button" onClick={() => openLightbox(i)} className="cursor-pointer">
                <img
                  src={img.url}
                  alt={img.alt_text ?? title}
                  className="aspect-video w-full object-cover"
                />
              </button>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2 md:grid-cols-[2fr_1fr]">
            <button type="button" onClick={() => openLightbox(0)} className="cursor-pointer">
              <img
                src={sorted[0].url}
                alt={sorted[0].alt_text ?? title}
                className="aspect-video w-full object-cover"
              />
            </button>
            <div className="grid gap-2">
              {sorted.slice(1, 3).map((img, i) => (
                <button key={img.id} type="button" onClick={() => openLightbox(i + 1)} className="relative cursor-pointer">
                  <img
                    src={img.url}
                    alt={img.alt_text ?? title}
                    className="aspect-video w-full object-cover"
                  />
                  {i === 1 && sorted.length > 3 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-lg font-bold text-white">
                      +{sorted.length - 3} fotos
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
          {/* Close */}
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            aria-label="Cerrar"
          >
            <X size={24} />
          </button>

          {/* Prev */}
          {sorted.length > 1 && (
            <button
              type="button"
              onClick={() => navigate('prev')}
              className="absolute left-4 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
              aria-label="Anterior"
            >
              <ChevronLeft size={28} />
            </button>
          )}

          {/* Image */}
          <img
            src={sorted[currentIndex].url}
            alt={sorted[currentIndex].alt_text ?? title}
            className="max-h-[85vh] max-w-full rounded-lg object-contain"
          />

          {/* Next */}
          {sorted.length > 1 && (
            <button
              type="button"
              onClick={() => navigate('next')}
              className="absolute right-4 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
              aria-label="Siguiente"
            >
              <ChevronRight size={28} />
            </button>
          )}

          {/* Counter */}
          <div className="absolute bottom-4 text-sm text-white/70">
            {currentIndex + 1} / {sorted.length}
          </div>
        </div>
      )}
    </>
  )
}
