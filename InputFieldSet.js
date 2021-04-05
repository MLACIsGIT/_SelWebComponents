export default function InputFieldSet(
  {
    errors, fieldValues, handleInputChange, handleInputBlur, type, name, labelText, required, reference, optionList
  }) {

  let input;
  let options;

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
      <div className={`mb-3 ${errors[name] !== '' ? "was-validated" : ""}`}>
        {input}
        <label htmlFor={name} className="form-label">{labelText}</label>
        <div className="invalid-feedback">
          {errors[name]}
        </div>
      </div>
    );
  }

  return (
    <div className={`mb-3 ${errors[name] !== '' ? "was-validated" : ""}`}>
      <label htmlFor={name} className="form-label">{labelText}</label>
      {input}
      <div className="invalid-feedback">
        {errors[name]}
      </div>
    </div>
  );
}