"use client";

import { useRef } from "react";

interface Props {
  id: string;
  content: string;
  open: boolean;
  tickClick: (id: string) => void;
  empty?: boolean;
  onContentChange: (id: string, content: string) => void;
  onBlur?: (id: string) => void;
}

export default function TodoTask({
  id,
  content,
  open,
  tickClick,
  empty,
  onContentChange,
  onBlur,
}: Props) {
  const tickButton = useRef<HTMLButtonElement>(null);
  const contentSpan = useRef<HTMLInputElement>(null);

  function handleTickClick(id: string) {
    tickButton.current?.classList.add("animate-tick");
    contentSpan.current?.classList.add("line-through", "text-gray-400");
    setTimeout(() => {
      tickButton.current?.classList.remove("animate-tick");
      contentSpan.current?.classList.remove("line-through", "text-gray-400");
      tickClick(id);
    }, 3000);
  }

  return open ? (
    <div className="py-4 flex items-center gap-4 border-b-2 border-black border-opacity-20">
      <button
        ref={tickButton}
        onClick={() => handleTickClick(id)}
        className={`w-8 h-8 rounded-full border-2 border-black grid place-content-center ${
          empty && "border-dotted border-opacity-50"
        }`}
      >
        <div className="rounded-full w-6 h-6 bg-primary hidden"></div>
      </button>
      <input
        ref={contentSpan}
        className="bg-transparent outline-none"
        value={content}
        onChange={(e) => onContentChange(id, e.target.value)}
        onBlur={() => onBlur && onBlur(id)}
      />
    </div>
  ) : null;
}
