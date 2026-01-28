import React from 'react';

export interface StorePopupCardProps {
  name: string;
  address: string;
  isNew: boolean;
}

/**
 * Presentational StorePopupCard. Figma specs applied exactly.
 * No state, logic, animations, or gestures. Button has no handler.
 */
export default function StorePopupCard({ name, address, isNew }: StorePopupCardProps) {
  return (
    <div
      role="article"
      aria-label={`Store: ${name}`}
      className="w-[363px] h-[158px] bg-[#FFFFFF] rounded-[15px] overflow-hidden box-border flex flex-col"
      style={{ boxShadow: '0 0 4px 4px rgba(0, 0, 0, 0.25)' }}
    >
      <div className="flex-1 flex flex-col p-4 justify-between min-h-0">
        {/* Name row + optional New badge */}
        <div className="flex items-start justify-between gap-2 flex-shrink-0">
          <h2 className="font-sans font-bold text-[20px] leading-[24px] text-[#000000] m-0 flex-1 min-w-0 break-words">
            {name}
          </h2>
          {isNew && (
            <span className="shrink-0 w-[42px] h-[18px] flex items-center justify-center box-border bg-[#D8E5D8] rounded-[5px] p-[5px]">
              <span className="font-sans font-bold text-[10px] text-[#206D1F] uppercase leading-none">
                New
              </span>
            </span>
          )}
        </div>

        {/* Address */}
        <p className="font-sans font-normal text-[16px] leading-normal text-[#000000] m-0 flex-shrink-0 line-clamp-2">
          {address}
        </p>

        {/* Open in Google Maps — presentational only, no handler */}
        <button
          type="button"
          aria-label="Open in Google Maps"
          className="w-full min-w-[152px] py-2.5 px-2.5 bg-[#1FDB1C] rounded-[5px] font-sans font-bold text-[10px] leading-[12px] text-white flex items-center justify-center gap-1 border-0 cursor-default"
          style={{ boxShadow: '0 0 4px 0 #1FDB1C' }}
        >
          Open in Google Maps
        </button>
      </div>
    </div>
  );
}
