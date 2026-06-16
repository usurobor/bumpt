export const metadata = { title: 'bump · protocol' };

export default function Protocol() {
  return (
    <main style={{ lineHeight: 1.7 }}>
      <h1 style={{ fontSize: 22 }}>The protocol</h1>
      <p>Bump is an in-person social protocol for real-world scenes.</p>
      <p>You wear a tag. People nearby can scan it to see only what you choose to show, right now.</p>

      <p style={{ marginTop: 20 }}><strong>How you get in</strong></p>
      <p>Ask to bump → a member accepts → you&apos;re in.</p>
      <p>
        You can&apos;t sign up online. To join, scan a member&apos;s tag and ask them to bump you.
        An existing member has to accept you <em>in person</em> and becomes your sponsor. That
        acceptance — a member vouching for you in the room — is the only door.
      </p>
      <p style={{ color: '#666' }}>
        Asking is just a knock. A knock is not membership. No remote invite links, no inbox you can
        accept from your couch hours later.
      </p>
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
