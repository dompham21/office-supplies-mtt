import ContentLoader from 'react-content-loader';

const AddressLoader = (props) => (
  <ContentLoader 
    speed={2}
    width={1000}
    height={50}
    viewBox="0 0 1000 50"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    uniqueKey="my-random-value"
    {...props}
  >
    <rect x="0" y="42" rx="3" ry="3" width="900" height="10" /> 
    <rect x="0" y="7" rx="3" ry="3" width="200" height="10" /> 
    <rect x="0" y="24" rx="3" ry="3" width="900" height="10" /> 
  </ContentLoader>
);

export default AddressLoader;
