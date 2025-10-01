import { useState, useEffect } from 'react';
import {
    Autocomplete,
    TextField,
    Chip
} from '@mui/material';
import { useCategoryContext } from '../../context/CategoryContext';

interface CategorySelectorProps {
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
    error?: boolean;
    helperText?: string;
    disabled?: boolean;
    label?: string;
}

function CategorySelector({
    value,
    onChange,
    required = false,
    error = false,
    helperText = '',
    disabled = false,
    label = 'Category'
}: CategorySelectorProps) {
    const { categories } = useCategoryContext();
    const [inputValue, setInputValue] = useState('');

    // Sync inputValue with value prop
    useEffect(() => {
        setInputValue(value || '');
    }, [value]);

    const handleChange = (_, newValue: string | null) => {
        const finalValue = newValue || '';
        onChange(finalValue);
    };

    const handleInputChange = (_, newInputValue: string, reason: string) => {
        setInputValue(newInputValue);

        // When user types and then blurs (clicks away), we want to keep the typed value
        if (reason === 'input') {
            onChange(newInputValue);
        }
    };

    const handleBlur = () => {
        // Ensure the current inputValue becomes the actual value when user clicks away
        if (inputValue !== value) {
            onChange(inputValue);
        }
    };

    return (
        <Autocomplete
            value={value || null}
            onChange={handleChange}
            inputValue={inputValue}
            onInputChange={handleInputChange}
            options={categories}
            freeSolo
            disabled={disabled}
            clearOnBlur={false} // Don't clear on blur - let user keep typed value
            selectOnFocus
            handleHomeEndKeys
            renderTags={(tagValue, getTagProps) =>
                tagValue.map((option, index) => (
                    <Chip
                        label={option}
                        {...getTagProps({ index })}
                        key={option}
                    />
                ))
            }
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    required={required}
                    error={error}
                    helperText={helperText}
                    placeholder="Select existing or type new category"
                    onBlur={handleBlur}
                />
            )}
            renderOption={(props, option) => (
                <li {...props} key={option}>
                    {option}
                </li>
            )}
            noOptionsText="Type to create new category"
        />
    );
}

export default CategorySelector;