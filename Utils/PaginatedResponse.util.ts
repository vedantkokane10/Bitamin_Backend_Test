import type Contact from '../Models/Contact.model';


export default interface PaginatedResponse{
    data:Contact[] | [];
    previous:number;
    next:number ;
};