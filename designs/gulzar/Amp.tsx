/** Каллиграфический «&» между именами; скринридер читает союз словами. */
export function Amp({ label }: { label: string }) {
  return (
    <span className="g-amp">
      <span aria-hidden>&amp;</span>
      <span className="sr-only"> {label} </span>
    </span>
  );
}
