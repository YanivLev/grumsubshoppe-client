import { IModifierGroup } from "./interfaces/modifier.interface";
import ModifierChip from "./modifier-chip"

interface ModifierGroupProps {
    group: IModifierGroup;
    selectedIds: string[];
    defaultIds: string[];
    onToggle: (id: string) => void;
}

export default function ModifierGroup({group, selectedIds, defaultIds, onToggle}:ModifierGroupProps) {
    return (
        <div>
            <h3>{group.name}</h3>

            {group.modifiers.elements.map((item) => (
                <ModifierChip 
                    key={item.id}
                    label={item.name}
                    selected={selectedIds.includes(item.id)}
                    isDefault={defaultIds.includes(item.id)}
                    onToggle={() => onToggle(item.id)}
                />
            ))}
        </div>
    )
}


