import { getAuthUserId } from '@/app/actions/authActions'
import { getMemberByUserId, getMemberPhotosByUserId } from '@/app/actions/memberActions'
import { CardHeader, Divider, CardBody } from '@nextui-org/react'
import React from 'react'
import MemberPhotoUpload from './MemberPhotoUpload'
import MemberPhotos from '@/components/MemberPhotos'

const PhotosPage = async () => {
    const userId = await getAuthUserId()
    const photos = await getMemberPhotosByUserId(userId)
    const member = await getMemberByUserId(userId)

    return (
        <>
            <CardHeader className='flex flex-row justify-between items-center'>
                <div className='text-2xl font-semibold text-secondary'>
                    Edit Profile
                </div>
                <MemberPhotoUpload />

            </CardHeader>
            <Divider />
            <CardBody>
                <MemberPhotos photos={photos} editing={true} mainImageUrl={member?.image} />
            </CardBody>
        </>
    )
}

export default PhotosPage