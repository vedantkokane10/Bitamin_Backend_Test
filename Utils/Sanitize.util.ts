import {ValidationError, NotFoundError, ConflictError} from './Errors.util.ts';


export default class Sanitize{
    sanitizeEmail(email: string): string{
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new ValidationError("Invalid email");
        }
        email = email.trim();
        email = email.toLowerCase();
        return email;
    }

    sanitizePhoneNo(phoneNo: string): string{
        if (!phoneNo) {
            throw new ValidationError("Phone number is required");
        }
        phoneNo = phoneNo.trim();
        phoneNo = phoneNo.replace(/\s+/g, "")
        phoneNo = phoneNo.replace(/-/g, "")
        if (phoneNo.length < 5) {
            throw new ValidationError("Invalid phone number");
        }
        return phoneNo;
       
    }

    sanitizeName(name: string): string{
        if(name === undefined){
            throw new ValidationError("Not a valid name");
        }
        name = name.trim();
        name = name.toLowerCase();
        return name;
        
    }

    sanitizeCountryCode(countryCode : string): string{
        if(countryCode === undefined){
            throw new ValidationError("Not a valid countryCode");
        }
        countryCode = countryCode.trim();
        return countryCode;
    }
};