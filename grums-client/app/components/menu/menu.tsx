import Grid from '@mui/material/Grid';
import getItems from "./actions/get-items";
import getItemGroups from "./actions/get-item-groups";
import Item from "./item-card";
import MenuManager from "./category-selector";
import {cache} from "react";

export default async function Items() {
    // Only one call to the backend
    const items = await getItems();
    const itemGroups = await getItemGroups();
    // console.log("item Groups:", itemGroups);
    if (!items || items.length === 0) {
        return <p className="text-center py-10">No items available.</p>;
    }

//     return (
        // <Grid container spacing={3} sx={{width: '100%'}}>
        //     {/* The .map creates exactly one component per ID in your array */}
        //     {items.map((item: any) => (
        //         <Grid key={item.id} size={{ xs: 12, sm: 4, lg: 2 }}>
        //             <Item item={item} />
        //         </Grid>
        //     ))}
        // </Grid>

//         <Grid container spacing={2}>
//             {items.map((item: any) => (
//                 <Grid key={item.id} size={4}>
//                     <Item item={item} />
//                 </Grid>
//             ))}
//         </Grid>
//     );
// }

return (
    <section className="max-w-6xl mx-auto py-12 px-4">
        <div className="text-center mb-10">
            <h2 className="text-4xl font-black uppercase italic">Menu</h2>
            <p className="text-gray-500">Choose a category to view items</p>
        </div>

        {/* Pass the server-fetched items to the dynamic manager */}
        <MenuManager initialItemGroups={itemGroups} />
        
    </section>
);
}