import StickySidebarBoxedCategories from '@components/layouts/sticky-sidebar-filter';
import Header from './header';

const getLayoutPageSearch = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen transition-colors duration-150 bg-gray-100">
        <Header />
        <div className='flex border-t border-solid border-border-200 border-opacity-70'>
            {children}
        </div>
     
    </div>
  );
  

};

export default getLayoutPageSearch;
