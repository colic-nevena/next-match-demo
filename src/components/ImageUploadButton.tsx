'use client'

import React from 'react'
import { CldUploadButton, CloudinaryUploadWidgetResults } from "next-cloudinary"
import { HiPhoto } from 'react-icons/hi2'

interface Props {
    onUploadImage: (result: CloudinaryUploadWidgetResults) => void
}

const ImageUploadButton = ({ onUploadImage }: Props) => {
    return (
        <CldUploadButton
            options={{ maxFiles: 1 }}
            onSuccess={onUploadImage}
            signatureEndpoint='/api/sign-image'
            uploadPreset='nm-demo'
            className={`flex items-center gap-2 border-2 border-secondary text-secondary
                rounded-lg py-2 px-4 hover:bg-secondary/10`}
        >
            <HiPhoto size={28} />
            Upload new image
        </CldUploadButton>
    )
}

export default ImageUploadButton