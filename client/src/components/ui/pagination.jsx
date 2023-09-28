import RCPagination from "rc-pagination";
import {FaChevronLeft, FaChevronRight} from 'react-icons/fa'
import "rc-pagination/assets/index.css";

const Pagination = (props) => {
  return (
    <RCPagination
      nextIcon={<FaChevronRight />}
      prevIcon={<FaChevronLeft />}
      {...props}
    />
  );
};

export default Pagination;
