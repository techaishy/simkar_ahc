import ManualCard from "./ManualCard";

type Props = {
  onClose: () => void;
  tipe: "masuk" | "pulang";
  onSubmit: (data: any) => Promise<void>;
};

export default function AbsensiManual({ onClose, tipe, onSubmit }: Props) {
  return (
    <div className="p-4 space-y-4">
      <ManualCard tipe={tipe} onClose={onClose} onSubmit={onSubmit} />
    </div>
  );
}
