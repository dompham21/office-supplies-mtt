import React from 'react'
import Avatar from '@components/ui/avatar'
import { default as avatarPlaceholder } from '@assets/placeholders/avatar.png';

import rangeMap from '@utils/rangeMap';


function ReviewCard({ review }) {
    const {id, comment, user, date, vote} = review;
  return (
    <li className="flex border-b py-5">
        <div className="mr-3">
            <div className="w-10 text-center rounded-full overflow-hidden">
                <Avatar
                    className="bg-accent shadow-sm"
                    src={user && user?.avatar ? user?.avatar : avatarPlaceholder}
                    title={user?.name}
                />
            </div>
        </div>
        <div className="flex flex-col">
            <div className="flex items-center">
                <div className="text-base font-bold mr-3">{user?.name}</div>
                <div className="text-xs text-slate-400">{date}</div>
                <div className='ml-5'>
                </div>
            </div>
            <div className="flex items-center">
                {   vote && 
                     <>
                        {rangeMap(vote, (i) => (
                            <svg key={i} aria-hidden="true" className="w-4 h-4 text-red-star" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>First star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                        ))}
                    </>
                }
                {
                    vote && 
                    <>
                        {rangeMap(5 - vote > 0 ? 5 - vote : 0, (i) => (
                            <svg aria-hidden="true" className="w-4 h-4 text-gray-300 dark:text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Fifth star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                        ))}
                    </>
                }
            </div>
            <div className="text-sm my-4">{comment}</div>

        </div>
    </li>
  )
}

export default ReviewCard