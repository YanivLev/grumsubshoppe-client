"use client"

import { useState } from 'react';
import SizeVariant from './size-variant';
import {Modifier} from "./interfaces/modifier.interface";

interface ModifierSelection{
    variations: Modifier[];
    selectedItemId?: string;
    onSelect: (item: Modifier) => void;
  }
