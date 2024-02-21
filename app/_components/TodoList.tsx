import Image from "next/image";
import List from "@/public/list.svg";
import SmallArrow from "@/public/small-arrow.svg";
import Link from "next/link";
import BaseBox from "@/app/_components/BaseBox";

interface Props {
  name: string;
  id: string;
  openTasks: number;
}

export default function TodoList(props: Props) {
  console.log(props);
  return (
    <Link href={`/app/list/${props.id}`}>
      <BaseBox classname="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src={List} alt="List icon" width={30} height={30} />
            <p>{props.name}</p>
          </div>
          <div className="flex items-center gap-3 opacity-60">
            <p>{props.openTasks}</p>
            <Image src={SmallArrow} alt="Arrow icon" width={7} height={7} />
          </div>
        </div>
      </BaseBox>
    </Link>
  );
}
