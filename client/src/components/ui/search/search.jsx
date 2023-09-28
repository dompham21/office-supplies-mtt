import SearchBox from '@components/ui/search/search-box';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useSearch } from './search.context';
import { useEffect, useState } from 'react';
import { useDebounceFn } from 'ahooks';


const Search = ({ label, ...props }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { query, pathname } = router;
  const [searchTerm, updateSearchTerm] = useState(query?.keyword ?? '');

  useEffect(() => {
    if (query?.keyword) {
      updateSearchTerm(query?.keyword);
    } else {
      updateSearchTerm('');
    }
  }, [query]);

  const handleOnChange = (e) => {
    const { value } = e.target;
    updateSearchTerm(value)
    if(pathname === "/search") {
      router.push(
        {
          pathname: "/search",
          query: { ...query, keyword: value },
        },
      );
    }
  };

  const onSearch = (e) => {
    e.preventDefault();
    if (!searchTerm) {
        router.push( {
            pathname: "/",
          },
          undefined,
          {
            scroll: false,
          })
    }
    else if(searchTerm.trim() != '') {
        router.push(
            {
              pathname: "/search",
              query: { ...query, keyword: searchTerm},
            },
            undefined,
            {
              scroll: false,
            }
          );
    }
    
  };

  function clearSearch() {
    updateSearchTerm('');
    const { pathname, query } = router;
    const { text, ...rest } = query;
    if (text) {
      router.push(
        {
          pathname,
          query: { ...rest },
        },
        undefined,
        {
          scroll: false,
        }
      );
    }
  }

  return (
    <SearchBox
      label={label}
      onSubmit={onSearch}
      onClearSearch={clearSearch}
      onChange={handleOnChange}
      value={searchTerm}
      name="search"
      placeholder={"Tìm kiếm tên sản phẩm ở đây..."}
      {...props}
    />
  );
};

export default Search;
