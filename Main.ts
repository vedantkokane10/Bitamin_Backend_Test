import readline from "readline";
import PhoneBookService from "./Services/PhoneBook.service.ts";
import type PaginatedResponse from './Utils/PaginatedResponse.util.ts';
import {ValidationError, NotFoundError, ConflictError} from './Utils/Errors.util.ts';

let readLine = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function input(question: string): Promise<string> {
    return new Promise((resolve) => {
        readLine.question(question, (answer) => {
            resolve(answer);
        });
    });
}

class Main{
    private phoneBookService: PhoneBookService;

    constructor(){
        this.phoneBookService = new PhoneBookService();
    }

    async addContact(){
        try {
            const countryCode = await input("Country Code: ");
            const phoneNo = await input("Phone Number: ");
            const firstName = await input("First Name: ");
            const lastName = await input("Last Name (optional): ");
            const email = await input("Email (optional): ");
            this.phoneBookService.addContact(countryCode, phoneNo, firstName, lastName, email);
            console.log("Successfully Added new Contact");
        } 
        catch (error) {
            if(error instanceof ValidationError){
                console.log("Invalid input:", error.message);
            }
            else if(error instanceof ConflictError){
                console.log("Phone number already exists.");
            }
            else{
                console.log("Unexpected error:", error);
            }
        }
        
    }

    async fetchContacts(): Promise<void>{
        try {
            let page = 1;
            let offset = 5;
            while(true){
                let result:PaginatedResponse = this.phoneBookService.fetchContacts(page,offset);
                console.log(result.data);
                let statement = "Choose a option \n"
                if(result.next !== -1){
                    statement += "'next' for next page \n";
                }
                if(result.previous !== -1){
                    statement += "'previous' for previous page \n";
                }


                let choice;
                statement += "'exit' for ending fetch operation \n"
                choice = await input(`${statement} - `);
                
                
                if(choice === "next" && result.next !== -1){
                    page = result.next;
                }
                else if(choice === "previous" && result.previous !== -1){
                    page = result.previous;
                }
                else if(choice === "exit"){
                    return;
                }
            }
        } 
        catch (error) {
            if(error instanceof NotFoundError){
                console.log("No contacts found");
            }
            else{
                console.log("Unexpected error:", error);
            }
        }
        
    }


    async searchContact(): Promise<void>{
        let data:string = "";
        try {
            console.log("--------------------------------------------");
            console.log("1. Search Contact by Name");
            console.log("2. Search Contact by Id");
            console.log("3. Search Contact by PhoneNo");
            console.log("--------------------------------------------");

            const choice = await input("Choose a option - ");
            
            if(choice === "1"){
                const name = await input("Enter name - ");
                data += `name:${name}`
                console.log(this.phoneBookService.searchContactByName(name));
            }
            else if(choice === "2"){
                const id = await input("Enter id - ");
                data += `id:${id}`
                console.log(this.phoneBookService.searchContactById(parseInt(id)));
            }
            else if(choice === "3"){
                const phoneNo = await input("Enter PhoneNo - ");
                data += `phoneNo:${phoneNo}`
                console.log(this.phoneBookService.searchContactByPhoneNo(phoneNo));
            }
            else{
                console.log("You entered a wrong choice");
            }
        } 
        catch (error) {
            if(error instanceof NotFoundError){
                console.log(`Contact with given ${data} does not exists`);
            }
            else if(error instanceof ValidationError){
                console.log("Invalid input:", error.message);
            }
            else{
                console.log("Unexpected error:", error);
            }
        }
        
    }

    async deleteContact(): Promise<void>{
        let data:string = "";
        try {
            const id = await input("Enter id - ");
            data += `id:${id}`
            this.phoneBookService.deleteContact(parseInt(id));
            console.log(`Contact with id:${id} deleted successfully`);
        } 
        catch (error) {
            if(error instanceof NotFoundError){
                console.log(`Contact with given ${data} does not exists`);
            }
            else{
                console.log("Unexpected error:", error);
            }
        }
        
    }

    async updateContact():Promise<void>{
        let data:string = "";
        try {
            console.log("--------------------------------------------");
            console.log("1. Update Contact's PhoneNo");
            console.log("2. Update Contact's Email");
            console.log("3. Update Contact's Firstname");
            console.log("4. Update Contact's LastName");
            console.log("--------------------------------------------");

            const choice = await input("Choose a option - ");

            if(choice === "1"){
                const id = await input("Enter id - ");
                const countryCode = await input("Enter countryCode - ");
                const phoneNo = await input("Enter phoneNo - ");
                data += `id:${id}`
                this.phoneBookService.updatePhoneNo(parseInt(id), countryCode, phoneNo);
            }
            else if(choice === "2"){
                const id = await input("Enter id - ");
                const email = await input("Enter Email - ");
                data += `id:${id}`
                this.phoneBookService.updateEmail(parseInt(id), email);
            }
            else if(choice === "3"){
                const id = await input("Enter id - ");
                const firstName = await input("Enter firstName - ");
                data += `id:${id}`
                this.phoneBookService.updateFirstName(parseInt(id), firstName);
            }
            else if(choice === "4"){
                const id = await input("Enter id - ");
                const lastName = await input("Enter lastName - ");
                data += `id:${id}`
                this.phoneBookService.updateLastName(parseInt(id), lastName);
            }
            else{
                console.log("You entered a wrong choice");
                return;
            }
            console.log("Updated Contact Successfully");
        } 
        catch (error) {
            if(error instanceof NotFoundError){
                console.log(`Contact with given ${data} does not exists`);
            }
            else if(error instanceof ValidationError){
                console.log("Invalid input:", error.message);
            }
            else{
                console.log("Unexpected error:", error);
            }
        }
        
    }

    async execute():Promise<void>{
        while(true){
            console.log("--------------------------------------------");
            console.log("1. Add Contact");
            console.log("2. Fetch Contacts");
            console.log("3. Search Contact");
            console.log("4. Delete Contact");
            console.log("5. Update Contact");
            console.log("6. Exit");
            console.log("--------------------------------------------");

            const choice = await input("Choose a option - ");

            if(choice === "1"){
                await this.addContact();
            }
            else if(choice === "2"){
                await this.fetchContacts();
            }
            else if(choice === "3"){
                await this.searchContact();
            }
            else if(choice === "4"){
                await this.deleteContact();
            }
            else if(choice === "5"){
                await this.updateContact();
            }
            else if(choice === "6"){
                console.log("Exiting...")
                return;
            }
            else{
                console.log("You entered a wrong choice");
            }
        }
        
    }


}

const obj = new Main();
obj.execute();