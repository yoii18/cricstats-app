import * as cheerio from 'cheerio';
import { getFullName } from '../utils/nameFinderHelpers'

async function fullNameParser(req: any, res: any){
    const playerName = req.body.playerName.split(' ').join('');
    const parsedName = await getFullName(playerName);
    res.json({
        name: parsedName
    });
}

export { fullNameParser };