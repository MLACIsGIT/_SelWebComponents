export default function InputFieldSet(
  {
    errors, fieldValues, handleInputChange, handleInputBlur, type, name, labelText, required, reference, optionList
  }) {

  let labelArea;
  let input;
  let options;
  let divError;
  let divErrorClass = '';

  if (labelText !== undefined) {
    labelArea = <label htmlFor={name} className="form-label">{labelText}</label>
  }

  if (errors !== undefined) {
    divErrorClass = `mb-3 ${errors[name] !== '' ? "was-validated" : ""}`
    divError = <div className="invalid-feedback">
      {errors[name]}
    </div>
  }

  switch (type) {
    case "select":
      if (optionList !== undefined) {
        options = optionList.map(option => {
          return (<option key={`option-${option.value}`} value={option.value}>{option.text}</option>)
        });
      }

      input = <select class="form-select"
        className="form-select"
        id={name}
        name={name}
        value={fieldValues[name]}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        required={required}
        ref={reference}
      >
        {options}
      </select>
      break;

    case "textarea":
      input = <textarea
        className="form-control"
        id={name}
        name={name}
        value={fieldValues[name]}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        required={required}
        ref={reference}
      >
        {options}
      </textarea>
      break;

    case "checkbox":
      input = <input
        className="form-check-input"
        id={name}
        name={name}
        type={type}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        required={required}
        ref={reference}
        checked={(fieldValues[name])}
      >
        {options}
      </input>
      break;

    default:
      input = <input
        type={type}
        className="form-control"
        id={name}
        name={name}
        value={fieldValues[name]}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        required={required}
        ref={reference}
      />

      break;
  }

  if (type === 'checkbox') {
    return (
      <div className={divErrorClass}>
        {input}
        {labelArea}
        {divError}
      </div>
    );
  }

  return (
    <div className={divErrorClass}>
      {labelArea}
      {input}
      {divError}
    </div>
  );
}