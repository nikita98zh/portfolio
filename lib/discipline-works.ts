export const disciplineWorks = [
  {
    id: 'uiux',
    label: 'UI/UX',
    mobileLabel: 'UI / UX',
    images: [
      { src: '/assets/disciplines/uiux_oryn.webp', alt: 'ORYN smart ring storefront' },
      { src: '/assets/disciplines/uiux_coffee.webp', alt: 'Coffee app interface screens' },
      { src: '/assets/disciplines/uiux_noda.webp', alt: 'NODA perfume storefront' },
      { src: '/assets/disciplines/uiux_kern.webp', alt: 'KERN property management dashboard' },
      { src: '/assets/disciplines/uiux_field.webp', alt: 'FIELD research dashboard' },
    ],
  },
  {
    id: 'brand',
    label: 'BRAND',
    mobileLabel: 'BRAND',
    images: [
      { src: '/assets/disciplines/brand_noma.webp', alt: 'NOMA lighting identity' },
      { src: '/assets/disciplines/brand_pinch.webp', alt: 'PINCH food brand identity' },
      { src: '/assets/disciplines/brand_northline.webp', alt: 'NORTHLINE industrial identity' },
      { src: '/assets/disciplines/brand_crumb.webp', alt: 'CRUMB cookie brand identity' },
      { src: '/assets/disciplines/brand_loop.webp', alt: 'LOOP hospitality identity' },
    ],
  },
  {
    id: 'marketing',
    label: 'MARKETING',
    mobileLabel: 'MARKETING',
    images: [
      { src: '/assets/disciplines/marketing_tapin.webp', alt: 'Tap In transit campaign' },
      { src: '/assets/disciplines/marketing_halfhalf.webp', alt: 'Half & Half pizza campaign' },
      { src: '/assets/disciplines/marketing_switch.webp', alt: 'Switch & Save electronics campaign' },
      { src: '/assets/disciplines/marketing_firstpress.webp', alt: 'First Press olive oil launch campaign' },
    ],
  },
] as const;

export type DisciplineId = (typeof disciplineWorks)[number]['id'];
