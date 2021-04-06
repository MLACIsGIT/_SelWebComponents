import crypto from 'crypto'

export default class Db {
    constructor(settings) {
        this.settings = settings;
    }

    getSalt() {
        return Math.floor(Math.random() * 8999999) + 1000000;
    }
    getPasswordHash(pass, salt) {
        let hash = crypto.createHash('sha512');
        let data = hash.update(`${pass}${salt}`, 'utf-8');
        let gen_hash = (data.digest('hex')).toUpperCase();

        return gen_hash;
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

        await fetch(this.settings.server.db, fetchParams)
            .then(data => {
                return data.json()
            }).then(jsonData => {
                if (jsonData.header.result === 'ok') {
                    let validUntil = jsonData.validUntil;
                    return ({
                        result: "ok",
                        requestId: jsonData.header.requestId,
                        token: jsonData.body.token,
                        validUntil: validUntil
                    })
                } else {
                    return {
                        result: 'login-failed'
                    }
                }
            })
    }
}