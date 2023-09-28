import Header from './header';

const getLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen transition-colors duration-150 bg-gray-100">
      <Header />
      
      <div>
        {children}
      </div>
      
    </div>
  );
  

};

export default getLayout;
