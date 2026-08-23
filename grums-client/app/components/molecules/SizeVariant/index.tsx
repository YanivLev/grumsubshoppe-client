import RequiredLabel from "../../atoms/RequiredLabel";
import { IItem } from "@/app/common/interfaces/item.interface";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface SizeVariantProps {
    variations: IItem[];
    selectedItemId?: string;
    onSelect: (item: IItem) => void;
}

export default function SizeVariant({variations, selectedItemId, onSelect}: SizeVariantProps) {
    return (
        <div className="w-full max-w-md mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl font-semibold">Size</span>
          <RequiredLabel/>
        </div>

        <div className="flex flex-col gap-3">
          {variations.map((item) => {
            const isSelected = selectedItemId === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelect(item)}
                className={`w-full flex items-center justify-between px-6 py-3 rounded-full border-2 transition-all duration-200 ${
                  isSelected
                    ? "border-green-600 bg-white"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <span className={`text-lg ${isSelected ? "text-black" : "text-gray-700"}`}>
                  {item.name}
                </span>

                {isSelected ? (
                  <CheckCircleIcon className="text-green-600" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gray-200" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
}