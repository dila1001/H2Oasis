import { FC, SetStateAction, useState } from "react";
import Datepicker, { DateValueType } from "react-tailwindcss-datepicker";

const DatePicker: FC = () => {
    const [value, setValue] = useState<DateValueType>({
        startDate: new Date(),
        // endDate: new Date().setMonth(11)
        endDate: new Date()
    });

    const handleValueChange = (newValue: SetStateAction<DateValueType>) => {
        console.log("newValue:", newValue);
        setValue(newValue);
        // setValue((prevValue) => ({
        //     ...prevValue,
        //     ...newValue
        // }));
    }

    return (
        <Datepicker
            value={value}
            onChange={handleValueChange}
        />
    );
};
export default DatePicker;