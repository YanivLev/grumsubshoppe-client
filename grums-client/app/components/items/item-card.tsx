import { Typography } from "@mui/material";
import { Item as IItem } from "./interfaces/item.interface";
import rightArrow from "../icons/RightArrow.svg";
import Box from "@mui/material/Box";
import { Stack } from "@mui/material";
import Link from "next/link"; // 1. Import Link for client-side navigation

interface ItemProps {
    item: IItem;
}

export default function Item({ item }: ItemProps) {
    // 2. Create the slug (The Turkey Ridge -> the-turkey-ridge)
    const slug = item.name.toLowerCase().replace(/ /g, '-');

    return (
        /* 3. Changed 'has-[button:hover]' to 'has-[a:hover]' because Link renders an <a> tag */
        <Box className="bg-linear-to-t from-white to-gray-100 w-110 rounded-3xl h-24 flex items-center p-4 
                        transition-all duration-500 ease-in-out shadow-md
                        has-[a:hover]:shadow-2xl has-[a:hover]:-translate-y-2 has-[a:hover]:bg-green-50">
            
            <Stack direction="row" spacing={2} alignItems="center" className="w-full px-2">

                <div className="h-16 w-16 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                     {/* Your image mapping logic will go here */}
                </div>

                <div className="text-left flex-grow">
                    <Typography variant="h6" className="font-bold leading-tight">
                        {item.name}
                    </Typography>
                    <Typography sx={{WebkitLineClamp: 2}} variant="body2" className="text-gray-500 line-clamp-1">
                        Mayo, Lettuce, Onions,
                        <br /> 
                        Tomato, Turkey, Provolone
                    </Typography>
                </div>

                <div>
                    {/* 4. Link wrapper around the button */}
                    <Link href={`/${slug}`} className="block">
                        <button className="flex cursor-pointer items-center justify-center hover:scale-125 transition-transform duration-300">
                            <img src={rightArrow.src} alt="Right Arrow" className="w-10 h-10"/>
                        </button>
                    </Link>
                </div>   
            </Stack>
        </Box>   
    );
}