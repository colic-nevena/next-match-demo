import React from 'react'
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { PiSpinnerGap } from 'react-icons/pi';

interface Props {
    selected: boolean;
    loading: boolean;
}

const StarButton = ({ selected, loading }: Props) => {
    return (
        <div className='relative hover:opacity-80 transition cursor-pointer'>
            {!loading ? (
                <>
                    <AiOutlineStar
                        size={32}
                        className='fill-white absolute -top-[2px] -right-[2px]'
                    />
                    <AiFillStar
                        size={28}
                        className={selected ? "fill-yellow-300" : "fill-neutral-500/70"}
                    />
                </>
            ) : (
                <PiSpinnerGap size={32} className='fill-white animate-spin' />
            )}
        </div>
    )
}

export default StarButton