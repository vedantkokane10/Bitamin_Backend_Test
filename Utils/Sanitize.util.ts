export default class Sanitize{
    sanitizeEmail(email: string): string{
        try {
            if(!email.includes("@") || !email.includes(".com")){
                throw new Error("Not a valid email");
            }
            email = email.trim();
            email = email.toLowerCase();
            return email;
        }
        catch (error) {
            console.log("Error while sanitizing email, error:", error);
            return "";
        }
    }

    sanitizePhoneNo(phoneNo: string): string{
        try {
            phoneNo = phoneNo.trim();
            phoneNo = phoneNo.replace(/\s+/g, "")
            phoneNo = phoneNo.replace(/-/g, "")
            return phoneNo;
        }
        catch (error) {
            console.log("Error while sanitizing phoneNo, error:", error);
            return "";
        }
    }

    sanitizeName(name: string): string{
        try {
            if(name === undefined){
                throw new Error("Not a valid name");
            }
            name = name.trim();
            name = name.toLowerCase();
            return name;
        }
        catch (error) {
            console.log("Error while sanitizing name, error:", error);
            return "";
        }
    }

    sanitizeCountryCode(countryCode : string): string{
        try {
            if(countryCode === undefined){
                throw new Error("Not a valid countrycode");
            }
            countryCode = countryCode.trim();
            return countryCode;
        }
        catch (error) {
            console.log("Error while sanitizing countrycode, error:", error);
            return "";
        }
    }
};