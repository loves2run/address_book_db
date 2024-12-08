import validator from 'validator';

export const validateAddressData = (formData) => {
    const errors = [];
    
    // Validate first name
    if (!formData.firstName || !validator.isAlpha(formData.firstName)) {
        errors.push('First name is required and must contain only letters.');
    }

    // Validate last name
    if (!formData.lastName || !validator.isAlpha(formData.lastName)) {
        errors.push('Last name is required and must contain only letters.');
    }

    // Validate email
    if (!formData.email || !validator.isEmail(formData.email)) {
        errors.push('A valid email address is required.');
    }

    // Validate phone
    if (!formData.phone || !validator.isMobilePhone(formData.phone, 'en-US')) {
        errors.push('A valid phone number is required.');
    }

    // Validate zip code
    if (!formData.zipCode || !validator.isNumeric(formData.zipCode.toString())) {
        errors.push('Zip code must be numeric.');
    }

    // Process categories if they exist
    const category = formData.category
        ? formData.category.split(',').map(cat => cat.trim())
        : [];

    return {
        isValid: errors.length === 0,
        errors: errors.join(' '),
        processedData: {
            ...formData,
            category
        }
    };
}