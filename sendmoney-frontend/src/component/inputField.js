

function InputField(props) {

  return (
    <div >
        <div>
          <label className="label" htmlFor={props.htmlFor}>{props.label}</label>
          <input
            className="inputField"
            id={props.id}
            type={props.type}
            value={props.value}
            onChange={props.onChange}
            min='0'
            required
          />
        </div>
    </div>
  );
}

export default InputField;
