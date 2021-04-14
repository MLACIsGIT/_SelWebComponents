import crypto from 'crypto';

export default class Db {
    constructor(settings) {
        this.settings = settings;
    }

    getSalt() {
        //return Math.floor(Math.random() * 8999999) + 1000000;
        const cDate = new Date();
        const yearStr = `${cDate.getUTCFullYear()}`;
        const monthStr = (`0${cDate.getUTCMonth()}`).substr(-2);
        const dateStr = (`0${cDate.getUTCDate()}`).substr(-2);
        const hoursStr = (`0${cDate.getUTCHours()}`).substr(-2);
        const minutesStr = (`0${cDate.getUTCMinutes()}`).substr(-2);

        return (yearStr+monthStr+dateStr+hoursStr+minutesStr);
    }

    getPasswordHash(pass, salt) {
        let cryptoPasswordHash = crypto.createHash('sha512');
        let passwordHashData = cryptoPasswordHash.update(pass, 'utf-8');
        let passwordHash = (passwordHashData.digest('hex')).toUpperCase();

        let cryptoSaltedHash = crypto.createHash('sha512');
        let saltedHashData = cryptoSaltedHash.update(`${passwordHash}${salt}`, 'utf-8');
        let saltedHash = (saltedHashData.digest('hex')).toUpperCase();

        return saltedHash;
    }

    async login(email, pass) {
        let salt = this.getSalt();
        let passwordHash = this.getPasswordHash(pass, salt);

        let fetchParams = {
            'method': 'POST',
            'mode': 'cors',
            'cache': 'no-cache',
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': JSON.stringify({
                "header": {
                    "function": "login",
                    "token": "#"
                },
                "body": {
                    "portalOwnerId": this.settings.portalOwnerId,
                    "email": email,
                    "passwordHash": passwordHash,
                    "salt": salt
                }
            })
        };

        try {
            let fetchData = await fetch(this.settings.server.db, fetchParams);
            let jsonData = await fetchData.json();

            if (jsonData.header.result === 'ok') {
                return ({
                    result: "ok",
                    requestId: jsonData.header.requestId,
                    token: jsonData.body.token,
                    userLevel: jsonData.body.userLevel,
                    validUntil: (new Date(jsonData.body.validUntil)) - (new Date(jsonData.body.currentUTC))
                })
            } else {
                return {
                    result: 'nok'
                }
            }

        } catch (error) {
            console.log(error);
        }
    }
}
