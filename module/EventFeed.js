import { read } from 'feed-reader'
import fs from 'fs-extra';
import metadata from 'html-metadata-parser';
import translate from './translate.js';
import googleTranslate from './googleTranslate.js';

export default async function EventFeed(callback) {

    while (true) {

        await new Promise(resolve => setTimeout(resolve, 500));
        
        let config = fs.readJSONSync('./config.json');
        let sentFeed = fs.readJSONSync('./json/sentFeed.json');

        for (let item of config?.urls) {

            let readFeed = await read(item).catch((e) => console.log(e?.toString() + '\n' + item));

            if (readFeed && sentFeed?.includes(readFeed?.entries?.[0]?.link) === false) {

                sentFeed.push(readFeed?.entries?.[0]?.link);
                fs.writeJSONSync('./json/sentFeed.json', sentFeed, { spaces: '\t' });

                let parser = await metadata.parser(readFeed?.entries?.[0]?.link);
                let image = parser?.og?.image || parser?.images?.filter((e) => e?.src.includes('logo') === false)[0]?.src;

                callback({
                    title: await googleTranslate(readFeed?.entries?.[0]?.title).catch(e => console.log(e)) || await translate(readFeed?.entries?.[0]?.title).catch((e) => console.log(e)),
                    description: await googleTranslate(readFeed?.entries?.[0]?.description).catch((e) => console.log(e)) || await translate(readFeed?.entries?.[0]?.description).catch((e) => console.log(e)),
                    image: image,
                    link: readFeed?.entries?.[0]?.link,
                    published: readFeed?.entries?.[0]?.published
                });

            }
        }
    }
}