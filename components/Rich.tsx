import { Fragment } from "react";
import { parseRich } from "@/lib/i18n";

// Texto con *énfasis* y saltos de línea (\n → <br>)
export function Rich({ value }: { value: string }) {
  const lines = value.split("\n");
  return (
    <>
      {lines.map((line, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {parseRich(line).map((seg, j) => (seg.em ? <em key={j}>{seg.text}</em> : <Fragment key={j}>{seg.text}</Fragment>))}
        </Fragment>
      ))}
    </>
  );
}
