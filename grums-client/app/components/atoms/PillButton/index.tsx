interface PillButtonProps {
    active?: boolean;
    onClick: () => void;
    children: React.ReactNode
}

export default function PillButton({ active = false, onClick, children}: PillButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`px-6 py-2 rounded-full cursor-pointer font-bold hover:scale-105 duration-300 transition-all ${
                active ? "bg-green-600 text-white" : "bg-gray-100 text-gray-500"
              }`}
            >
                {children}
        </button>
    )
}