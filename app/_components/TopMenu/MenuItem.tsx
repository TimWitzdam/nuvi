import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import Link from "next/link";

interface Props {
  title: string;
  link: string;
  icon: StaticImport;
  last?: boolean;
  imageClassName?: string;
}

export default function MenuItem(props: Props) {
  return (
    <Link
      href={props.link}
      className={`p-4 flex items-center justify-between hover:bg-gray-100 transition-colors ${
        !props.last && "border-b-2 border-black border-opacity-20 rounded-t-lg "
      } ${props.last && "rounded-b-lg"}`}
    >
      <span>{props.title}</span>
      <Image
        src={props.icon}
        alt={props.title}
        width={27}
        height={27}
        className={props.imageClassName}
      />
    </Link>
  );
}
