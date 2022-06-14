import React from 'react'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export const LoadingSkeletonTable = () => {
    return (
        <tbody>
            <tr>
                <td style={{textAlign: 'center'}} className="table-body_item"><Skeleton count={1} width={60} height={20} /></td>
                <td style={{textAlign: 'center'}} className="table-body_item"><Skeleton count={1} width={60} height={20} /></td>
                <td style={{textAlign: 'center'}} className="table-body_item"><Skeleton count={1} width={60} height={20} /></td>
                <td style={{textAlign: 'center'}} className="table-body_item"><Skeleton count={1} width={60} height={20} /></td>
                <td style={{textAlign: 'center'}} className="table-body_item"><Skeleton count={1} width={60} height={20} /></td>
                <td style={{textAlign: 'center'}} className="table-body_item"><Skeleton count={1} width={60} height={20} /></td>
                <td style={{textAlign: 'center'}} className="table-body_item"><Skeleton count={1} width={60} height={20} /></td>
                <td style={{textAlign: 'center'}} className="table-body_item"><Skeleton count={1} width={60} height={20} /></td>
                <td style={{textAlign: 'center'}} className="table-body_item"><Skeleton count={1} width={60} height={20} /></td>
            </tr>
            <tr>
                <td style={{textAlign: 'center'}} className="table-body_item"><Skeleton count={1} width={60} height={20} /></td>
                <td style={{textAlign: 'center'}} className="table-body_item"><Skeleton count={1} width={60} height={20} /></td>
                <td style={{textAlign: 'center'}} className="table-body_item"><Skeleton count={1} width={60} height={20} /></td>
                <td style={{textAlign: 'center'}} className="table-body_item"><Skeleton count={1} width={60} height={20} /></td>
                <td style={{textAlign: 'center'}} className="table-body_item"><Skeleton count={1} width={60} height={20} /></td>
                <td style={{textAlign: 'center'}} className="table-body_item"><Skeleton count={1} width={60} height={20} /></td>
                <td style={{textAlign: 'center'}} className="table-body_item"><Skeleton count={1} width={60} height={20} /></td>
                <td style={{textAlign: 'center'}} className="table-body_item"><Skeleton count={1} width={60} height={20} /></td>
                <td style={{textAlign: 'center'}} className="table-body_item"><Skeleton count={1} width={60} height={20} /></td>
            </tr>
            <tr>
                <td style={{textAlign: 'center'}} className="table-body_item"><Skeleton count={1} width={60} height={20} /></td>
                <td style={{textAlign: 'center'}} className="table-body_item"><Skeleton count={1} width={60} height={20} /></td>
                <td style={{textAlign: 'center'}} className="table-body_item"><Skeleton count={1} width={60} height={20} /></td>
                <td style={{textAlign: 'center'}} className="table-body_item"><Skeleton count={1} width={60} height={20} /></td>
                <td style={{textAlign: 'center'}} className="table-body_item"><Skeleton count={1} width={60} height={20} /></td>
                <td style={{textAlign: 'center'}} className="table-body_item"><Skeleton count={1} width={60} height={20} /></td>
                <td style={{textAlign: 'center'}} className="table-body_item"><Skeleton count={1} width={60} height={20} /></td>
                <td style={{textAlign: 'center'}} className="table-body_item"><Skeleton count={1} width={60} height={20} /></td>
                <td style={{textAlign: 'center'}} className="table-body_item"><Skeleton count={1} width={60} height={20} /></td>
            </tr>
            <tr>
                <td style={{textAlign: 'center'}} className="table-body_item"><Skeleton count={1} width={60} height={20} /></td>
                <td style={{textAlign: 'center'}} className="table-body_item"><Skeleton count={1} width={60} height={20} /></td>
                <td style={{textAlign: 'center'}} className="table-body_item"><Skeleton count={1} width={60} height={20} /></td>
                <td style={{textAlign: 'center'}} className="table-body_item"><Skeleton count={1} width={60} height={20} /></td>
                <td style={{textAlign: 'center'}} className="table-body_item"><Skeleton count={1} width={60} height={20} /></td>
                <td style={{textAlign: 'center'}} className="table-body_item"><Skeleton count={1} width={60} height={20} /></td>
                <td style={{textAlign: 'center'}} className="table-body_item"><Skeleton count={1} width={60} height={20} /></td>
                <td style={{textAlign: 'center'}} className="table-body_item"><Skeleton count={1} width={60} height={20} /></td>
                <td style={{textAlign: 'center'}} className="table-body_item"><Skeleton count={1} width={60} height={20} /></td>
            </tr>
        </tbody>
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
                height={120}
            />
        </div>
    );
}
