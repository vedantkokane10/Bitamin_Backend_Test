export default interface Contact{
    id: number;
    phoneNo: string;
    countryCode: string;
    firstName: string | undefined;
    lastName?: string | undefined;
    email?: string | undefined;
    createdAt: Date;
    updatedAt?: Date;
};
