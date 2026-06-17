// The home screen. Pixel-ported from the design mock screens/home/view.html (on main).
// The mark + CSS are inlined verbatim so prod renders identical to the mock; the
// prod visual gate in ci-deploy.yml re-verifies bumpt.io/ == the mock after deploy.
// Do not change /m, /about, /thanks, /ops or the funnel from here.

const CSS = `
:root{
  --ink:#09090a;
  --surface:#0c0c0e;
  --surface-2:#141418;
  --bone:#ECEAE3;
  --bone-dim:#a2a2a8;
  --mute:#66666d;
  --faint:#36363c;
  --hair:rgba(236,234,227,0.11);
  --hair-2:rgba(236,234,227,0.05);
  --coh:#7C77FF;
  --coh-soft:rgba(124,119,255,0.14);
  --display:"Space Grotesk","Helvetica Neue",Arial,sans-serif;
  --mono:"Space Mono",ui-monospace,"SF Mono",Menlo,monospace;
}
*{box-sizing:border-box;}
html,body{margin:0;padding:0;height:100%;}
body{
  background:radial-gradient(120% 70% at 50% -8%,#131318 0%,var(--surface) 56%) fixed,var(--surface);
  color:var(--bone);font-family:var(--display);-webkit-font-smoothing:antialiased;
  text-rendering:optimizeLegibility;min-height:100dvh;
  display:flex;justify-content:center;
}

.screen{position:relative;width:100%;max-width:430px;min-height:100dvh;
  display:flex;flex-direction:column;
  padding:max(54px,env(safe-area-inset-top)) 30px max(30px,env(safe-area-inset-bottom));}

.view{display:flex;flex-direction:column;flex:1 1 auto;min-height:0;}

.top{display:flex;align-items:center;justify-content:space-between;flex:0 0 auto;}
.top .wm{display:flex;align-items:center;gap:8px;font-family:var(--mono);font-weight:700;font-size:14px;letter-spacing:-0.4px;color:var(--bone);}
.top .wm .mark{width:18px;height:18px;}
.top .st{font-family:var(--mono);font-size:10px;color:var(--mute);letter-spacing:0.6px;text-transform:uppercase;}

.body{flex:1 1 auto;display:flex;flex-direction:column;min-height:0;}
.grow{flex:1 1 auto;}

.mark{display:block;width:24px;height:24px;}
.mark svg{display:block;width:100%;height:100%;overflow:visible;}
.mark .ring{fill:none;stroke:var(--bone);stroke-opacity:.20;stroke-width:2;}
.mark .arc{fill:none;stroke:var(--coh);stroke-width:2;stroke-linecap:round;
  stroke-dasharray:214;stroke-dashoffset:214;opacity:0;}
.mark .station{fill:var(--bone);fill-opacity:.22;}
.mark .pulse{fill:none;stroke:var(--coh);stroke-width:1.5;opacity:0;transform-origin:50px 50px;}
.mark.whole .ring{animation:breathe 5.5s ease-in-out infinite;}
@keyframes breathe{0%,100%{stroke-opacity:.16;}50%{stroke-opacity:.30;}}
.mark.cohering .arc{opacity:1;transition:stroke-dashoffset .72s cubic-bezier(.45,0,.2,1);stroke-dashoffset:0;}
.mark.cohering .ring{stroke-opacity:.30;transition:stroke-opacity .4s ease;}
.mark.cohering .station{animation:stationGlow .9s ease;}
.mark.settle .arc{opacity:0;transition:opacity .6s ease .05s;}
.mark.settle .ring{stroke:var(--bone);stroke-opacity:.20;transition:stroke-opacity .6s ease;}
.mark.pulsing .pulse{animation:pulseOut 1.05s cubic-bezier(.2,.6,.2,1);}
@keyframes stationGlow{0%{fill-opacity:.22;}35%{fill-opacity:1;}100%{fill-opacity:.22;}}
@keyframes pulseOut{0%{opacity:.55;transform:scale(.62);}100%{opacity:0;transform:scale(1.18);}}
@media (prefers-reduced-motion:reduce){
  .mark.whole .ring{animation:none;stroke-opacity:.24;}
  .mark.cohering .arc{transition:none;opacity:1;stroke-dashoffset:0;}
  .mark.cohering .station,.mark.pulsing .pulse{animation:none;}
}

.kick{font-family:var(--mono);font-size:10px;letter-spacing:1.7px;text-transform:uppercase;color:var(--coh);margin:0 0 14px;}
.dxl{font-family:var(--display);font-weight:500;font-size:37px;line-height:1.03;letter-spacing:-1.6px;color:var(--bone);margin:0;}
.dl{font-family:var(--display);font-weight:500;font-size:30px;line-height:1.07;letter-spacing:-1.1px;color:var(--bone);margin:0;}
.lede{font-family:var(--display);font-weight:400;font-size:15px;line-height:1.5;color:var(--bone-dim);margin:18px 0 0;letter-spacing:-0.2px;}
.note{font-family:var(--mono);font-size:11.5px;line-height:1.75;color:var(--mute);margin:0;letter-spacing:0.15px;}
.note b{color:var(--bone-dim);font-weight:400;}
.foot{font-family:var(--mono);font-size:10px;color:var(--faint);letter-spacing:0.4px;display:flex;gap:9px;flex-wrap:wrap;flex:0 0 auto;}
.foot span{color:var(--mute);}
.foot a{color:var(--mute);text-decoration:none;border-bottom:1px solid var(--hair-2);padding-bottom:1px;}

.div{display:flex;align-items:center;gap:0;margin:20px 0;flex:0 0 auto;}
.div .ln{height:1px;background:var(--hair);flex:1 1 auto;}
.div .node{width:5px;height:5px;border-radius:50%;background:var(--bone);opacity:.28;margin:0 13px;}
`;

// The reusable ring mark — inlined SVG (the mock injects this via [data-mark]).
function Mark({ className }: { className: string }) {
  return (
    <span className={className}>
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <circle className="ring" cx="50" cy="50" r="34"></circle>
        <circle className="pulse" cx="50" cy="50" r="34"></circle>
        <path className="arc" d="M50 16 A34 34 0 1 1 49.99 16"></path>
        <circle className="station" cx="50" cy="16" r="2.4"></circle>
        <circle className="station" cx="79.4" cy="67" r="2.4"></circle>
        <circle className="station" cx="20.6" cy="67" r="2.4"></circle>
      </svg>
    </span>
  );
}

export default function Home() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <main className="screen">
        <div className="view">
          <div className="top">
            <span className="wm">
              <Mark className="mark whole" />
              bump
            </span>
            <span className="st">in person only</span>
          </div>
          <div className="body">
            <div className="grow" style={{ flex: '0 0 34px' }}></div>
            <h2 className="dxl">
              you can&apos;t<br />join online.
            </h2>
            <p className="lede">A worn tag. An in-person bump. There is nothing here to sign up for.</p>
            <div className="grow"></div>
            <div className="div">
              <span className="ln"></span>
              <span className="node"></span>
              <span className="ln"></span>
            </div>
            <p className="kick" style={{ marginBottom: 11 }}>
              the rule
            </p>
            <p className="note">
              <b>Membership begins only when a member bumps you in — face to face.</b> No invite link, no email
              code, no signup. If you weren&apos;t there, you&apos;re not in.
            </p>
            <div className="grow"></div>
            <div className="foot">
              <span>private by default</span>·<span>no feed</span>·<span>no accounts to search</span>
            </div>
            <div className="foot" style={{ marginTop: 13 }}>
              <a href="#">protocol</a>
              <a href="#">privacy</a>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
