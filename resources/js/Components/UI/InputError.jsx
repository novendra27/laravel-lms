import React from 'react';

export default function InputError({ message, className = '', ...props }) {
    if (!message) return null;

    return (
        <p
            {...props}
            role="alert"
            className={`mt-1.5 text-xs font-medium text-rose-600 animate-fadeIn ${className}`}
        >
            {message}
        </p>
    );
}
