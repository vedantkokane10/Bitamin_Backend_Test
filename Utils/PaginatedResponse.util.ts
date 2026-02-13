import Contact from '../Models/Contact.model'; 

export default interface PaginatedResponse{
    data:Contact[] | [];
    previous:number | null;
    next:number | null;
};