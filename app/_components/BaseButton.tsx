interface Props {
  id: string;
  type?: JSX.IntrinsicElements["button"]["type"] | "button";
  classname?: string;
  disabled?: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
}

export default function BaseButton(props: Props) {
  const { id, type, classname, disabled, onClick, children } = props;
  return (
    <button
      className={
        "bg-primary w-fit text-white p-4 rounded-xl flex items-center justify-center hover:bg-[#25AFE9] transition-colors" +
        (disabled ? " bg-white bg-opacity-10" : "") +
        " " +
        classname
      }
      id={id}
      type={type}
      disabled={disabled}
      onClick={(e) => onClick(e)}
    >
      {children}
    </button>
  );
}
