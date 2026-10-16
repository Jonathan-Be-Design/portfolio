// Nome ao lado do olho, com a onda de peso letra a letra (estilo "Cinética").
const NAME = 'Jonathan Bolanle';

export default function SignatureName() {
  return <span className="signature-wave" aria-hidden="true">
    {[...NAME].map((char, i) => char === ' '
      ? <span key={i} className="sp" />
      : <span key={i} style={{ animationDelay: `${(i * 0.09).toFixed(2)}s` }}>{char}</span>)}
  </span>;
}
