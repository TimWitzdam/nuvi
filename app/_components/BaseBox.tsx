interface Props {
  children: React.ReactNode;
  hoverAnimation?: boolean;
  classname?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export default function BaseBox({
  children,
  hoverAnimation,
  classname,
  onClick,
}: Props) {
  return (
    <div
      onClick={onClick}
      className={`bg-white border-2 border-black rounded-xl ${
        hoverAnimation && "hover:bg-gray-100 transition-colors"
      } ${classname}`}
    >
      {children}
    </div>
  );
}
