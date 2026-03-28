import getItemGroupById from "@/app/actions/item/get-item-group";
import getItemById from "@/app/actions/item/get-item";
import SubCustomizer from '@/app/components/organisms/SubCustomizer';
import { getModifierGroups, getModifiers } from "@/app/actions/item/get-modifiers";
import { IModifierGroup } from "@/app/common/interfaces/modifier.interface";
import { IItem } from "../common/interfaces/item.interface";

export async function generateMetadata(props: { searchParams: Promise<{ id: string }> }) {
  const searchParams = await props.searchParams;
  const itemGroupData = await getItemGroupById(searchParams.id);
  return {
    title: `${itemGroupData.name} | Grums Subshoppe`,
  };
}

export default async function EditSubPage(props: {
  params: Promise<{ 'item-slug': string }>;
  searchParams: Promise<{ id: string; edit?: string; }>;
}) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const slug = params['item-slug'];
  const editCartItemId = searchParams.edit;

  const groupId = searchParams.id;
  const itemGroupData = await getItemGroupById(groupId);
  const isItemGroup = (itemGroupData?.items?.elements?.length ?? 0) > 0;

  const variations = isItemGroup ? itemGroupData.items.elements : [];
  const itemData = isItemGroup ? null : await getItemById(groupId);

  const allVariations = isItemGroup ? variations : [itemData].filter(Boolean); //Filters nulls

  const modifiersByItemId: Record<string, IModifierGroup[]> = {};
  await Promise.all(
    allVariations.map(async (item: IItem) => {
      const groups = await getModifierGroups(item.id);
      const groupsWithModifiers = await Promise.all(
        groups.map(async (group: IModifierGroup) => {
          const modifiers = await getModifiers(group.id);
          return { ...group, modifiers: { elements: modifiers } };
        })
      );
      modifiersByItemId[item.id] = groupsWithModifiers;
    })
  );

  const itemPath = `/${slug}?id=${groupId}`;

  return (
    <main className="p-10">
      {isItemGroup ? (
        <SubCustomizer
          itemGroupName={itemGroupData.name}
          variations={variations}
          modifiersByItemId = {modifiersByItemId}
          itemPath = {itemPath}
          editCartItemId={editCartItemId}
        />
      ) : (
        <SubCustomizer
          itemName={itemData?.name}
          variations={[itemData]}
          initialItem={itemData}
          modifiersByItemId = {modifiersByItemId}
          itemPath = {itemPath}
          editCartItemId={editCartItemId}
        />
      )}
    </main>
  );
}
