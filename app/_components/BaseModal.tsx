interface Props {
  onClose: () => void;
  children: React.ReactNode;
}
export default function BaseModal({ onClose, children }: Props) {
  return (
    <div>
      <div
        onClick={onClose}
        className="fixed bg-black bg-opacity-60 top-0 left-0 w-screen h-screen z-40"
      ></div>
      <div className="fixed px-6 w-full  max-w-[500px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
        <div className="bg-white p-8 rounded-xl">{children}</div>
      </div>
    </div>
  );
}
