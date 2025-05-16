import React, { useRef, useEffect } from "react";

type AutoResizingTextareaProps = {
  value: string | number | null;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  readOnly?: boolean;
};

export default function AutoResizingTextarea({
  value,
  onChange,
  readOnly = false,
}: AutoResizingTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = `${ta.scrollHeight}px`;
    }
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value ?? ""}
      onChange={onChange}
      readOnly={readOnly}
      style={{
        width: "100%",
        boxSizing: "border-box",
        overflow: "hidden",
        resize: "none",
        padding: "0.5em",
        lineHeight: "1.4",
        fontFamily: "inherit",
        backgroundColor: readOnly ? "#f9fafb" : "inherit",
        border: readOnly ? "none" : "1px solid #ccc",
        outline: "none",
        pointerEvents: readOnly ? "none" : "auto",
        userSelect: readOnly ? "none" : "auto",
      }}
    />
  );
}
