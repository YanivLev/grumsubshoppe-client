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
        <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">{group.name}</h3>

            <div className="flex gap-4 overflow-x-auto">
            {group.modifiers?.elements?.map((item) => (
                <ModifierChip 
                    key={item.id}
                    label={item.name}
                    selected={selectedIds.includes(item.id)}
                    isDefault={defaultIds.includes(item.id)}
                    onToggle={() => onToggle(item.id)}
                />
            ))}
            </div>
        </div>
    )
}


