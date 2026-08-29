import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import InputError from './InputError';

const SelectInput = forwardRef(function SelectInput(
    {
        name,
        id,
        value = '',
        label = '',
        error = '',
        icon: Icon = null,
        options = [],
        placeholder = 'Pilih opsi...',
        disabled = false,
        required = false,
        className = '',
        selectClassName = '',
        onChange,
        ...props
    },
    ref
) {
    const selectId = id || name;

    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label
                    htmlFor={selectId}
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

                <select
                    ref={ref}
                    name={name}
                    id={selectId}
                    value={value}
                    disabled={disabled}
                    required={required}
                    onChange={onChange}
                    className={`block w-full rounded-lg border text-sm transition-all duration-150 bg-white placeholder:text-slate-400 focus:outline-none appearance-none disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed ${
                        Icon ? 'pl-9' : 'pl-3.5'
                    } pr-10 py-2.5 ${
                        error
                            ? 'border-rose-300 text-rose-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-200'
                            : 'border-slate-300 text-slate-900 hover:border-slate-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100'
                    } ${selectClassName}`}
                    {...props}
                >
                    {placeholder && (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    )}
                    {options.map((option, idx) => {
                        if (typeof option === 'string') {
                            return (
                                <option key={idx} value={option}>
                                    {option}
                                </option>
                            );
                        }

                        const optValue = option.value ?? option.name ?? option.id;
                        const optLabel =
                            option.label ??
                            option.display_name ??
                            option.name ??
                            option.value;

                        return (
                            <option key={idx} value={optValue}>
                                {optLabel}
                            </option>
                        );
                    })}
                </select>

                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                    <ChevronDown className="h-4 w-4" />
                </div>
            </div>

            <InputError message={error} />
        </div>
    );
});

export default SelectInput;
