import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger, SelectValue
} from "@/components/ui/select";


interface SelectPeriodProps {
  selectedPeriod: string;
  setSelectedPeriod: (value: string) => void;
}


export default function ({ selectedPeriod, setSelectedPeriod }: SelectPeriodProps) {
  return (
    <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
      <SelectTrigger className="w-32">
        <SelectValue placeholder="Pilih" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="today">Hari Ini</SelectItem>
          <SelectItem value="week">Minggu Ini</SelectItem>
          <SelectItem value="month">Bulan Ini</SelectItem>
          <SelectItem value="year">Tahun Ini</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}