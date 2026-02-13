interface Contact{
    id: number;
    phoneNo: number;
    firstName: string | undefined;
    lastName?: string | undefined;
    email?: string | undefined;
    createdAt: Date;
    updatedAt?: Date;
};
