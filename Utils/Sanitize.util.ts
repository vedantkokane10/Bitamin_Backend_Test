class Sanitize{
    sanitizeEmail(email: string): string | undefined{
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
            return undefined;
        }
    }

    sanitizePhoneNo(phoneNo: string): string[] | undefined{
        try {
            phoneNo = phoneNo.trim();
            let tempPhoneNo = phoneNo.split(' ');
            if(tempPhoneNo[1].length != 10){
                throw new Error("PhoneNo's length is not 10, so not a valid number");
            }
            let result:string[] = [];
            result.push(tempPhoneNo[0]);
            result.push(tempPhoneNo[1]);
            return result;
        }
        catch (error) {
            console.log("Error while sanitizing phoneNo, error:", error);
            return undefined;
        }
    }

    sanitizeName(name: string): string | undefined{
        try {
            if(name === undefined){
                throw new Error("Not a valid name");
            }
            name = name.trim();
            return name;
        }
        catch (error) {
            console.log("Error while sanitizing name, error:", error);
            return undefined;
        }
    }
};