
const { AppError } = require("../utils");

const {StatusCodes} =require('http-status-codes');

class CrudRepository {
    constructor(model) {
        this.model = model
    }
    async create(data) {
        const respones = await this.model.create(data);
        return respones;
    }
    async delete(id)
    {
        const respones =await this.model.destroy({
            where :{
                id :id
            }
        })
        if(!respones)
        {
            throw new AppError("Resouce not found",StatusCodes.NOT_FOUND);
        }
        return respones;
    }
    async getAll()
    {
        const respones =await this.model.findAll();
        if(!respones)
        {
            throw new AppError("Resouce not found",StatusCodes.NOT_FOUND);
        }
        return respones;
    }

    async get(id)
    {
        const respones =await this.model.findByPk(id);
        if(!respones)
        {
            throw new AppError("Resouce not found",StatusCodes.NOT_FOUND);
        }
        return respones;
    }
    async update(id, data)
    {
        const respone =await this.model.update(data,{
            where :{
                id :id
            }
        })
       if(!respone)
       {
           throw new AppError("Resouce not found",StatusCodes.NOT_FOUND);
       }
       return respone;
    }
}

module.exports = CrudRepository;