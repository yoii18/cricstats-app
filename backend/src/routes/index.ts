import express from "express";
import dataRouter from "./data";

const rootRouter = express.Router()

rootRouter.use('/data', dataRouter)

export default rootRouter;