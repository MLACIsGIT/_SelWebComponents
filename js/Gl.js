export function IsNull(MyText, ValueWhenNull = "") {
    if (MyText === null || MyText === undefined) {
        return ValueWhenNull;
    }

    return MyText;
}

export function REPLACE_ALL(str, toFind, ReplaceWith) {
    return str.split(toFind).join(ReplaceWith);
}

export function COOKIES_GET() {
    let OUT = IsNull(document.cookie, '');

    if (OUT === '') {
        return JSON.parse('{}');
    }

    OUT = document.cookie.split(";").map(c => c.split('='));
    OUT = JSON.stringify(OUT);
    OUT = REPLACE_ALL(OUT, '[" ', '["')
    OUT = REPLACE_ALL(OUT, '\",\"', '\": \"')
    OUT = REPLACE_ALL(OUT, '],[', ", ")
    OUT = REPLACE_ALL(OUT, '[[', '{');
    OUT = REPLACE_ALL(OUT, ']]', '}');
    OUT = JSON.parse(OUT);

    return OUT;
}

export function COOKIES_SET(key, value) {
    key = IsNull(key, '').trim();
    value = IsNull(value, '').trim();

    if (key === '') {
        return
    }

    document.cookie = `${key}=${value}; expires=${new Date(2050, 0, 1).toUTCString()};path=/`;
}

export function COOKIES_REMOVE(key) {
    key = IsNull(key, '').trim;

    if (key > '') {
        document.cookie = `${key}=''; expires=` + new Date(2001, 0, 1).toUTCString();
    }
}

export function CRYPTO_SHA512(Str) {
    return crypto.subtle.digest("SHA-512", new TextEncoder("utf-8").encode(Str)).then(buf => {
        return (Array.prototype.map.call(new Uint8Array(buf), x => (('00' + x.toString(16)).slice(-2))).join('')).toUpperCase();
    });
}

export function CLIPBOARD_COPY(Text_from_ElementID) {
    let copyText = document.getElementById(Text_from_ElementID);

    /* Select the text field */
    copyText.select();
    copyText.setSelectionRange(0, 99999); /*For mobile devices*/

    /* Copy the text inside the text field */
    document.execCommand("copy");
}

export function LANG_GET_FormItem(langElements, key, lang) {
    let element = langElements?.["form-items"]?.[key]?.[lang];
    return ((element === undefined) ? `###_${key}` : element)
}

export function isValidEmail(mail) 
{
 return (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail))
}
