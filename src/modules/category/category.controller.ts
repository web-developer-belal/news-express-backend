import { Request, Response } from "express";
import categoryService from "./category.service";

const create = async (req:Request,res:Response)=>{
    const {name , isActive} = req.body;
    const category =await categoryService.create({name,isActive});
    return res.status(200).json({'message':'category created', data: category});
}
const index = async (req:Request,res:Response)=>{
    const categories =await categoryService.index();
    return res.status(200).json({'message':'categories retrieved', data: categories});
}

const update = async (req:Request,res:Response)=>{
    const {id} = req.params;
    const {name , isActive} = req.body;
    const category =await categoryService.update(id,{name,isActive});
    return res.status(200).json({'message':'category updated', data: category});
}
const destroy = async (req:Request,res:Response)=>{
    const {id} = req.params;
    const category =await categoryService.destroy(id);
    return res.status(200).json({'message':'category deleted', data: category});
}


export const CategoryController = {
    index,
    create,
    update,
    destroy
}