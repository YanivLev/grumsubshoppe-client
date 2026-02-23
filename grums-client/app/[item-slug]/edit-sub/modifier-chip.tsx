import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

interface ModifierChipProps {
    label: string;
    selected: boolean;
    isDefault: boolean;
    onToggle: () => void;
}


export default function ModifierChip({label, selected, isDefault, onToggle}: ModifierChipProps) {
    return (

        <button onClick={onToggle}
        className="relative flex flex-col items-center gap-2 cursor-pointer w-[80px] snap-start shrink-0"
        >   
            {/* Circle container */}
            <div className={`
                relative w-20 h-20 rounded-full
                flex items-center justify-center
                transition-all

                ${selected ? 'bg-green-50 border-2 border-green-500': 'bg-gray-100 hover:bg-green-50'}

            `}>
            </div>

            <span className="text-sm text-center text-gray-700 max-w-[100px] break-words">
                    {label}    
                </span> 
        </button>
    )
}