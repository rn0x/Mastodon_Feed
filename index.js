import fetch from 'node-fetch';
import fs from 'fs-extra';
import EventFeed from './module/EventFeed.js';
import Mastodon from './module/Mastodon.js';

console.log('Starting Mastodon Feed');

let config = fs.readJSONSync('./config.json');
let client = new Mastodon(config?.mastodon_server, config?.token);

await EventFeed(async e => {

    let title = e?.title;
    let description = e?.description;
    let link = e?.link;
    let published = e?.published;
    let text = `${title}\n\n\n`
    text += `${description}\n\n`
    text += link

    if (title && description && link && published && e?.image) {

        let res = await fetch(e?.image).catch(e => console.log(e));
        let buffer = Buffer.from(await res?.arrayBuffer());
        let up = await client.Upload(buffer).catch(e => console.log(e));

        if (up?.id) {
            await client.Publish(text, up?.id).catch(e => console.log(e));
        }

    }

    else if (e?.image === undefined) {
        await client.Publish(text).catch(e => console.log(e));
    }

});
