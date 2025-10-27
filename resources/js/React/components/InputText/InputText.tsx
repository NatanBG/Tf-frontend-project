import { useEffect, useRef, useState } from "react";
import { InputTextProps } from "./InputText.types";
import { DEBOUNCE_MILISECONDS } from "@app/js/constants";

export default function InputText({ onChange, value = "" }: InputTextProps) {
    const [inputValue, setInputValue] = useState<string>(value);

    const timerRef = useRef<number>(null);

    useEffect(() => {
        setInputValue(value);
    }, [value]);

    useEffect(() => {
        timerRef.current = setTimeout(() => {
            onChange?.(inputValue);
        }, DEBOUNCE_MILISECONDS);

        return () => {
            (timerRef.current !== null) && clearTimeout(timerRef.current);
        }
    }, [inputValue]);

    const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const target = event.target;
        const value = target.value ?? "";
        setInputValue(value);
    }

    return (
        <input
            type="text"
            className="form-control form-control-lg text-center"
            value={inputValue}
            onChange={inputChangeHandler}
        />
    );
}
