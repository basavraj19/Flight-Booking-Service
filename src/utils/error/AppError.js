class AppError extends Error{
     constructor (message,statuscode)
     {
        super(message),
        this.statuscode =statuscode,
        this.explaintion=message
     }
}

module.exports=AppError;