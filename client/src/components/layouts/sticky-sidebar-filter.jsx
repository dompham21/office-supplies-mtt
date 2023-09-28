// import NotFound from "@components/ui/not-found";
// import Scrollbar from "@components/ui/scrollbar";
// import { useCategoriesQuery } from "@data/category/use-category.query";
// import { CiFilter } from "react-icons/ci";
// import { Checkbox, Col, Input, Row, Radio, Space  } from 'antd';
// import InputNumberOnly from "@components/ui/input-number";
// import { useState } from "react";
// import { useProductsSearchInfiniteQuery } from "@data/product/use-product-search-infinite.query";
// import { useRouter } from "next/router";


// const StickySidebarBoxedCategories =() => {
//   const [value, setValue] = useState(1);
//   const [sortField, setSortFiled] = useState("id");
//   const [sortDirection, setSortDirection] = useState("asc");
  
//   const { query } = useRouter();


//   const { error: errorCategories ,data: dataCategories, isLoading} = useCategoriesQuery();
//   const onChange = (checkedValues) => {
//     console.log('checked = ', checkedValues);
//   };

//   const {
//     data,
//     isLoading: loading,
//     fetchNextPage,
//     isFetchingNextPage,
//     hasNextPage,
//     error,
// } = useProductsSearchInfiniteQuery({pageSize: 20, sortField: sortField, sortDirection: sortDirection, keyword: query?.keyword});


//   const onChangeRadio = (e) => {
//     console.log('radio checked', e.target.value);
//     setValue(e.target.value);
//   };

  
//   return (
    
//   );
// };

// export default StickySidebarBoxedCategories;