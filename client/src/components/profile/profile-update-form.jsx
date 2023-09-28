import React from 'react'
import ProfileUpdateInfoForm from './profile-update-info-form'
import ProfileUploadAvatarForm from './profile-upload-avatar-form'

function ProfileUpdateForm({user, loading}) {
  return (
    <div className='px-[30px] py-6 flex items-start'>
        <div className='pr-12' style={{flex: 1}}>
            <ProfileUpdateInfoForm initialValues={user} loading={loading}/>
        </div>
        <div className='flex justify-center border-l w-64'>
            <ProfileUploadAvatarForm avatar={user?.avatar}/>
        </div>
    </div>
  )
}

export default ProfileUpdateForm