import Contact from '../Models/Contact.model';
import fs from "fs";
import path from "path";

export default class FileStorage{

    private filePath: string = "../Data/data.json";

    public loadContacts(): Contact[] {
        try {
            if(!fs.existsSync(this.filePath)){
                throw new Error("Data.json file not found");
                return [];
            }

            let data:Contact[] = JSON.parse(fs.readFileSync(this.filePath, "utf-8"));
            return data;

        } 
        catch (error) {
            console.log("Error loading contacts: ", error);
            return [];
        }
    }

    public saveContacts(contacts: Contact[]): boolean{
        try {
            fs.writeFileSync(this.filePath, JSON.stringify(contacts, null , 2));
            return true;
        } 
        catch (error) {
            console.log("Error while saving contacts: ", error);
            return false;
        }
    }
};