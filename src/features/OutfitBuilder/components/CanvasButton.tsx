interface CanvasButtonProps {
    label: string;
    btnFunc: () => void;
    btnDisabled?: boolean;
    icon?: React.ReactNode;
}

const CanvasButton = ({ label, btnFunc, btnDisabled, icon }: CanvasButtonProps) => {
    return (
        <button
            type="button"
            disabled={btnDisabled}
            onClick={btnFunc}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-800 
            enabled:hover:bg-white enabled:hover:shadow-[0_2px_4px_rgba(0,0,0,0.08)]
            disabled:cursor-not-allowed disabled:opacity-50"
        >
            {icon}
            <span className="hidden xl:inline">
                {label}
            </span>
        </button>
    )
}

export default CanvasButton
