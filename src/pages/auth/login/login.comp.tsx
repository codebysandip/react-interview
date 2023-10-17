import { Button } from "@mui/material";
import { Form, Formik } from "formik";
import { useEffect } from "react";
import { connect } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { LS_PASSWORD, LS_USERNAME, ROUTE_LOGIN } from "src/const";
import { FormGroup } from "src/core/components/form/FormGroup";
import { FormValidation } from "src/core/services/form-validation.service";
import { AppDispatch, RootState } from "src/redux/create-store";
import { object, string } from "yup";
import { LoginPayload } from "../auth.model";
import { login } from "../auth.redux";

function loginPage({ isLoggedIn, login, errorMessage }: LoginProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const username = searchParams.get("initialUsername") || "";
  const password = searchParams.get("initialPassword") || "";
  username && localStorage.setItem(LS_USERNAME, username);
  password && localStorage.setItem(LS_PASSWORD, password);

  const loginSchema = object().shape({
    username: string().required(),
    password: string().required(),
  });

  const navigateToHomeIfLoggedIn = () => {
    if (isLoggedIn) {
      navigate("/");
    }
  };

  useEffect(() => {
    navigateToHomeIfLoggedIn();

    if (username && password) {
      navigate(ROUTE_LOGIN, { replace: true });
    }
  }, []);

  useEffect(() => {
    navigateToHomeIfLoggedIn();
  }, [isLoggedIn]);

  return (
    <div className="w-full flex justify-center">
      <div className="w-[480px]" data-test-id="login-page">
        <h1 className="text-lg font-bold my-4">Login</h1>
        {errorMessage && (
          <h3 className="invalid-feedback" data-test-id="login-error-message">
            {errorMessage}
          </h3>
        )}
        <Formik
          className="flex"
          validationSchema={loginSchema}
          initialValues={{
            username: localStorage.getItem(LS_USERNAME) || "",
            password: localStorage.getItem(LS_PASSWORD) || "",
          }}
          onSubmit={(data) => login(data)}
          // FormValidation.validateForm sets error message for FormGroup component
          // this line is required to use FormGroup component
          validate={(values) => FormValidation.validateForm(loginSchema, values)}
        >
          {({ errors, touched }) => {
            return (
              <Form className="w-50">
                <FormGroup
                  name="username"
                  type="text"
                  errors={errors}
                  touched={touched}
                  labelText="Username"
                  testIdPrefix="login"
                />
                <FormGroup
                  name="password"
                  type="password"
                  errors={errors}
                  touched={touched}
                  labelText="Password"
                  testIdPrefix="login"
                />
                <Button type="submit" color="primary" data-test-id="login-btn">
                  Login
                </Button>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
}

export interface LoginProps
  extends ReturnType<typeof mapDispatchToProps>,
    ReturnType<typeof mapStateToProps> {}

const mapStateToProps = (state: RootState) => {
  return {
    isLoggedIn: state.auth.isLoggedIn,
    errorMessage: state.auth.login.errorMessage,
  };
};
const mapDispatchToProps = (dispatch: AppDispatch) => {
  return {
    login: (payload: LoginPayload) => dispatch(login(payload)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(loginPage);
