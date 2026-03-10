interface ModifierChipProps {
    label: string;
    selected: boolean;
    isDefault: boolean;
    onToggle: () => void;
    isExtra: boolean;
    onExtra: () => void;
    isLight: boolean;
    onLight: () => void;
}


export default function ModifierChip({label, selected, isDefault, onToggle, isExtra, onExtra, isLight, onLight}: ModifierChipProps) {
    return (
        <div className="relative flex flex-col items-center gap-2 cursor-pointer w-[80px]">
            <button onClick={onToggle}
                className="cursor-pointer"
            >
                {/* Circle container */}
                <div className={`
                    relative w-20 h-20 rounded-full
                    flex items-center justify-center
                    transition-all

                    ${selected ? 'bg-green-50 border-2 border-green-500 ' : 'bg-gray-100 hover:bg-green-50'}

                `}>
                </div>

                <span className="text-sm text-center text-gray-700 max-w-[100px] break-words">
                        {label}
                    </span>
            </button>

            {selected ? (
                    <div className="inline-flex rounded-base shadow-xs gap-1 -space-x-px" >
                        <button onClick={onExtra} className={`rounded-l-lg transition-colors duration-300 ease-in-out px-2 cursor-pointer text-sm ${isExtra ? 'bg-gradient-to-r from-green-300 to-green-400  ' : 'bg-gradient-to-r from-gray-200 to-gray-300 '}`}>
                            Ex
                        </button>

                        <button onClick={onLight} className={`rounded-r-lg transition-colors duration-300 ease-in-out px-2 cursor-pointer text-sm ${isLight ? 'bg-gradient-to-r from-green-300 to-green-400  ' : 'bg-gradient-to-r from-gray-200 to-gray-300 '}`}>
                            Lt
                        </button>

                    </div>
            ):<></>}
        </div>
    )
}
