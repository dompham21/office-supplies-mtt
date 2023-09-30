import CheckMarkIcons from "@components/icons/check-mark-icons";
import EditIcons from "@components/icons/edit-icons";
import EyeIcons from "@components/icons/eye-icons";
import TrashIcons from "@components/icons/trash-icons";
import Link from "next/link";
import { StopOutlined, EyeOutlined,CheckCircleOutlined } from '@ant-design/icons';
import { Tooltip } from "antd";


const ActionButtons = ({
  id,
  editUrl,
  detailsUrl,
  handleDelete,
  handleApprove,
  approveButton = false,
  deleteButton = false,
  viewButton = false,
  viewModal,
  handleOpenModal
}) => {
 
   
  return (
    <div className="gap-3 inline-flex items-center w-auto">
        
        {deleteButton && (
          <Tooltip placement="top" title={"Vô hiệu hoá"}>
            <button
              onClick={(e) => handleDelete(e, id)}
              className="text-red-500 flex items-center justify-center transition text-xl duration-200 hover:text-red-600 focus:outline-none"
              title={"Delete"}
            >
              <StopOutlined />
            </button>
          </Tooltip>
           
        )}
        {approveButton && (
          <Tooltip placement="top" title={"Kích hoạt lại"}>

            <button
                onClick={(e) => handleApprove(e, id)}
                className=" text-[#009f7f] flex items-center justify-center transition text-xl duration-200  focus:outline-none"
                title={"Approve"}
            >
              <CheckCircleOutlined />
            </button>
          </Tooltip>
        )}
        {
          viewButton && detailsUrl && (
            <Tooltip placement="top" title={"Xem chi tiết"}>
              <Link

                href={detailsUrl}
                className="transition flex items-center justify-center text-[23px] duration-200 hover:text-heading"
                title={"View"}
              >
                <EyeOutlined />
              </Link>
            </Tooltip>
    
          )
        }
        {editUrl && (
          <Tooltip placement="top" title={"Chỉnh sửa"}>
            <Link
              href={editUrl}
              className="text-base transition duration-200 hover:text-heading"
              title={"Edit"}
            >
              <EditIcons width={16} />
            </Link>
          </Tooltip>

        )}
        {
          viewModal && handleOpenModal && (
            <Tooltip placement="top" title={"Xem chi tiết"}>
              <div
                onClick={()=> handleOpenModal(id)}
                className="transition flex items-center justify-center text-[23px] cursor-pointer duration-200 hover:text-heading"
              >
                <EyeOutlined />
              </div>
            </Tooltip>
    
          )
        }
    </div>
  );
};

export default ActionButtons;
