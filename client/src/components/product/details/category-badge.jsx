import Router from 'next/router';
import { useTranslation } from 'next-i18next';

const CategoryBadges = ({ category }) => {

  const handleClick = (path) => {
    Router.push(path);
   
  };
  return (
    <div className="w-full mt-4 md:mt-6 pt-4 md:pt-6 flex flex-row items-start border-t border-border-200 border-opacity-60">
      <span className="text-sm font-semibold text-heading capitalize me-6 py-1">
        {'Danh mục'}
      </span>
      <div className="flex flex-row flex-wrap">
        <button
            onClick={() => handleClick(`/`)}
            key={category.id}
            className="lowercase text-sm text-heading tracking-wider whitespace-nowrap py-1 px-2.5 bg-transparent border border-border-200 rounded me-2 mb-2 transition-colors hover:border-accent hover:text-accent focus:outline-none focus:bg-opacity-100"
        >
            {category.name}
        </button>
      </div>
    </div>
  );
};

export default CategoryBadges;
