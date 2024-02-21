"use client";

import { useRef } from "react";
import Image from "next/image";
import Cross from "@/public/cross.svg";

interface Props {
  id: string;
  type: JSX.IntrinsicElements["input"]["type"];
  placeholder?: string;
  value?: string;
  classname?: string;
  inputMode?: JSX.IntrinsicElements["input"]["inputMode"];
  disabled?: boolean;
  autocomplete?: string;
  disableClear?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
}

export default function BaseInput(props: Props) {
  const {
    id,
    type,
    placeholder,
    value,
    classname,
    inputMode,
    disabled,
    autocomplete,
    disableClear,
    onChange,
  } = props;
  const input = useRef<HTMLInputElement>(null);

  function clearInput() {
    if (disabled || disableClear || input.current === null) return;
    input.current.value = "";
    input.current.focus();
    input.current.dispatchEvent(new Event("input", { bubbles: true }));
  }

  return (
    <div
      className={
        "bg-white relative border-2 border-black w-fit rounded-xl focus-within:bg-gray-100 transition-colors flex items-center pr-4" +
        (disabled ? " bg-white bg-opacity-10" : "") +
        " " +
        classname
      }
      onClick={(e) =>
        props.onClick
          ? props.onClick(e as React.MouseEvent<HTMLInputElement>)
          : null
      }
    >
      <input
        ref={input}
        className="outline-none bg-transparent p-3 px-6 w-full"
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        inputMode={inputMode}
        disabled={disabled}
        autoComplete={autocomplete}
        onInput={(e) =>
          onChange ? onChange(e as React.ChangeEvent<HTMLInputElement>) : null
        }
      />
      {!disabled && !disableClear ? (
        <div
          onClick={clearInput}
          className="input-clear rounded-full max-w-6 max-h-6 grid place-content-center bg-black text-white font-bold text-sm transition-transform ease-in-out ml-auto cursor-pointer"
        >
          <Image src={Cross} alt="Clear" width={40} />
        </div>
      ) : null}
      <style>
        {`input:placeholder-shown + div {
    transform: scale(0);
    pointer-events: none;
  }`}
      </style>
    </div>
  );
}
