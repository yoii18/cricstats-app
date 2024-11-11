import axios from 'axios';
import * as cheerio from 'cheerio';

async function getGoogleRes(playerName: string) {
    const url: string = `https://www.google.com/search?q=${encodeURIComponent(playerName)}%20cricinfo`;
    const data = await axios.get(url);
    return data;
}

function extractActualUrl(googleUrl: string): string {
    const match = googleUrl.match(/\/url\?q=([^&]+)/);
    if (match && match[1]) {
        return decodeURIComponent(match[1]);
    }
    throw new Error("Unable to extract actual URL");
}

async function getHTML(url: string){
    const response = await axios.get(url);
    return response;
}


async function getFullName(playerName: string) {
    try {
        const googleResponse = await getGoogleRes(playerName);
        const $ = cheerio.load(googleResponse.data);        
        const link = $('.kCrYT a[href*="/"]').attr('href');
        if (!link) {
            throw new Error("Cricinfo link not found");
        }
        const cricinfoURL = extractActualUrl(link);
        const cricinfoResponse = await getHTML(cricinfoURL);
        const $cricinfoResponse = cheerio.load(cricinfoResponse.data);
        const nameElement = $cricinfoResponse('span.ds-text-title-s.ds-font-bold.ds-text-typo');
        const fullName = nameElement.find('p').first().text().trim();
        const nameParts = fullName.split(' ');
        const initials = nameParts.slice(0, -1).map(name => name[0]).join('');
        const lastName = nameParts[nameParts.length - 1];
        const parsedName = `${initials} ${lastName}`;

        return parsedName;
    } catch (error) {
        console.error("Error in getFullName:", error);
        throw error;
    }
}

export {getFullName};