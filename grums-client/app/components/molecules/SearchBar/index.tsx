'use client'

import React, { ChangeEvent, useState } from 'react';

export type SearchProps = {
    onSearch: (value: string) => void;
}

const Search = (props: SearchProps) => {
    const {onSearch} = props;
    const [value, setValue] = useState('');

    const searchHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { target } = event;
        setValue(target.value);
        onSearch(target.value);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key == 'Enter') {
            onSearch(value);
        } else if (event.key === 'Escape') {
            setValue('');
            onSearch('');
        }
    };

    return (
        <div className="relative w-80 text-gray-600 mx-auto">
            <input 
                type={'search'}
                name={'search'}
                placeholder="Search for an item..."
                className="bg-gray-100 border border-gray-300 h-10 px-5 pr-10 w-full rounded-full text-sm focus:outline-none focus:border-gray-500"
                onChange={searchHandler}
                onKeyDown={handleKeyDown}
            />
            <button type="submit" className="absolute right-0 top-0 mt-3 mr-4 cursor-pointer">
            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            </button>
        </div>
    );
};

export default Search;