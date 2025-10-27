import { ButtonProps } from "./Button.types";

export default function Button({ children, onClick, classList = "" }: ButtonProps) {

    const clickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.();
    }

    const buttonClasses = [
        "btn",
        "btn-primary",
        "btn-lg",
        "px-4",
        classList
    ];

    return (
        <button
            className={buttonClasses.join(" ")}
            onClick={clickHandler}
        >
            {children}
        </button>
    );
}
