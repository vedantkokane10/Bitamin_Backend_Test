import type Contact from '../Models/Contact.model.ts';
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class FileStorage{

    
    private filePath = path.join(__dirname, "../Data/data.json");


    public loadContacts(): Contact[] {
        try {
            if (!fs.existsSync(this.filePath)) {
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