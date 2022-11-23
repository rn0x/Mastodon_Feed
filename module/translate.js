import fetch from 'node-fetch';
import Check_url from 'url-exist';

export default async function translate(word) {

    let translate = [
        'https://libretranslate.de',
        'https://translate.terraprint.co',
        'https://lt.vern.cc',
        'https://translate.argosopentech.com',
        'https://translate.fortytwo-it.com'
    ]

    for (let item of translate) {

        if (await Check_url(item)) {

            let response = await fetch(`${item}/translate`, {
                method: "POST",
                body: JSON.stringify({
                    q: word,
                    source: "auto",
                    target: "ar",
                }),
                headers: { "Content-Type": "application/json" }
            }).catch(e => console.log(e));
            let body = await response?.json();

            return body?.translatedText 

        }

    }

}