import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Dispatch, SetStateAction } from 'react';

interface FilterByDateProps {
  startDate: Date | null;
  setStartDate: Dispatch<SetStateAction<Date | null>>;
  endDate: Date | null;
  setEndDate: Dispatch<SetStateAction<Date | null>>;
}

function FilterByDate({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}: FilterByDateProps) {
  return (
    <div className="flex items-center gap-3">
      <DatePicker
        placeholderText="Start Date"
        dateFormat="yyyy-MM-dd"
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        className="w-32 cursor-pointer rounded-[8px] border px-3 py-[.3rem] outline-none placeholder:text-sm"
        portalId="root"
      />

      <DatePicker
        placeholderText="End Date"
        dateFormat="yyyy-MM-dd"
        selected={endDate}
        onChange={(date) => setEndDate(date)}
        className="w-32 cursor-pointer rounded-[8px] border px-3 py-[.3rem] outline-none placeholder:text-sm"
        portalId="root"
      />
    </div>
  );
}

export default FilterByDate;
