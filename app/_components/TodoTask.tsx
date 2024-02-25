"use client";

import { useRef } from "react";

interface Props {
  id: string;
  content: string;
  open: boolean;
  tickClick: (id: string) => void;
}

export default function TodoTask({ id, content, open, tickClick }: Props) {
  const tickButton = useRef<HTMLButtonElement>(null);
  const contentSpan = useRef<HTMLSpanElement>(null);

  function handleTickClick(id: string) {
    tickButton.current?.classList.add("animate-tick");
    contentSpan.current?.classList.add("line-through", "text-gray-400");
    setTimeout(() => {
      tickButton.current?.classList.remove("animate-tick");
      contentSpan.current?.classList.remove("line-through", "text-gray-400");
      tickClick(id);
    }, 3000);
  }

  console.log(open);

  return open ? (
    <div className="py-4 flex items-center gap-4 border-b-2 border-black border-opacity-20">
      <button
        ref={tickButton}
        onClick={() => handleTickClick(id)}
        className="w-8 h-8 rounded-full border-2 border-black grid place-content-center"
      >
        <div className="rounded-full w-6 h-6 bg-primary hidden"></div>
      </button>
      <span ref={contentSpan}>{content}</span>

      <style>
        {`
        .animate-tick {
          border-color: #4CB9E7;
          animation: tick 0.5s ease-in-out;
        }
        .animate-tick > div {
          display: inline-block;
        }

        @keyframes tick {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
          }
        }
        `}
      </style>
    </div>
  ) : null;
}
