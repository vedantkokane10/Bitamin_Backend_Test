class ValidationError extends Error{
    constructor(message: string){
        super(message);
        this.name = "ValidationError";
    }
}

class NotFoundError extends Error{
    constructor(message: string){
        super(message);
        this.name = "NotFoundError";
    }
}

class ConflictError extends Error{
    constructor(message: string){
        super(message);
        this.name = "ConflictError";
    }
}

export {ValidationError, NotFoundError, ConflictError};