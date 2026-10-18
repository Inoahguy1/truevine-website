// Tweaks panel + shared headline data
const { useState: useStateT } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "headline": "grow",
  "theme": "violet"
}/*EDITMODE-END*/;

const HEADLINES = {
  grow: { line1: "Plant one system.", line2: "Watch it grow", line3: "through your", line4: "whole business." },
  competition: { line1: "Your competition", line2: "is already", line3: "automated.", line4: "Are you?" },
  leave: { line1: "Leave manual", line2: "work behind." },
  scale: { line1: "One system.", line2: "Zero busywork.", line3: "Room to grow." }
};

function Tweaks({ state, setState }) {
  const [open] = useStateT(false);

  const update = (key, val) => {
    setState({ ...state, [key]: val });
  };

  if (!open) return null;

  const option = (key, val, label) => (
    <button className={state[key] === val ? 'active' : ''} onClick={() => update(key, val)}>› {label}</button>
  );

  return (
    <div className="tweaks open">
      <h4><span>Tweaks</span></h4>
      <div className="tweak-group">
        <div className="tweak-group-label">Headline</div>
        <div className="tweak-options">
          {option('headline', 'grow', 'Plant one system')}
          {option('headline', 'competition', 'Competition is automated')}
          {option('headline', 'leave', 'Leave manual work behind')}
          {option('headline', 'scale', 'One system, zero busywork')}
        </div>
      </div>
      <div className="tweak-group">
        <div className="tweak-group-label">Color theme</div>
        <div className="tweak-options">
          {option('theme', 'violet', 'Forest green (default)')}
          {option('theme', 'blue', 'Electric blue')}
          {option('theme', 'minimal', 'Minimal mono')}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Tweaks, HEADLINES, TWEAK_DEFAULTS });
