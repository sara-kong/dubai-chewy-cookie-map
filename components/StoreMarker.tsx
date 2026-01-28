import React from 'react';

export interface StoreMarkerProps {
  onClick?: () => void;
  isSelected?: boolean;
  className?: string;
}

/**
 * Map marker icon (bear donut) - 80.5×50px from Figma
 * Static SVG, no animations yet
 */
export default function StoreMarker({ onClick, isSelected, className = '' }: StoreMarkerProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Store location marker"
      className={`cursor-pointer border-0 bg-transparent p-0 transition-transform hover:scale-110 ${
        isSelected ? 'scale-110' : ''
      } ${className}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="81"
        height="56"
        viewBox="0 0 81 56"
        fill="none"
        className="w-[80.5px] h-[50px]"
      >
        <g filter="url(#filter0_d_20_66)">
          <path
            d="M38.0743 4.69442L26.0487 7.58948C21.7819 8.61667 17.9232 10.9046 14.9748 14.1553L13.384 15.9093C6.03515 24.0119 6.77141 36.5693 15.0168 43.7576C17.9394 46.3055 21.554 47.926 25.4006 48.4129L51.8126 51.7562C56.4744 52.3463 61.2008 51.3865 65.2631 49.0247C74.1145 43.8785 78.0839 33.1861 74.7347 23.5107L74.572 23.0407C72.6095 17.3714 68.4184 12.7485 62.9681 10.2413L54.3733 6.28775C49.2733 3.94174 43.5321 3.3805 38.0743 4.69442Z"
            fill="#8B4E2F"
          />
        </g>
        <g filter="url(#filter1_f_20_66)">
          <path
            d="M68.8207 26.9943C68.8207 27.3843 68.9487 28.5953 68.9818 32.0852C68.7078 33.5813 67.8305 34.9615 67.0223 36.1293C66.8703 36.3374 66.7293 36.5151 66.584 36.6982"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>
        <g filter="url(#filter2_f_20_66)">
          <path d="M65.1057 40.5217H65.079" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </g>
        <path
          d="M28.6968 22.7418C29.0865 22.9982 30.1723 23.7925 30.9895 24.295C31.2083 24.4295 31.3916 24.6568 31.3697 24.7589C31.0998 24.853 30.2746 25.3768 29.312 26.2491C28.9192 26.5895 28.7207 26.7222 28.5161 26.859"
          stroke="black"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M58.9157 23.533C58.7092 23.787 57.5898 24.6777 56.5534 25.4376C56.172 25.7173 56.2663 25.9953 56.4221 26.1796C56.839 26.5008 57.2558 26.8433 57.563 27.2349C57.7225 27.4251 57.8894 27.5978 58.217 27.927"
          stroke="black"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M44.4348 35.7366C44.3755 35.9032 43.7183 36.6676 42.901 37.2333C42.61 37.4347 42.268 37.426 41.9716 37.3664C41.4173 36.9924 40.9636 36.4789 40.7168 35.8942C40.6658 35.751 40.6195 35.6185 40.5 35.166"
          stroke="black"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <defs>
          <filter
            id="filter0_d_20_66"
            x="4.31885"
            y="0"
            width="75.5963"
            height="55.9258"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset />
            <feGaussianBlur stdDeviation="2" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.939671 0 0 0 0 0.88414 0 0 0 0 0.683376 0 0 0 0.25 0"
            />
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_20_66" />
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_20_66" result="shape" />
          </filter>
          <filter
            id="filter1_f_20_66"
            x="62.584"
            y="22.9943"
            width="10.3987"
            height="17.7039"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur stdDeviation="1.5" result="effect1_foregroundBlur_20_66" />
          </filter>
          <filter
            id="filter2_f_20_66"
            x="61.079"
            y="36.5217"
            width="8.0267"
            height="8"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur stdDeviation="1.5" result="effect1_foregroundBlur_20_66" />
          </filter>
        </defs>
      </svg>
    </button>
  );
}
