import Skeleton from 'react-loading-skeleton'
import "react-loading-skeleton/dist/skeleton.css"

export default function ModifierGroupSkeleton() {
    return (
        <div className="mb-8">
            <Skeleton width={120} height={24} className="mb-4" />
            
            <div className="flex gap-4">
                {Array.from({ length: 4}).map((_, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 w-[80px]">
                        <Skeleton circle width={80} height={80} />
                        <Skeleton width={60} height={14} />
                    </div>
                ))}
            </div>
        </div>
    )
}