// import { UploadIcon } from "@components/icons/upload-icon";
import CloseIcons from "@components/icons/close-icons";
import UploadIcons from "@components/icons/upload-icons";
import Loader from "@components/ui/loaders/loader";
import { useImageMutation } from "@data/image/use-image-upload.mutation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";

const getPreviewImage = (value) => {
  let images = [];
  if (value) {
    images = Array.isArray(value) ? value : [value];
  }
  return images;
};

export default function Uploader({ onChange, value, multiple}) {
  const [images, setImages] = useState(getPreviewImage(value));
  const { mutate: upload, isLoading: loading } = useImageMutation();
  const { getRootProps, getInputProps } = useDropzone({
    accept: {'image/*': ['.jpeg', '.png']},
    multiple: multiple,
    onDrop: async (acceptedFiles) => {
        acceptedFiles.forEach((file) => {
            const reader = new FileReader()

            reader.onload = () => {
                if(reader.readyState === 2){ //is done
                    upload({
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
                              console.log(data)
                              let mergedData;
                              if (multiple) {
                                mergedData = images.concat(data);
                                setImages(images.concat(data));
                              } else {
                                mergedData = data;
                                setImages([data]);
                              }
                              if (onChange) {
                                onChange(mergedData);
                              }
                            }
                            else if(result == 0) {
                              toast.error(msg, {
                                position: "top-right",
                                autoClose: 5000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                                theme: "light",
                              });
                              return;
                            }
                        } else {
                          toast.error('Đăng tải hình ảnh thất bại!', {
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
    },
  });

  const handleDelete = (image) => {

    const imagesAfterFilter = images.filter((i) => i !== image);

    setImages(imagesAfterFilter);
    if (onChange) {
      onChange(imagesAfterFilter);
    }
  };

  return (
    <section className="upload">
      <div
        {...getRootProps({
          className:`border-dashed border-2 border-border-base h-36 rounded flex flex-col justify-center items-center cursor-pointer focus:border-accent-400 focus:outline-none`
        })}
      >
        <input {...getInputProps()} />
        <UploadIcons className="text-muted-light" />
        <p className="text-body text-sm mt-4 text-center">
          <span className="text-accent font-semibold">
            {"Upload an image"}
          </span>{" "}
          {"or drag and drop"} <br />
          <span className="text-xs text-body">{"PNG, JPG"}</span>
        </p>
      </div>
        {
            images && !loading && images.map(image =>  
            <div
              className="inline-flex flex-col overflow-hidden border border-border-200 rounded mt-2 me-2 relative"
              key={image}
            >
              <div className="rounded overflow-hidden h-64 w-64 relative mt-3">
                <Image fill={true} className='object-cover' alt='img-product' src={!image ? "" : image} />
              </div>
              {multiple ? (
                <button
                  className="w-4 h-4 flex items-center justify-center rounded-full bg-red-600 text-xs text-light absolute top-1 end-1 shadow-xl outline-none"
                  onClick={() => handleDelete(image)}
                >
                  <CloseIcons width={10} height={10} />
                </button>
              ) : null}
            </div>)
            
        }
        {loading && (
          <div className="h-16 flex items-center mt-2 ms-2">
            <Loader simple={true} className="w-6 h-6" />
          </div>
        )}
    </section>
  );
}
