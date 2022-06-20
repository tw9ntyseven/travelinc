import React from 'react'
import './notification.css';

export const Notification = () => {
    return (
        <div className="container">
            <div className="rectangle">
                <div className="notification-text">
                    <i className="material-icons">info</i>
                    <span>&nbsp;&nbsp;This is a test notification.</span>
                </div>
            </div>
        </div>
    );
}