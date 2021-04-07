import crypto from 'crypto'

export default class Db {
    constructor(settings) {
        this.settings = settings;
    }

    getSalt() {
        return Math.floor(Math.random() * 8999999) + 1000000;
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
                let serverCurrentUTC = jsonData.body.currentUTC;
                let serverValidUntil = jsonData.body.validUntil;
                return ({
                    result: "ok",
                    requestId: jsonData.header.requestId,
                    token: jsonData.body.token,
                    validUntil: this.getValidUntilFromStrDates(serverCurrentUTC, serverValidUntil)
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

    getValidUntilFromStrDates(strServerCurrentUTC, strServerValidUntil) {
        let serverCurrentUTC = new Date(strServerCurrentUTC);
        let serverValidUntil = new Date(strServerValidUntil);
        let currentDate = new Date();
        let minutes = Math.floor((serverValidUntil - serverCurrentUTC) / 60000) - 1;

        return currentDate.setMinutes(currentDate.getMinutes() + minutes)
    }
}
