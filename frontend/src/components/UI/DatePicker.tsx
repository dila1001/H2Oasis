import { FC, SetStateAction, useState } from "react";
import Datepicker, { DateType, DateValueType } from "react-tailwindcss-datepicker";

type DatePickerProps = {
    date: SetStateAction<DateValueType>
    // handleDateChange: () => void
}

const DatePicker: FC<DatePickerProps> = ({ date }) => {
    const [value, setValue] = useState<DateValueType>({
        startDate: new Date(),
        endDate: null
    });

    const handleValueChange = (newValue: SetStateAction<DateValueType>) => {
        console.log("newValue:", newValue);
        // setValue(newValue);
        setValue(date);
    }

    return (
        <Datepicker
            value={value}
            onChange={handleValueChange}
            asSingle={true}
        />
    );
};
export default DatePicker;