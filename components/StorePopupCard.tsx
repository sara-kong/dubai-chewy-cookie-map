import React from 'react';

export interface StorePopupCardProps {
  name: string;
  address: string;
  isNew: boolean;
  /** Optional: called when "Open in Google Maps" is clicked. */
  onOpenMapsClick?: () => void;
  /** Optional: called when close (X) is clicked. */
  onClose?: () => void;
}

/**
 * Full popup card: drag handle, circular image left, content right.
 * Figma "pop up cards" layout. Use as the only card content (no wrapper card).
 */
export default function StorePopupCard({ name, address, isNew, onOpenMapsClick, onClose }: StorePopupCardProps) {
  return (
    <div
      role="article"
      aria-label={`Store: ${name}`}
      className="relative w-full bg-figma-white rounded-xl overflow-hidden box-border flex flex-col shadow-[0_0_4px_4px_rgba(0,0,0,0.25)]"
    >
      {/* Grey drag handle — swipe-down indicator */}
      <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
        <div className="w-12 h-1.5 bg-gray-300 rounded-full" aria-hidden />
      </div>

      {/* Close button */}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
          aria-label="Close"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      {/* Body: image left, content right */}
      <div className="flex flex-row gap-4 px-4 pb-6 pt-0 flex-1 min-h-0">
        {/* Left: circular product image (placeholder) */}
        <div
          className="w-16 h-16 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden"
          aria-hidden
        >
          {/* Placeholder for cookie photo — replace with <img src="..." alt="..." /> when asset is ready */}
          <div className="w-full h-full bg-gray-300" />
        </div>

        {/* Right: title line (name + badge inline), address, button */}
        <div className="flex-1 flex flex-col min-w-0 justify-between gap-2">
          <h2 className="font-sans font-bold text-[20px] leading-[24px] text-figma-black m-0 flex-shrink-0 break-words">
            {name}
            {isNew === true && (
              <span className="inline-flex align-middle min-w-[42px] h-[18px] ml-2 items-center justify-center box-border bg-figma-green-badge-bg rounded-[5px] px-[5px] py-[5px]">
                <span className="font-sans font-bold text-[10px] text-figma-green-badge-text uppercase leading-none whitespace-nowrap">
                  New
                </span>
              </span>
            )}
          </h2>

          <p className="font-sans font-normal text-[16px] leading-normal text-figma-black m-0 flex-shrink-0 line-clamp-2">
            {address}
          </p>

          <button
            type="button"
            aria-label="Open in Google Maps"
            onClick={onOpenMapsClick}
            className="w-full max-w-[152px] py-2.5 px-2.5 bg-figma-green-cta rounded-[5px] font-sans font-bold text-[10px] leading-[12px] text-figma-white flex items-center justify-center gap-1 border-0 cursor-pointer shadow-[0_0_4px_0_#1FDB1C] self-start"
          >
            Open in Google Maps
          </button>
        </div>
      </div>
    </div>
  );
}
