import React from 'react'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export const LoadingSkeletonTable = () => {
    return (
        <Skeleton count={1} />
    );
}

function InlineWrapperWithMargin({ children }) {
    return <span style={{ marginRight: '10px' }}>{children}</span>
}
export const LoadingCards = () => {
    return (
        <div className="table_cards">
            <Skeleton
                count={5}
                wrapper={InlineWrapperWithMargin}
                inline
                width={200}
                height={110}
            />
        </div>
    );
}
