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
        <button onClick={onToggle} className="flex items-center gap-2 cursor-pointer">

            {selected ? <CheckCircleIcon sx={{ color: 'green' }}/> : <RadioButtonUncheckedIcon/>}
            {label}


        </button>
    )
}