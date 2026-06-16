import { Pyramid } from '@/components/Pyramid';

// The locked door. No "ask to bump" here — that belongs only in the scanned flow
// (BUMP-101 measures demand from people who scanned a worn tag in-scene).
export default function Home() {
  const muted = { color: '#666', margin: 0 } as const;
  return (
    <main style={{ textAlign: 'center', paddingTop: 48 }}>
      <div style={{ color: '#111', display: 'flex', justifyContent: 'center' }}>
        <Pyramid size={88} />
      </div>

      <h1 style={{ fontSize: 30, letterSpacing: 1, fontWeight: 700, margin: '28px 0 6px' }}>bump</h1>
      <p style={{ ...muted, fontSize: 16 }}>you get in by being there.</p>

      <div style={{ marginTop: 40, lineHeight: 1.7 }}>
        <p style={{ margin: 0 }}>Bump is an in-person social protocol for real-world scenes.</p>
        <p style={{ margin: 0 }}>Wear a tag. Share only what you choose, right now.</p>
        <p style={{ margin: 0 }}>You get in only when a member bumps you in — in person.</p>
      </div>

      <div style={{ marginTop: 28, ...muted, lineHeight: 1.7 }}>
        <p style={{ margin: 0 }}>No feed.</p>
        <p style={{ margin: 0 }}>No followers.</p>
        <p style={{ margin: 0 }}>No remote signup.</p>
      </div>

      <p style={{ marginTop: 28 }}>Scan a member to ask for a bump.</p>

      <p style={{ marginTop: 44 }}>
        <a href="/protocol">Read the protocol</a>
      </p>

      <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '56px auto 28px', maxWidth: 240 }} />

      <div style={{ ...muted, fontSize: 14, lineHeight: 1.9, display: 'inline-block', textAlign: 'left' }}>
        <p style={{ margin: 0 }}>Now testing at Stone Techno.</p>
        <p style={{ margin: 0 }}>A visible tag opens a card.</p>
        <p style={{ margin: 0 }}>The card explains the rule.</p>
        <p style={{ margin: 0 }}>A tap says: ask to bump.</p>
        <p style={{ margin: 0 }}>A knock is not membership.</p>
        <p style={{ margin: 0 }}>You&apos;re in only when a member accepts you, in person.</p>
      </div>
    </main>
  );
}
