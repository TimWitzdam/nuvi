interface Props {
  name: string;
  options: { label: string; value: string }[];
  defaultValue: string;
  defaultDisabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  classname?: string;
  refRelation?: React.RefObject<HTMLSelectElement>;
}

export default function BaseSelect({
  name,
  options,
  defaultValue,
  defaultDisabled,
  onChange,
  classname,
  refRelation,
}: Props) {
  return (
    <select
      ref={refRelation}
      name={name}
      className={`p-4 rounded-xl border-2 border-black outline-none focus:bg-gray-100 transition-colors ${classname}`}
      onChange={onChange}
      defaultValue={defaultValue}
    >
      {options.map((option) => (
        <option
          value={option.value}
          key={option.value}
          disabled={
            defaultValue == option.value && defaultDisabled ? true : false
          }
        >
          {option.label}
        </option>
      ))}
    </select>
  );
}
