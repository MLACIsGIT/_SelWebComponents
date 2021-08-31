import crypto from "crypto";

export default class Db {
  getSalt() {
    //return Math.floor(Math.random() * 8999999) + 1000000;
    const cDate = new Date();
    const yearStr = `${cDate.getUTCFullYear()}`;
    const monthStr = `0${cDate.getUTCMonth() + 1}`.substr(-2);
    const dateStr = `0${cDate.getUTCDate()}`.substr(-2);
    const hoursStr = `0${cDate.getUTCHours()}`.substr(-2);
    const minutesStr = `0${cDate.getUTCMinutes()}`.substr(-2);

    return yearStr + monthStr + dateStr + hoursStr + minutesStr;
  }

  getPasswordHash(pass, salt) {
    let cryptoPasswordHash = crypto.createHash("sha512");
    let passwordHashData = cryptoPasswordHash.update(pass, "utf-8");
    let passwordHash = passwordHashData.digest("hex").toUpperCase();

    let saltedHash;

    if (salt === "") {
      saltedHash = passwordHash;
    } else {
      let cryptoSaltedHash = crypto.createHash("sha512");
      let saltedHashData = cryptoSaltedHash.update(
        `${passwordHash}${salt}`,
        "utf-8"
      );
      saltedHash = saltedHashData.digest("hex").toUpperCase();
    }

    return saltedHash;
  }

  async login(email, pass) {
    let salt = this.getSalt();
    let passwordHash = this.getPasswordHash(pass, salt);

    let fetchParams = {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        header: {
          function: "login",
          token: "#",
        },
        body: {
          portalOwnerId: process.env.REACT_APP_PORTAL_OWNER_ID,
          email: email,
          passwordHash: passwordHash,
          salt: salt,
        },
      }),
    };

    try {
      let fetchData = await fetch(
        process.env.REACT_APP_API_BASE_URL,
        fetchParams
      );
      let jsonData = await fetchData.json();

      if (jsonData.header.result === "ok") {
        return {
          result: "ok",
          requestId: jsonData.header.requestId,
          token: jsonData.body.token,
          userLevel: jsonData.body.userLevel,
          validUntil:
            new Date(jsonData.body.validUntil) -
            new Date(jsonData.body.currentUTC),
          PasswordUpdateRequired: jsonData.body.passwordUpdateRequired,
        };
      } else {
        return {
          result: "nok",
        };
      }
    } catch (error) {
      console.log(error);
      return {
        result: "no-response",
        error: error,
      };
    }
  }

  async extendTokenValidity(currentToken) {
    let fetchParams = {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        header: {
          function: "extendTokenValidity",
          token: currentToken,
        },
        body: {
          portalOwnerId: process.env.REACT_APP_PORTAL_OWNER_ID,
        },
      }),
    };

    try {
      let fetchData = await fetch(
        process.env.REACT_APP_API_BASE_URL,
        fetchParams
      );
      let jsonData = await fetchData.json();

      if (jsonData.header.result === "ok") {
        return {
          result: "ok",
          requestId: jsonData.header.requestId,
          token: jsonData.body.token,
          validUntil:
            new Date(jsonData.body.validUntil) -
            new Date(jsonData.body.currentUTC),
        };
      } else {
        return {
          result: "nok",
        };
      }
    } catch (error) {
      console.log(error);
      return {
        result: "no-response",
        error: error,
      };
    }
  }

  async changePassword(currentToken, newPassword) {
    let newPasswordHash = this.getPasswordHash(newPassword, "");

    let fetchParams = {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        header: {
          function: "changePassword",
          token: currentToken,
        },
        body: {
          portalOwnerId: process.env.REACT_APP_PORTAL_OWNER_ID,
          newPassword_hash: newPasswordHash,
          newPassword_updateRequired: false,
        },
      }),
    };

    try {
      let fetchData = await fetch(
        process.env.REACT_APP_API_BASE_URL,
        fetchParams
      );
      let jsonData = await fetchData.json();

      if (jsonData.header.result === "ok") {
        return {
          result: "ok",
          requestId: jsonData.header.requestId,
          token: jsonData.body.token,
          validUntil:
            new Date(jsonData.body.validUntil) -
            new Date(jsonData.body.currentUTC),
        };
      } else {
        return {
          result: "nok",
        };
      }
    } catch (error) {
      console.log(error);
      return {
        result: "no-response",
        error: error,
      };
    }
  }
}
