import express from 'express';
import { fullNameParser } from '../controllers/nameFind';

const dataRouter = express.Router();

dataRouter.get('/test', (req: any, res: any) => {
    res.json({
        msg: "test"
    })
})

dataRouter.post("/playerName", fullNameParser)

export default dataRouter;
