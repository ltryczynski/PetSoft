"use client";
import { useDebounce } from "@/lib/hooks";
import { createContext, useState } from "react";

type SearchContextProps = {
  debounceText: string;
  searchText: string;
  handleChangeSearchText: (text: string) => void;
};

export const SearchContext = createContext<SearchContextProps | null>(null);

export function SearchContextProvider({ children }: { children: React.ReactNode }) {
  const [searchText, setSearchText] = useState("");
  const debounceText = useDebounce(searchText, 500);

  const handleChangeSearchText = (text: string) => {
    setSearchText(text);
  };

  return (
    <SearchContext.Provider
      value={{
        debounceText,
        searchText,
        handleChangeSearchText,
      }}>
      {children}
    </SearchContext.Provider>
  );
}
