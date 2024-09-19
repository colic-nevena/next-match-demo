import { CardHeader, Divider, CardBody } from '@nextui-org/react'
import React from 'react'

export default function PhotosPage() {
    return (
        <>
            <CardHeader className='text-2xl font-semibold text-secondary'>
                Profile
            </CardHeader>
            <Divider />
            <CardBody>
                Photos go here
            </CardBody>
        </>
    )
}
