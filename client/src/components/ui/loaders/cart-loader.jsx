import ContentLoader from 'react-content-loader';

const CartLoader = (props) => (
  <ContentLoader 
    speed={2}
    width={720}
    height={160}
    viewBox="0 0 1000 160"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="124" y="42" rx="3" ry="3" width="308" height="6" /> 
    <rect x="124" y="7" rx="3" ry="3" width="700" height="6" /> 
    <rect x="124" y="24" rx="3" ry="3" width="680" height="6" /> 
    <rect x="4" y="6" rx="0" ry="0" width="100" height="100" />
  </ContentLoader>
);

export default CartLoader;
