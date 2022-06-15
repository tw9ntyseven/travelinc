import React from 'react'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export const LoadingSkeletonTable = ({items}) => {
    return (
        <tbody>
           {items.map((item, index) => (
            <tr key={index}>
                <td style={{textAlign: 'center'}} className="table-body_item"><Skeleton count={1} width={60} height={20} /></td>
                <td 
                style={{width: '100%', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'space-around'}} 
                className="table-body_item"><Skeleton count={1} borderRadius={100} width={30} height={30} /><Skeleton count={1} width={90} height={20} /></td>
                <td style={{textAlign: 'center'}} className="table-body_item"><Skeleton count={1} width={60} height={20} /></td>
                <td style={{textAlign: 'center'}} className="table-body_item"><Skeleton count={1} width={60} height={20} /></td>
                <td style={{textAlign: 'center'}} className="table-body_item"><Skeleton count={1} width={60} height={20} /></td>
                <td style={{textAlign: 'center'}} className="table-body_item"><Skeleton count={1} width={60} height={20} /></td>
                <td style={{textAlign: 'center'}} className="table-body_item"><Skeleton count={1} width={60} height={20} /></td>
                <td style={{textAlign: 'center'}} className="table-body_item"><Skeleton count={1} width={60} height={20} /></td>
                <td style={{textAlign: 'center'}} className="table-body_item"><Skeleton count={1} width={60} height={20} /></td>
            </tr>
           ))}
        </tbody>
    );
}

export const LoadingSkeletonTableOrders = ({items}) => {
    return (
        <tbody>
           {items.map((item, index) => (
            <tr key={index}>
                <td style={{textAlign: 'center'}} className="table-body_item"><Skeleton count={1} width={90} height={20} /></td>
                <td style={{textAlign: 'center'}} className="table-body_item"><Skeleton count={1} width={80} height={40} /></td>
                <td style={{textAlign: 'center'}} className="table-body_item"><Skeleton count={1} width={60} height={20} /></td>
                <td 
                style={{width: '100%', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'space-around'}} 
                className="table-body_item"><Skeleton count={1} borderRadius={100} width={30} height={30} /><Skeleton count={1} width={90} height={20} /></td>
                <td style={{textAlign: 'center'}} className="table-body_item"><Skeleton count={1} width={60} height={20} /></td>
                <td style={{textAlign: 'center'}} className="table-body_item"><Skeleton count={1} width={60} height={20} /></td>
            </tr>
           ))}
        </tbody>
    );
}
export const LoadingSkeletonTableFinances = ({items}) => {
    return (
        <tbody>
           {items.map((item, index) => (
            <tr key={index}>
                <td style={{textAlign: 'center'}} className="table-body_item"><Skeleton count={1} width={100} height={20} /></td>
                <td style={{textAlign: 'center'}} className="table-body_item"><Skeleton count={1} width={60} height={20} /></td>
                <td style={{textAlign: 'center'}} className="table-body_item"><Skeleton count={1} width={60} height={20} /></td>
                <td style={{textAlign: 'center'}} className="table-body_item"><Skeleton count={1} width={60} height={20} /></td>
                <td style={{textAlign: 'center'}} className="table-body_item"><Skeleton count={1} width={60} height={20} /></td>
                <td style={{textAlign: 'center'}} className="table-body_item"><Skeleton count={1} width={60} height={20} /></td>
                <td style={{textAlign: 'center'}} className="table-body_item"><Skeleton count={1} width={60} height={20} /></td>
                <td style={{textAlign: 'center', marginRight: '20px'}} className="table-body_item"><Skeleton count={1} width={80} height={40} /></td>
            </tr>
           ))}
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
