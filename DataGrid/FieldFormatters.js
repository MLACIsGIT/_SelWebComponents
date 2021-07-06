export default class FieldFormatters {
  static dateFormatter(value, lang) {
    const dateValue = new Date(value);
    if (isNaN(dateValue.getDate())) {
      return "";
    }

    // if < 1990-01-01
    if (dateValue.getTime() < 631152000000) {
      return "";
    }

    let yearStr = dateValue.getFullYear().toString();
    let monthStr = ("0" + (dateValue.getMonth() + 1).toString()).substr(-2);
    let dayStr = ("0" + dateValue.getDate().toString()).substr(-2);
    switch (lang) {
      case "hu":
        return `${yearStr}.${monthStr}.${dayStr}`;

      case "en":
        return `${monthStr}.${dayStr}.${yearStr}`;

        default:
            return `${dayStr}.${monthStr}.${yearStr}`;
    }
  }
}
