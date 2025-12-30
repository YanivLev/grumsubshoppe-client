// app/[itemSlug]/page.tsx
import React from 'react';
import { Typography, Stack } from '@mui/material';

// This is a Server Component by default
export default async function EditSubPage({ params }: { params: { itemSlug: string } }) {
  // We grab the slug from the URL parameters
  const { itemSlug } = params;

  return (
    <div className="min-h-screen bg-white">
      {/* This is where your Building Blocks will live. 
         For now, let's just confirm the routing works.
      */}
      <div className="p-10">
      <Typography variant="h3" className="font-bold capitalize">
          {/* 2. Add a '?' check just in case, to prevent the crash */}
          {itemSlug?.replace(/-/g, ' ')}
      </Typography>
        <Typography variant="subtitle1" className="text-gray-500">
            Customize your sub exactly how you like it.
        </Typography>
      </div>

      {/* Soon, we will place:
          <CartSidebar /> 
          <CustomizerContainer /> 
      */}
    </div>
  );
}