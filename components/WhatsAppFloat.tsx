import React from 'react';
import { buildWhatsAppLink, WHATSAPP_MESSAGES } from './whatsapp';

export const WhatsAppFloat: React.FC = () => (
  <a
    href={buildWhatsAppLink(WHATSAPP_MESSAGES.consulta)}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Escribinos por WhatsApp"
    className="fixed bottom-4 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-2xl shadow-primary/30 transition-transform hover:scale-105 active:scale-95 md:bottom-8 md:right-8 md:h-14 md:w-14"
  >
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 md:h-7 md:w-7" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347Z" />
      <path d="M12.001 2C6.478 2 2 6.477 2 12.001c0 1.767.459 3.486 1.332 5.006L2 22l5.128-1.318A9.955 9.955 0 0 0 12.001 22C17.523 22 22 17.523 22 12.001 22 6.478 17.523 2 12.001 2Zm0 18.166a8.13 8.13 0 0 1-4.146-1.135l-.297-.176-3.043.782.812-2.966-.193-.305a8.13 8.13 0 0 1-1.246-4.365c0-4.494 3.657-8.15 8.153-8.15 4.493 0 8.15 3.656 8.15 8.15 0 4.495-3.657 8.165-8.19 8.165Z" />
    </svg>
  </a>
);
