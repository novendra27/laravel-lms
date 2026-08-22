import React, { forwardRef } from 'react';
import InputError from './InputError';

const TextInput = forwardRef(function TextInput(
    {
        type = 'text',
        name,
        id,
        value = '',
        placeholder = '',
        label = '',
        error = '',
        icon: Icon = null,
        rightElement = null,
        disabled = false,
        required = false,
        className = '',
        inputClassName = '',
        onChange,
        ...props
    },
    ref
) {
    const inputId = id || name;

    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
                >
                    {label} {required && <span className="text-rose-500">*</span>}
                </label>
            )}

            <div className="relative rounded-lg shadow-sm">
                {Icon && (
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Icon className="h-4 w-4 text-slate-400" aria-hidden="true" />
                    </div>
                )}

                <input
                    ref={ref}
                    type={type}
                    name={name}
                    id={inputId}
                    value={value}
                    placeholder={placeholder}
                    disabled={disabled}
                    required={required}
                    onChange={onChange}
                    className={`block w-full rounded-lg border text-sm transition-all duration-150 bg-white placeholder:text-slate-400 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed ${
                        Icon ? 'pl-9' : 'pl-3.5'
                    } ${rightElement ? 'pr-10' : 'pr-3.5'} py-2.5 ${
                        error
                            ? 'border-rose-300 text-rose-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-200'
                            : 'border-slate-300 text-slate-900 hover:border-slate-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100'
                    } ${inputClassName}`}
                    {...props}
                />

                {rightElement && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        {rightElement}
                    </div>
                )}
            </div>

            <InputError message={error} />
        </div>
    );
});

export default TextInput;
