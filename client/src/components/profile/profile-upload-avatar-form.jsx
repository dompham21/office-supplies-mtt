import React, { useState } from 'react'
import { Button, Modal, Upload } from 'antd';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import Image from 'next/image';
import Dropzone from 'react-dropzone';
import { AiFillCamera } from 'react-icons/ai';
import { useAvatarMutation } from '@data/profile/use-avatar.mutation';
import { useQueryClient } from 'react-query';
import { API_ENDPOINTS } from '@utils/api/endpoints';
import { toast } from 'react-toastify';
import Loader from '@components/ui/loaders/loader';






function ProfileUploadAvatarForm({avatar}) {
    const [avatarImg, setAvatarImg] = useState(avatar)
    const { mutate: updateAvatar, isLoading: loading } = useAvatarMutation();
    const queryClient = useQueryClient();

   

    return (
        <div className='flex flex-col'>
            <form encType="multipart/form-data">
                <div className=' w-36 h-36 m-auto rounded-full p-2 border-dashed border' >
                    <div className='w-full h-full overflow-hidden rounded-full relative cursor-pointer' >
                        {
                            avatarImg && <Image className='object-cover w-36 h-36' alt='avatar' src={!avatarImg ? "" : avatarImg}  width='144' height={144}/>
                        }
                        <Dropzone accept={{'image/*': ['.jpeg', '.png']}} onDrop={(acceptedFiles) => {
                            acceptedFiles.forEach((file) => {
                                const reader = new FileReader()
                        
                                reader.onload = () => {
                                    if(reader.readyState === 2){ //is done

                                        setAvatarImg(reader.result.toString())
                                       
                                        updateAvatar({
                                            variables: {
                                                file: file
                                            }
                                        },
                                        {
                                            onSuccess: ( value ) => {
                                                const response  = value.data

                                                if (response) {
                                                    const { result, code, data, status, msg} = response;
                                                    if(result == 1 && data != null) {

                                                        toast.success('Thay đổi avatar thành công!', {
                                                            position: "top-right",
                                                            autoClose: 5000,
                                                            hideProgressBar: false,
                                                            closeOnClick: true,
                                                            pauseOnHover: true,
                                                            draggable: true,
                                                            progress: undefined,
                                                            theme: "light",
                                                        }); 

                                                        queryClient.setQueryData(
                                                            [API_ENDPOINTS.ME],
                                                            (oldData) => oldData ? {
                                                              ...oldData,
                                                              user: data
                                                            } : oldData
                                                        )
                                                    

                                                    }
                                                    else if(result == 0) {
                                                        setErrorMsg(msg);
                                                        return;
                                                    }
                                                } else {
                                                    toast.error('Thay đổi avatar thất bại!', {
                                                        position: "top-right",
                                                        autoClose: 5000,
                                                        hideProgressBar: false,
                                                        closeOnClick: true,
                                                        pauseOnHover: true,
                                                        draggable: true,
                                                        progress: undefined,
                                                        theme: "light",
                                                    });
                                                }
                                            },
                                            onError: (error) => {
                                                

                                                if(error?.response?.status == 400) {
                                                    if(error?.response?.data?.msg) {
                                                        setErrorMsg(error?.response?.data?.msg)
                                
                                                        toast.error(error?.response?.data?.msg, {
                                                            position: "top-right",
                                                            autoClose: 5000,
                                                            hideProgressBar: false,
                                                            closeOnClick: true,
                                                            pauseOnHover: true,
                                                            draggable: true,
                                                            progress: undefined,
                                                            theme: "light",
                                                        });
                                                    }
                                                }
                                                else {
                                                    toast.error('Lỗi máy chủ, xin hãy thử lại sau!', {
                                                        position: "top-right",
                                                        autoClose: 5000,
                                                        hideProgressBar: false,
                                                        closeOnClick: true,
                                                        pauseOnHover: true,
                                                        draggable: true,
                                                        progress: undefined,
                                                        theme: "light",
                                                    });
                                                }
                                            },
                                        
                                            
                                        })
                                    }
                                }     
                                reader.readAsDataURL(file)
                
                            })
                        }} multiple={false}>
                            {({getRootProps, getInputProps}) => (
                                <div 
                                    className={`cursor-pointer flex flex-col items-center justify-center absolute top-0 left-0 w-full h-full ${avatarImg ? "opacity-0" : "opacity-75"} text-lg bg-[#f4f6f8]`}
                                    {...getRootProps()} 
                                >
                                    <input
                                        style={{
                                            cursor: 'pointer', position: 'absolute',opacity: 0, 
                                            zIndex:10, width: '100%',height:'100%', top:0, left:0
                                        }}  
                                        type="file" accept="image/*" {...getInputProps()}/>
                                    <AiFillCamera/>
                                    <div className='text-sm'>Upload photo</div>

                                </div>
                            )}
                        </Dropzone>       
                    </div>
                </div>
                <div className='text-sm mt-4 text-center text-[#637381]'>Allowed *.jpeg, *.jpg, *.png, *.gif max size of 3.1 MB</div>
                {loading && (
                    <div className="h-16 flex justify-center items-center mt-2 ms-2">
                        <Loader simple={true} className="w-6 h-6" />
                    </div>
                )}
            </form>
           

        </div>
    )
}

export default ProfileUploadAvatarForm