import React from 'react'
import cn from 'classnames';
import Image from 'next/image';

function Avatar(props) {
    const { 
        src, 
        className, 
        title, 
        ...rest
    } = props;


    return (
         <div
            className={cn(
                'relative cursor-pointer w-10 h-10 overflow-hidden rounded-full border border-border-100',
                className
            )}
            {...rest}
        >
            <Image alt={title} src={src} loading="eager"
              fill="true"
              className=' object-cover' priority={true} />
        </div>
    )
}

export default Avatar