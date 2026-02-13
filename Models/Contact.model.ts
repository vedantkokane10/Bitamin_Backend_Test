export default interface Contact{
    id: number;
    phoneNo: string;
    countryCode: string;
    firstName: string;
    lastName?: string;
    email?: string;
    createdAt: Date;
    updatedAt?: Date;
};
