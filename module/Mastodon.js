import fetch, { FormData, fileFromSync, File } from 'node-fetch';
import fs from 'fs-extra';
import { fileTypeFromBuffer, fileTypeFromFile } from 'file-type';



export default class Mastodon {

    /** 
     * @param {string} url عناوان منصة mastodon 
     * @param {string} token رمز المستخدم | token
     */

    constructor(url, token) {

        this.url = url
        this.token = token
    }

    /** 
     * إرفاق الوسائط بالمنشورات 
     * 
     * @param {string} buffer المخزن المؤقت للملف المراد إرفاقه
     * @return {Promise<object>} return json.
     */

    async Upload(buffer) {

        let formData = new FormData();
        let contentType = await fileTypeFromBuffer(buffer).catch(e => console.log(e))
        let file = new File([buffer], `fileName.${contentType?.ext}`, { type: contentType?.mime })

        formData.set('file', file);

        let response = await fetch(`${this.url}/api/v1/media`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + this.token,
            },
            body: formData,
        }).catch(e => console.log(e));
        let json = await response?.json().catch(e => console.log(e));

        if (json?.error) {

            return json?.error

        }

        else return json
    }


    /** 
     * كتابة منشور جديد او رد على منشور
     * 
     * @param {string} text المحتوى النصي (default: undefined)
     * @param {string  | Array} media_ids مصفوفة معرفات المرفقات التي سيتم إرفاقها كوسائط (default: undefined)
     * @param {string} in_reply_to_id معرف المنشور الذي يتم الرد عليه ، إذا كان المنشور عبارة عن رد (default: undefined)
     * @return {Promise<object>} return json.
     */

    async Publish(text = undefined, media_ids = undefined, in_reply_to_id = undefined) {

        let Parameters = {
            status: text,
            media_ids: media_ids ? Array.isArray(media_ids) ? media_ids : [media_ids] : undefined,
            in_reply_to_id: in_reply_to_id
        }
        let response = await fetch(`${this.url}/api/v1/statuses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.token,
            },
            body: JSON.stringify(Parameters),
        }).catch(e => console.log(e));
        let json = await response?.json().catch(e => console.log(e));

        if (json?.error) {

            return json?.error

        }

        else return json
    }

    /** 
     * قراءة وعرض الجداول الزمنية للمنشورات
     * 
     * @param {boolean} type إظهار المنشورات التي تحتوي على الوسائط المرفقة فقط ؟ (default: false)
     * @param {string} tag عرض المنشورات العامة التي تحتوي على الهاشتاج المحدد (default: undefined)
     * @param {object} callback return json.
     */

    async EventTag(only_media = false, tag = undefined, callback) {

        setInterval(async () => {

            let EventTag = fs.readJsonSync('./database/EventTag.json');
            let response = await fetch(`${this.url}/api/v1/timelines/${tag ? `tag/:${tag}` : 'public'}?only_media=${only_media}&limit=1&local=true`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.token,
                },
            }).catch(e => console.log(e));
            let json = await response?.json().catch(e => console.log(e));

            if (json?.error) {

                callback(json?.error)

            }

            else {

                if (Array.isArray(json)) {

                    if (EventTag?.includes(json?.[0]?.id) === false) {
                        callback(json?.[0]);
                        EventTag.push(json?.[0]?.id);
                        fs.writeJsonSync('./database/EventTag.json', EventTag);
                    }

                }

            }

        }, 6000);
    }

    /** 
     * حدث الإشعارات 
     * 
     * @param {"all" | "follow" | "favourite" | "reblog" | "mention" | "poll" | "follow_request"} type follow, favourite, reblog, mention, poll, follow_request, all (default: all)
     * @param {object} callback return json.
     */

    async Notifications(type = 'all', callback) {

        setInterval(async () => {

            let EventNotifications = fs.readJsonSync('./database/EventNotifications.json');
            let response = await fetch(`${this.url}/api/v1/notifications?limit=1`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.token,
                },
            }).catch(e => console.log(e));
            let json = await response?.json().catch(e => console.log(e));

            if (json?.error) {

                callback(json?.error)

            }

            else {

                if (Array.isArray(json)) {

                    if (EventNotifications?.includes(json?.[0]?.id) === false) {

                        if (json?.[0]?.type === type || type === 'all') {

                            callback(json?.[0]);
                            EventNotifications.push(json?.[0]?.id);
                            fs.writeJsonSync('./database/EventNotifications.json', EventNotifications);

                        }
                    }
                }

            }

        }, 6000);
    }

    /** 
     * إضافة منشور إلى قائمة المفضلة الخاصة بك.
     * 
     * @param {string} id Local ID of a posts.
     * @return {Promise<object>} return json.
     */

    async like(id) {

        let response = await fetch(`${this.url}/api/v1/statuses/${id}/favourite`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.token,
            },
        }).catch(e => console.log(e));
        let json = await response?.json().catch(e => console.log(e));

        if (json?.error) {

            return json?.error

        }

        else return json
    }
}