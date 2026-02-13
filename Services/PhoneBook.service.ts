import Contact from '../Models/Contact.model'; 
import Sanitize from '../Utils/Sanitize.util';
import PaginatedResponse from '../Utils/PaginatedResponse.util';
import FileStorage from '../Storage/FileStorage.Storage';



class PhoneBookService{
    private contacts!: Contact[];
    private idCount:number = 0;
    private sanitizer: Sanitize = new Sanitize();
    private fileStorageObject: FileStorage = new FileStorage();


    constructor(){
        this.contacts = this.fileStorageObject.loadContacts();
        const maxId = this.contacts.length > 0 ? Math.max(...this.contacts.map(c => c.id)) : 0;
        this.idCount = maxId;
    }

    addContact(countryCode:string, phoneNo: string, firstName:string, lastName?:string, email?:string): boolean{
        try {
            let sanitizedPhoneNo:string = this.sanitizer.sanitizePhoneNo(phoneNo);
            for(let contact of this.contacts){
                if(contact.phoneNo === sanitizedPhoneNo){
                    throw new Error(`Contact with phoneNo:${phoneNo} already exists`);
                }
            }

            this.idCount++;
            let id:number = this.idCount;
            let sanitizedCountryCode:string = this.sanitizer.sanitizeCountryCode(countryCode);
            let santiziedEmail:string | undefined; 
            if(email !== undefined){
               santiziedEmail = this.sanitizer.sanitizeEmail(email); 
            }
        
            let santiziedFirstName:string = this.sanitizer.sanitizeName(firstName); 
            let santiziedLastName:string | undefined; 
            if(lastName !== undefined){
               santiziedLastName = this.sanitizer.sanitizeName(lastName);  
            }
            let createdAt:Date = new Date();

            let contact:Contact = {id:id, phoneNo:sanitizedPhoneNo, countryCode:sanitizedCountryCode, firstName:santiziedFirstName, lastName:santiziedLastName, email:santiziedEmail, createdAt:createdAt}; 
            
            this.contacts.push(contact);
            if(this.fileStorageObject.saveContacts(this.contacts) === false){
                throw new Error("Data cannot be added problem with data.json");
            }
            return true;
        } 
        catch (error) {
            console.log("Error while adding new contact, error:", error);
            return false;
        }
    }

    public fetchContacts(page:number, offset:number):object{
        try {
            let startIndex:number = (page-1) * offset;
            let endIndex:number = startIndex + offset;
     

            let data = this.contacts.slice(startIndex, endIndex);
            let previous = -1;
            let next = -1;
            let totalPages = Math.ceil(this.contacts.length / offset);
            if(page > 1){
                page = page-1;
            }
            if(page < totalPages){
                next = page+1;
            }

            let result:PaginatedResponse = {
                data: data, 
                next:next, 
                previous:previous
            };
            return result

        } 
        catch (error) {
            console.log("Error fetching contacts, error:", error);
            let result:PaginatedResponse = {
                data: [],
                previous: null,
                next: null
            };
            return result
        }
    }

    updatePhoneNo(id:number, countryCode:string, phoneNo:string): boolean{
        try {
            let sanitizedPhoneNo:string = this.sanitizer.sanitizePhoneNo(phoneNo);
            let sanitizedCountryCode:string = this.sanitizer.sanitizeCountryCode(countryCode);
            let didUpdate:boolean = false;
            for(let contact of this.contacts){
                if(contact.id === id){
                    contact.phoneNo = sanitizedPhoneNo;
                    contact.countryCode = sanitizedCountryCode;
                    contact.updatedAt = new Date();
                    didUpdate = true;
                    break;
                }
            }
            if(!didUpdate){
                throw new Error(`Contact with id:${id} not found, no updates performed`);
            }
            if(this.fileStorageObject.saveContacts(this.contacts) === false){
                throw new Error("Data cannot be added problem with data.json");
            }
            return true;
        } 
        catch (error) {
            console.log("Error while updating contact, error:", error);
            return false;
        }
    }

    updateFirstName(id:number, firstName:string): boolean{
        try {
            let sanitizedFirstName:string = this.sanitizer.sanitizeName(firstName);
            let didUpdate:boolean = false;
            for(let contact of this.contacts){
                if(contact.id === id){
                    contact.firstName = sanitizedFirstName;
                    contact.updatedAt = new Date();
                    didUpdate = true;
                    break;
                }
            }
            if(!didUpdate){
                throw new Error(`Contact with id:${id} not found, no updates performed`);
            }
            if(this.fileStorageObject.saveContacts(this.contacts) === false){
                throw new Error("Data cannot be added problem with data.json");
            }
            return true;
        } 
        catch (error) {
            console.log("Error while updating contact, error:", error);
            return false;
        }
    }

    updateLastName(id:number, lastName:string): boolean{
        try {
            let sanitizedLastName:string = this.sanitizer.sanitizeName(lastName);
            let didUpdate:boolean = false;
            for(let contact of this.contacts){
                if(contact.id === id){
                    contact.lastName = sanitizedLastName;
                    contact.updatedAt = new Date();
                    didUpdate = true;
                    break;
                }
            }
            if(!didUpdate){
                throw new Error(`Contact with id:${id} not found, no updates performed`);
            }
            if(this.fileStorageObject.saveContacts(this.contacts) === false){
                throw new Error("Data cannot be added problem with data.json");
            }
            return true;
        } 
        catch (error) {
            console.log("Error while updating contact, error:", error);
            return false;
        }
    }


    deleteContact(id:number): boolean{
        try {
            let index:number = -1;
            for(let i=0;i<this.contacts.length;i++){
                if(this.contacts[i].id === id){
                    index = i;
                    break;
                }
            }

            if(index > -1){
                this.contacts.splice(index, 1);
            }
            else{
                throw new Error(`Contact with  id:${id} does not exists`);
            }
            if(this.fileStorageObject.saveContacts(this.contacts) === false){
                throw new Error("Data cannot be added problem with data.json");
            }
            return true;
        } 
        catch (error) {
            console.log("Error while deleting contact, error:", error);
            return false;
        }
    }

    searchContactByName(name: string): Contact | undefined{
        try {
            let sanitizedName:string = this.sanitizer.sanitizeName(name);
            let contactDetails:Contact | undefined;
            for(let contact of this.contacts){
                if(contact.firstName.includes(sanitizedName)){
                    contactDetails = contact;
                    break;
                }
            }

            if(contactDetails === undefined){
                throw new Error(`Contact with  name:${name} does not exists`);
            }

            return contactDetails;
        } 
        catch (error) {
            console.log("Error while searching contact, error:", error);
            return undefined;
        }
    }

    searchContactById(id: number): Contact | undefined{
        try {
            let contactDetails:Contact | undefined;
            for(let contact of this.contacts){
                if(contact.id === id){
                    contactDetails = contact;
                    break;
                }
            }

            if(contactDetails === undefined){
                throw new Error(`Contact with  id:${id} does not exists`);
            }
            return contactDetails;
        } 
        catch (error) {
            console.log("Error while searching contact, error:", error);
            return undefined;
        }
    }

    searchContactByPhoneNo(phoneNo: string): Contact | undefined{
        try {
            let sanitizedPhoneNo:string = this.sanitizer.sanitizePhoneNo(phoneNo);
            let contactDetails:Contact | undefined;
            for(let contact of this.contacts){
                if(contact.phoneNo === sanitizedPhoneNo){
                    contactDetails = contact;
                    break;
                }
            }

            if(contactDetails === undefined){
                throw new Error(`Contact with  phoneNo:${phoneNo} does not exists`);
            }
            return contactDetails;
        } 
        catch (error) {
            console.log("Error while searching contact, error:", error);
            return undefined;
        }
    }
};
