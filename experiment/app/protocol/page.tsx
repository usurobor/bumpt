export const metadata = { title: 'bump · protocol' };

export default function Protocol() {
  return (
    <main style={{ lineHeight: 1.7 }}>
      <h1 style={{ fontSize: 22 }}>The protocol</h1>
      <p>Bump is an in-person social protocol for real-world scenes.</p>
      <p>You wear a tag. People nearby can scan it to see only what you choose to show, right now.</p>
      <p>You join only through a phone-to-phone bump with a member — never online.</p>
      <p style={{ color: '#666' }}>No feed. No followers. No remote signup.</p>

      <p style={{ marginTop: 28 }}>
        Full protocol docs:{' '}
        <a href="https://github.com/usurobor/bumpt/tree/main/docs">github.com/usurobor/bumpt/docs</a>
      </p>

      <p style={{ marginTop: 32, fontSize: 12 }}>
        <a href="/" style={{ color: '#999' }}>← bump</a>
      </p>
    </main>
  );
}
