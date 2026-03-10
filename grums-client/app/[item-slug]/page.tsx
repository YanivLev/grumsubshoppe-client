<<<<<<< Updated upstream
import React from 'react';
import { Typography, Divider, Stack } from '@mui/material';
import getItemGroupById  from "@/app/[item-slug]/edit-sub/actions/get-item-group";
import {ItemGroup as IItemGroup} from "@/app/components/menu/interfaces/item-group.interface";
import SizeVariant from '@/app/[item-slug]/edit-sub/size-variant';
import SubCustomizer from './edit-sub/edit-sub';
=======
import getItemGroupById from "@/app/actions/item/get-item-group";
import getItemById from "@/app/actions/item/get-item";
import SubCustomizer from '@/app/components/organisms/SubCustomizer';

>>>>>>> Stashed changes
export default async function EditSubPage(props: { 
  params: Promise<{ 'item-slug': string }>;
  searchParams: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const slug = params['item-slug'];
  const groupId = searchParams.id;
  console.log("groupId:", groupId)
  const itemGroupData = await getItemGroupById(groupId);
<<<<<<< Updated upstream
  console.log("Item Group Data:", itemGroupData.items?.elements);
  // Now you can fetch directly by ID without any searching!
  // const groupDetails = await getItemGroupById(groupId);
  // 1. DATA FETCHING (Server Side)
  // In a real scenario, you'd do:
  // const item = await getItemBySlug(itemSlug);
  // const modifierGroups = await getModifierGroups(item.id);
  
  // Mock Data for layout building:
  // const displayName = slug?.replace(/-/g, ' ');
  // const itemPrice = 15; 

  // Define variations based on itemGroupData or mock data
  const variations = itemGroupData.items?.elements || [];

=======
  const isItemGroup = (itemGroupData?.items?.elements?.length ?? 0) > 0;
  const variations = isItemGroup ? itemGroupData.items.elements : [];
  const itemData = isItemGroup ? null : await getItemById(groupId);
  
>>>>>>> Stashed changes
  return (
    <main className="p-10">
      {/* 2. Pass the data to the Client Component for interactivity */}
      <SubCustomizer 
        itemGroupName={itemGroupData.name} 
        variations={variations} 
      />
    </main>
  );
}
