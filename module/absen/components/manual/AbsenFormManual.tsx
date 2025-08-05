import ManualCard from "./ManualCard";

type Props = {
  onClose: () => void;
  tipe: "masuk" | "pulang";
};

export default function AbsensiManual({ onClose, tipe }: Props) {
  return (
    <div className="p-4 space-y-4">
      <ManualCard tipe={tipe} onClose={onClose} />
    </div>
  );
}
