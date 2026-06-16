export const metadata = { title: 'bump · privacy' };

export default function Privacy() {
  return (
    <main style={{ lineHeight: 1.6 }}>
      <h1 style={{ fontSize: 22 }}>Privacy</h1>
      <p>This experiment collects no contact data.</p>
      <p>We do not ask for your name, email, Instagram, phone number, or account.</p>
      <p>We do not store IP address, user agent, ad pixels, or behavioral analytics.</p>
      <p>
        If you tap &ldquo;Ask to bump,&rdquo; we set one random first-party online identifier only to
        avoid counting repeat taps. It is not derived from your device characteristics, does not
        identify you, and is deletable with the experiment data.
      </p>
      <p>The experiment result is aggregate: scans, About opens, bump requests, and conversion rates.</p>

      <p style={{ marginTop: 32, fontSize: 12 }}>
        <a href="/" style={{ color: '#999' }}>← bump</a>
      </p>
    </main>
  );
}
