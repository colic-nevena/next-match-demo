'use client'
import { Card, CardFooter, Image } from '@nextui-org/react'
import { Member } from '@prisma/client'
import React from 'react'
import Link from 'next/link';
import { calculateAge, transformImageUrl } from '@/lib/util';
import LikeButton from '@/components/LikeButton';

interface Props {
    member: Member
    likeIds: string[]
}

const MemberCard = ({ member, likeIds }: Props) => {
    const hasLiked = likeIds.includes(member.userId)

    const preventOnLikeRedirection = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
    }

    return (
        <Card fullWidth as={Link} href={`/members/${member.userId}`} isPressable>
            <Image
                isZoomed
                alt={member.name}
                width={300}
                src={transformImageUrl(member.image) || "/images/user.png"}
                className='aspect-square object-cover'
            />

            <div onClick={preventOnLikeRedirection}>
                <div className='absolute top-3 right-3 z-50'>
                    <LikeButton targetId={member.userId} hasLiked={hasLiked} />
                </div>
            </div>

            <CardFooter className='flex justify-start bg-black overflow-hidden absolute bottom-0 z-10 bg-dark-gradient'>
                <div className='flex flex-col text-white '>
                    <span className='font-semibold'>{member.name}, {calculateAge(member.dateOfBirth)}</span>
                    <span className='font-sm'>{member.city}</span>
                </div>
            </CardFooter>
        </Card>
    )
}

export default MemberCard