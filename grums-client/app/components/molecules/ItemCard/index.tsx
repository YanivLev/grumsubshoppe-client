import { Typography } from "@mui/material";
import { IItem } from "@/app/common/interfaces/item.interface";
import { IItemGroup } from "@/app/common/interfaces/item-group.interface";
import Box from "@mui/material/Box";
import { Stack } from "@mui/material";
import Link from "next/link";
import AddCircleIcon from '@mui/icons-material/AddCircle';

interface ItemCardProps {
    itemGroup: IItemGroup | IItem;
    description: string;
}

export default function ItemCard({ itemGroup, description }: ItemCardProps) {
    const slug = itemGroup.name.toLowerCase().replace(/ /g, '-');

    return (
        <Box className="bg-linear-to-t from-white to-gray-100 w-full md:w-130 md:h-30 rounded-2xl md:rounded-3xl h-20 md:h-24 flex items-center p-3 md:p-4
                        transition-all duration-500 ease-in-out shadow-md
                        has-[a:hover]:shadow-xl md:has-[a:hover]:shadow-2xl has-[a:hover]:-translate-y-1 md:has-[a:hover]:-translate-y-2 has-[a:hover]:bg-green-50">

            <Stack direction="row" spacing={1.5} alignItems="center" className="w-full px-1 md:px-2">


                <div className="h-15 w-15 md:h-20 md:w-20 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden shadow-inner">
                     {/* image mapping logic */}
                </div>

                <div className="text-left flex-grow overflow-hidden">
                    <Typography variant="h6" className="font-bold leading-tight md:text-xl truncate">
                        {itemGroup.name}
                    </Typography>

                    <Typography sx={{WebkitClamp: 2}} variant="body2" className="text-gray-500 line-clamp-1 md:line-clamp-2 md:text-sm">
                        {description}
                    </Typography>
                </div>

                <div className="flex-shrink-1">
                        <button className="flex cursor-pointer items-center justify-center hover:scale-110 md:hover:scale-125 transition-transform duration-300 p-2">
                            <Link href={`/${slug}?id=${itemGroup.id}`} className="block">
                                <AddCircleIcon fontSize="large"/>
                            </Link>
                        </button>
                </div>
            </Stack>
        </Box>
    );
}
