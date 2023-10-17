import { Field, FormikErrors, FormikTouched } from "formik";
import { FormValidation } from "src/core/services/form-validation.service";

export function FormGroup(props: FormGroupProps) {
  const {
    type,
    name,
    labelText,
    className,
    formGroupClass,
    errors,
    touched,
    testIdPrefix,
    ...inputProps
  } = props;

  const getErrorMessage = () => {
    const message = FormValidation.message(errors[name] as string, labelText);
    return message;
  };
  const isError = !!(errors[name] && touched[name]);
  return (
    // <div className={`form-group ${formGroupClass || ""}`}>
    //   <label
    //     htmlFor="email"
    //     data-test-id={`${testIdPrefix ? testIdPrefix + "-" : ""}label-${name}`}
    //   >
    //     {labelText}
    //   </label>
    //   <Field
    //     type={type}
    //     name={name}
    //     className={`form-control ${className || ""}`}
    //     {...inputProps}
    //     data-test-id={`${testIdPrefix ? testIdPrefix + "-" : ""}input-${name}`}
    //   />
    // {errors[name] && touched[name] && (
    //   <div
    //     className="invalid-feedback"
    //     data-test-id={`${testIdPrefix ? testIdPrefix + "-" : ""}error-${name}`}
    //   >
    //     {getErrorMessage()}
    //   </div>
    // )}
    // </div>

    <div className="mb-8">
      <div className="relative h-10 w-full min-w-[200px]">
        <Field
          type={type}
          name={name}
          className={`${
            isError ? "border-red-500" : ""
          } peer h-full w-full rounded-[7px] border border-blue-gray-200 bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-pink-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50`}
          placeholder=" "
        />
        <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-pink-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-pink-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-pink-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
          {labelText}
        </label>
      </div>
      {isError && (
        <div
          className="invalid-feedback"
          data-test-id={`${testIdPrefix ? testIdPrefix + "-" : ""}error-${name}`}
        >
          {getErrorMessage()}
        </div>
      )}
    </div>
  );
}

export interface FormGroupProps extends Partial<HTMLInputElement> {
  type: "text" | "password" | "email" | "number" | "date";
  /** Schema key */
  name: string;
  /** Text for label of input labelText also used by ValidationMessage service to show error message */
  labelText: string;
  /** Class name for input element */
  className?: string;
  /** Css class for form-group dev */
  formGroupClass?: string;
  /** FormikErrors object */
  errors: FormikErrors<any>;
  /** FormikTouched object */
  touched: FormikTouched<any>;
  testIdPrefix?: string;
}
