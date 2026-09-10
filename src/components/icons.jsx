const ICON_PROPS = {
  width: 16,
  height: 16,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

export function VolumeOnIcon() {
  return (
    <svg {...ICON_PROPS}>
      <path d="M11 5 6 9H2v6h4l5 4V5Z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7" />
      <path d="M18.5 5.5a9 9 0 0 1 0 13" />
    </svg>
  );
}

export function VolumeOffIcon() {
  return (
    <svg {...ICON_PROPS}>
      <path d="M11 5 6 9H2v6h4l5 4V5Z" />
      <path d="m16 9 6 6" />
      <path d="m22 9-6 6" />
    </svg>
  );
}

export function WindIcon() {
  return (
    <svg {...ICON_PROPS}>
      <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" />
      <path d="M9.6 4.6A2 2 0 1 1 11 8H2" />
      <path d="M12.6 19.4A2 2 0 1 0 14 16H2" />
    </svg>
  );
}

export function UserRoundIcon() {
  return (
    <svg {...ICON_PROPS}>
      <circle cx="12" cy="8" r="4" />
      <path d="M5.3 20.2A9.5 9.5 0 0 1 18.7 20.2C17 16.8 14 15 12 15s-5 1.8-6.7 5.2Z" />
    </svg>
  );
}

export function DropletsIcon() {
  return (
    <svg {...ICON_PROPS}>
      <path d="M12 2.5S6 10.4 6 14.2a6 6 0 0 0 12 0C18 10.4 12 2.5 12 2.5Z" />
      <path d="M9.5 14.5a2.5 2.5 0 0 0 2 2.5" />
    </svg>
  );
}

export function SparklesIcon() {
  return (
    <svg {...ICON_PROPS}>
      <path d="M12 3.5 13.8 8.7 19 10.5l-5.2 1.8L12 17.5l-1.8-5.2L5 10.5l5.2-1.8L12 3.5Z" />
      <path d="M19 15.5l.9 2.6 2.6.9-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9.9-2.6Z" />
    </svg>
  );
}

export function CopyIcon() {
  return (
    <svg {...ICON_PROPS}>
      <rect x="9" y="9" width="12" height="12" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

export function CheckIcon() {
  return (
    <svg {...ICON_PROPS}>
      <path d="m4.5 12.5 5 5L19.5 6.5" />
    </svg>
  );
}
