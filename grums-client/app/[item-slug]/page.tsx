import React from 'react';
import { Typography, Divider, Stack } from '@mui/material';
import { getById, get } from '../common/util/fetch';
// Import your Server Actions (Create these in the next step)
// import { getItemBySlug } from '@/items/actions/get-item'; 
// import { getModifierGroups } from '@/items/actions/get-modifiers';

export default async function EditSubPage({ params }: { params: { itemSlug: string } }) {
  const { itemSlug } = params;
  
  
  // 1. DATA FETCHING (Server Side)
  // In a real scenario, you'd do:
  // const item = await getItemBySlug(itemSlug);
  // const modifierGroups = await getModifierGroups(item.id);
  
  // Mock Data for layout building:
  const displayName = itemSlug?.replace(/-/g, ' ');
  const itemPrice = 15.00; 

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white">
      
  `      {/* --- LEFT SIDEBAR: THE CART (Building Block 1) --- */}
        <aside className="w-full md:w-96 bg-[#F3F3F3] border-r border-gray-200 p-6 flex flex-col sticky top-0 h-screen">
          <Typography variant="h4" className="font-bold text-center mb-10 mt-4">
            Your Cart
          </Typography>

          {/* The Cart Item Preview Card */}`
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex-grow overflow-y-auto">
          <div className="flex justify-between items-start">
            <div className="text-left">
              <Typography variant="h6" className="font-bold capitalize leading-tight">
                {displayName}
              </Typography>
              <Typography variant="caption" className="text-gray-500 block mt-2 leading-relaxed">
                {/* This string will eventually be dynamic based on user clicks */}
                Half, Italian Bread, Mayo, Lettuce, Onion, Tomato, Turkey, Provolone, Spices
              </Typography>
            </div>
          </div>
          
          {/* Price and Quantity Controls */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
             <Typography className="font-bold text-green-700">{itemPrice.toFixed(2)}$</Typography>
             <div className="flex items-center gap-3 bg-gray-50 px-3 py-1 rounded-full border">
                <button className="text-gray-400 hover:text-black">-</button>
                <span className="font-bold text-sm">2</span>
                <button className="text-gray-400 hover:text-black">+</button>
             </div>
          </div>  
        </div>

        {/* LOGIC BUTTONS */}
        <div className="mt-8 space-y-3">
          <button className="w-full bg-[#82C471] hover:bg-green-600 text-white py-4 rounded-full font-bold text-xl transition-all shadow-md">
            Proceed to Checkout
          </button>
          <div className="flex gap-2">
            <button className="flex-1 bg-white border border-gray-300 py-2 rounded-full font-semibold text-gray-600 hover:bg-gray-50 text-sm">
              Add More
            </button>
            <button className="flex-1 bg-white border border-gray-300 py-2 rounded-full font-semibold text-gray-600 hover:text-red-500 hover:border-red-200 text-sm">
              Cancel
            </button>
          </div>
        </div>
      </aside>

      {/* --- RIGHT SECTION: THE CUSTOMIZER (Building Block 2) --- */}
      <main className="flex-grow p-8 md:p-16 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <Typography variant="h4" className="font-bold mb-4">
            Customize Your Sub
          </Typography>
          <div className="h-1.5 w-full bg-gray-100 mb-12 rounded-full" />

          {/* This is where your loop of ModifierSections will go */}
          <div className="space-y-12">
            
            {/* Example of how a Modifier Section will look */}
            <section>
              <Typography variant="h6" className="font-bold mb-6">Bread</Typography>
              <Stack direction="row" spacing={2} className="overflow-x-auto pb-4">
                {/* This will eventually be its own Component: <ModifierCircle /> */}
                <div className="flex flex-col items-center gap-2 min-w-[80px]">
                  <button className="w-16 h-16 rounded-full bg-white border-2 border-green-500 shadow-sm flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-gray-200" /> {/* Bread Icon */}
                  </button>
                  <Typography variant="caption" className="font-bold">Italian</Typography>
                </div>
                {/* ... more circles */}
              </Stack>
            </section>

          </div>
        </div>
      </main>
    </div>
  );
}