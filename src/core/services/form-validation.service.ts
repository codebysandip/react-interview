import { ObjectSchema, ValidationError } from "yup";

export class FormValidation {
  private static error = new Map<string, string>();

  public static errorMapping: Record<string, string> = {
    required: "{labelText} is required",
    max: "{labelText} can't be more than {max} characters",
    min: "{labelText} can't be less than {min} characters",
    email: "Email is not valid",
    password:
      "Password length should be minimum 8 and must contain 1 small letter, 1 capital letter, 1 number and 1 special character(@$!%*#?&)",
    maxNum: "{labelText} can't be more than {max}",
    minNum: "{labelText} can't be less than {min}",
    invalidNum: "Number is not valid",
    invalidUrl: "Url of {labelText} is not valid",
    emailExist: "Email already exist",
  };

  public static message(mappedErrorMessage: string, labelText: string) {
    let errorMessage = "";
    errorMessage = this.setErrorMessageWithPlaceholder(mappedErrorMessage, labelText);
    return errorMessage;
  }

  public static validateForm(schema: ObjectSchema<any>, formValue: any) {
    const errorObj: Record<string, string> = {};
    try {
      schema.validateSync(formValue, { abortEarly: false });
    } catch (error: any) {
      if (error.inner && Array.isArray(error.inner)) {
        (error.inner as ValidationError[]).forEach((validationError: ValidationError) => {
          const path = validationError.path || "default";
          const fieldType = schema.fields[path].type;
          let errorType =
            validationError.type === "oneOf"
              ? (validationError?.errors[0] as unknown as { name: string }).name
              : validationError.type || "";
          if (errorObj[path]) {
            return;
          }
          if (
            (fieldType === "number" || (formValue[path] && !isNaN(formValue[path]))) &&
            (errorType === "max" || errorType === "min")
          ) {
            errorType = errorType === "max" ? "maxNum" : "minNum";
          }
          const mappedErrorMessage =
            this.getMappedErrorMessage(errorType, validationError.params || {}) || "";

          if (!mappedErrorMessage && formValue[path]) {
            console.error(
              `ValidationMessage: Error Mapping is not available with key: ${validationError.type}`,
            );
            return "";
          }
          errorObj[path] = mappedErrorMessage;
        });
      }
    }
    return errorObj;
  }

  private static setErrorMessageWithPlaceholder(
    errorMessage: string,
    labelText: string,
    replaceKey?: string,
  ) {
    const pattern = replaceKey ? new RegExp(`({${replaceKey}})`, "g") : /({labelText})/g;
    errorMessage = errorMessage.replace(pattern, labelText);
    return errorMessage;
  }

  private static getMappedErrorMessage(errorKey: string, params: Record<string, unknown>) {
    if (!this.error.keys.length) {
      Object.keys(this.errorMapping).forEach((key) => {
        this.error.set(key, this.errorMapping[key]);
      });
    }
    let mappedErrorMessage = this.error.get(errorKey) || "";
    Object.keys(params).forEach((key) => {
      if (typeof params[key] !== "object") {
        mappedErrorMessage = this.setErrorMessageWithPlaceholder(
          mappedErrorMessage,
          params[key] as string,
          key,
        );
      }
    });
    return mappedErrorMessage;
  }
}
