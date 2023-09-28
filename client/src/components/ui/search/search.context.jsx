import { useRouter } from 'next/router';
import React, { FC, useEffect, useMemo, useState } from 'react';


const initialState = {
  searchTerm: '',
};

export const SearchContext = React.createContext(initialState);

SearchContext.displayName = 'SearchContext';

export const SearchProvider = (props) => {
  const { query } = useRouter();
  const [searchTerm, updateSearchTerm] = useState('');

  useEffect(() => {
    if (query?.text) {
      updateSearchTerm(query?.text);
    } else {
      updateSearchTerm('');
    }
  }, [query]);

  const value = useMemo(
    () => ({
      searchTerm,
      updateSearchTerm,
    }),
    [searchTerm]
  );

  return <SearchContext.Provider value={value} {...props} />;
};

export const useSearch = () => {
  const context = React.useContext(SearchContext);
  if (context === undefined) {
    throw new Error(`useSearch must be used within a SearchProvider`);
  }
  return context;
};
