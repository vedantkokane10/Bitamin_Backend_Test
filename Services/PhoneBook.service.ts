import type Contact from '../Models/Contact.model';
import Sanitize from '../Utils/Sanitize.util.ts';
import type PaginatedResponse from '../Utils/PaginatedResponse.util.ts';
import FileStorage from '../Storage/FileStorage.Storage.ts';
import {ValidationError, NotFoundError, ConflictError} from '../Utils/Errors.util.ts';


export default class PhoneBookService{
    private contacts!: Contact[];
    private idCount:number = 0;
    private sanitizer: Sanitize = new Sanitize();
    private fileStorageObject: FileStorage = new FileStorage();


    constructor(){
        this.contacts = this.fileStorageObject.loadContacts();
        const maxId = this.contacts.length > 0 ? Math.max(...this.contacts.map(c => c.id)) : 0;
        this.idCount = maxId;
    }

    addContact(countryCode:string, phoneNo: string, firstName:string, lastName:string, email:string): Contact | undefined{
        let sanitizedPhoneNo:string = this.sanitizer.sanitizePhoneNo(phoneNo);
        for(let contact of this.contacts){
            if(contact.phoneNo === sanitizedPhoneNo){
                throw new ConflictError(`Contact with phoneNo:${phoneNo} already exists`);
            }
        }

        this.idCount++;
        let id:number = this.idCount;
        let sanitizedCountryCode:string = this.sanitizer.sanitizeCountryCode(countryCode);
        let santiziedEmail:string | undefined; 
        if(email !== ""){
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
        return contact;
       
    }

    public fetchContacts(page:number, offset:number):PaginatedResponse{
        if (page <= 0 || offset <= 0) {
            throw new ValidationError("Invalid pagination parameters");
        }
        let startIndex:number = (page-1) * offset;
        let endIndex:number = startIndex + offset;
    
        
        let data = this.contacts.slice(startIndex, endIndex);
        let previous = -1;
        let next = -1;
        let totalPages = Math.ceil(this.contacts.length / offset);

        if(page > 1){
            previous = page-1;
        }
        if(page < totalPages){
            next = page+1;
        }

        let result:PaginatedResponse = {
            data, 
            next:next, 
            previous:previous
        };
        return result

    }

    updatePhoneNo(id:number, countryCode:string, phoneNo:string): void{
        let didUpdate:boolean = false;
        for(let contact of this.contacts){
            if(contact.id === id){
                let sanitizedPhoneNo:string = this.sanitizer.sanitizePhoneNo(phoneNo);
                let sanitizedCountryCode:string = this.sanitizer.sanitizeCountryCode(countryCode);
                contact.phoneNo = sanitizedPhoneNo;
                contact.countryCode = sanitizedCountryCode;
                contact.updatedAt = new Date();
                didUpdate = true;
                break;
            }
        }
        if(!didUpdate){
            throw new NotFoundError(`Contact with id:${id} not found, no updates performed`);
        }
        if(this.fileStorageObject.saveContacts(this.contacts) === false){
            throw new Error("Data cannot be added problem with data.json");
        }
    }

    updateFirstName(id:number, firstName:string): void{
        let didUpdate:boolean = false;
        for(let contact of this.contacts){
            if(contact.id === id){
                let sanitizedFirstName:string = this.sanitizer.sanitizeName(firstName);
                contact.firstName = sanitizedFirstName;
                contact.updatedAt = new Date();
                didUpdate = true;
                break;
            }
        }
        if(!didUpdate){
            throw new NotFoundError(`Contact with id:${id} not found, no updates performed`);
        }
        if(this.fileStorageObject.saveContacts(this.contacts) === false){
            throw new Error("Data cannot be added problem with data.json");
        }
    }

    updateLastName(id:number, lastName:string): void {
        let didUpdate:boolean = false;
        for(let contact of this.contacts){
            if(contact.id === id){
                let sanitizedLastName:string = this.sanitizer.sanitizeName(lastName);
                contact.lastName = sanitizedLastName;
                contact.updatedAt = new Date();
                didUpdate = true;
                break;
            }
        }
        if(!didUpdate){
            throw new NotFoundError(`Contact with id:${id} not found, no updates performed`);
        }
        if(this.fileStorageObject.saveContacts(this.contacts) === false){
            throw new Error("Data cannot be added problem with data.json");
        } 
    }

    updateEmail(id:number, email:string): void{
        let didUpdate:boolean = false;
        for(let contact of this.contacts){
            if(contact.id === id){
                let sanitizedEmail:string = this.sanitizer.sanitizeEmail(email);
                contact.email = sanitizedEmail;
                contact.updatedAt = new Date();
                didUpdate = true;
                break;
            }
        }
        if(!didUpdate){
            throw new NotFoundError(`Contact with id:${id} not found, no updates performed`);
        }
        if(this.fileStorageObject.saveContacts(this.contacts) === false){
            throw new Error("Data cannot be added problem with data.json");
        }
    }


    deleteContact(id:number): void{
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
            throw new NotFoundError(`Contact with  id:${id} does not exists`);
        }
        if(this.fileStorageObject.saveContacts(this.contacts) === false){
            throw new Error("Data cannot be added problem with data.json");
        }
       
    }

    searchContactByName(name: string): Contact[]{
        let sanitizedName:string = this.sanitizer.sanitizeName(name);
        let contactDetails:Contact[] = [];
        for(let contact of this.contacts){
            if(contact.firstName.includes(sanitizedName) || contact.lastName?.includes(sanitizedName)){
                contactDetails.push(contact);
            }
        }

        if(contactDetails.length === 0){
            throw new NotFoundError(`Contact with  name:${name} does not exists`);
        }

        return contactDetails;
        
    }

    searchContactById(id: number): Contact {
        let contactDetails:Contact | undefined;
        for(let contact of this.contacts){
            if(contact.id === id){
                contactDetails = contact;
                break;
            }
        }

        if(contactDetails === undefined){
            throw new NotFoundError(`Contact with  id:${id} does not exists`);
        }
        return contactDetails;
    }

    searchContactByPhoneNo(phoneNo: string): Contact{
        let sanitizedPhoneNo:string = this.sanitizer.sanitizePhoneNo(phoneNo);
        let contactDetails:Contact | undefined;
        for(let contact of this.contacts){
            if(contact.phoneNo === sanitizedPhoneNo){
                contactDetails = contact;
                break;
            }
        }

        if(contactDetails === undefined){
            throw new NotFoundError(`Contact with  phoneNo:${phoneNo} does not exists`);
        }
        return contactDetails;
    }
};
