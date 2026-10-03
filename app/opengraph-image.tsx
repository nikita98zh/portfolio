import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 70, background: '#F5F5F5', color: '#161616', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', fontSize: 36, fontWeight: 800, letterSpacing: -2 }}>NIKITA.Z</div>
      <div style={{ display: 'flex', flexDirection: 'column', fontSize: 100, lineHeight: 0.97, fontWeight: 800, letterSpacing: -7 }}>
        <span>WEB & BRAND</span>
        <span>DESIGNER.</span>
      </div>
      <div style={{ display: 'flex', fontSize: 25 }}>Selected work by Nikita Zhorov</div>
    </div>,
    size
  );
}
