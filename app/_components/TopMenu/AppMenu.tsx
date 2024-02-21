interface Props {
  isOpen: boolean;
  handleClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  children: React.ReactNode;
}

export default function AppMenu({ isOpen, handleClick, children }: Props) {
  return (
    <div
      className={`app-menu absolute bg-white top-10 right-0 rounded-lg border-2 border-black z-50 w-[250px] ${
        isOpen ? "open" : "closed pointer-events-none"
      }`}
      onClick={handleClick}
    >
      {children}
      <style>
        {`
          .app-menu {
            transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out;
          }
          
          .app-menu.open {
            opacity: 1;
            transform: translateY(0);
          }
          
          .app-menu.closed {
            opacity: 0;
            transform: translateY(-10px);
          }
        `}
      </style>
    </div>
  );
}
