import React from 'react'
import './notification.css';

export const Notification = () => {
    return (
        <div class="container">
            <div class="rectangle">
                <div class="notification-text">
                    <i class="material-icons">info</i>
                    <span>&nbsp;&nbsp;This is a test notification.</span>
                </div>
            </div>
        </div>
    );
}