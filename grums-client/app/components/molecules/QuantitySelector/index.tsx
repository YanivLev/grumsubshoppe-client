'use client'

interface QuantitySelectorProps {
    quantity: number;
    max: number;
    onChange: (quantity: number ) =>  void;
}

export default function QuantitySelector({ quantity, max, onChange }: QuantitySelectorProps) {
    return (
        <div className="flex justify-between items-center px-2 mb-4 w-full h-12 rounded-full bg-gray-300">
            <span className="font-semibold text-gray-700">Quantity</span>
            <div className="flex items-center gap-3">
                {quantity > 1 && (
                    <button
                        onClick={() => onChange(quantity - 1)}
                        className="w-8 h-8 rounded-full bg-gray-200 cursor-pointer hover:bg-gray-300 font-bold text-lg flex items-center justify-center"
                    >
                        −
                    </button>
                )}
                <span className="text-lg font-semibold w-4 text-center">{quantity}</span>
                <button
                    onClick={() => onChange(quantity + 1)}
                    disabled={quantity >= max}
                    className="w-8 h-8 rounded-full bg-gray-200 cursor-pointer hover:bg-gray-300 font-bold text-lg flex items-center justify-center disabled:invisible disabled:cursor-not-allowed"
                >
                    +
                </button>
            </div>
        </div>
    );
}