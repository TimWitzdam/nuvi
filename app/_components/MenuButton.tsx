interface Props {
  onClick: () => void;
  children: React.ReactNode;
  open: boolean;
}

export default function MenuButton(props: Props) {
  return (
    <button
      onClick={props.onClick}
      className={`relative rounded-full w-10 h-10 border-2 border-black grid place-content-center hover:bg-black group ${
        props.open && "bg-black"
      }`}
    >
      <svg
        className={`group-hover:text-white transition-colors ${
          props.open && "text-white"
        }`}
        width="23"
        height="5"
        viewBox="0 0 23 5"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5 2.5C5 3.88071 3.88071 5 2.5 5C1.11929 5 0 3.88071 0 2.5C0 1.11929 1.11929 0 2.5 0C3.88071 0 5 1.11929 5 2.5Z"
          fill="currentColor"
        />
        <path
          d="M14 2.5C14 3.88071 12.8807 5 11.5 5C10.1193 5 9 3.88071 9 2.5C9 1.11929 10.1193 0 11.5 0C12.8807 0 14 1.11929 14 2.5Z"
          fill="currentColor"
        />
        <path
          d="M23 2.5C23 3.88071 21.8807 5 20.5 5C19.1193 5 18 3.88071 18 2.5C18 1.11929 19.1193 0 20.5 0C21.8807 0 23 1.11929 23 2.5Z"
          fill="currentColor"
        />
      </svg>
      {props.children}
    </button>
  );
}
