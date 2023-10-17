import { Button, Dialog, DialogTitle } from "@mui/material";
import { Form, Formik } from "formik";
import { FormGroup } from "src/core/components/form/FormGroup";
import { useAppDispatch, useAppSelector } from "src/core/hook";
import { FormValidation } from "src/core/services/form-validation.service";
import { editPerson } from "src/pages/profile/profile.redux";
import { object, string } from "yup";
import { AddPersonPayload } from "../home.model";
import { savePerson } from "../home.redux";

export default function AddPerson({ open, onClose }: AddPersonProps) {
  const person = useAppSelector((state) => state.profile?.person);
  const addPersonSchema = object().shape({
    name: string().required(),
    // We can take number here depends on the requirement of UI
    age: string()
      .required()
      .matches(/^[0-9]+$/, { name: "invalidNum" }),
  });
  const dispatch = useAppDispatch();

  const addPerson = async (payload: AddPersonPayload) => {
    if (person) {
      await dispatch(editPerson({ ...payload, age: +payload.age, id: person.id }));
    } else {
      await dispatch(savePerson(payload));
    }
    onClose(true);
  };

  const handleClose = () => {
    onClose(false);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{person ? "Edit Person" : " Add Person"}</DialogTitle>
      <div className="w-[480px] mx-4 my-4">
        <Formik
          className="flex"
          validationSchema={addPersonSchema}
          initialValues={{
            name: person?.name || "",
            age: person?.age.toString() || "",
          }}
          onSubmit={(data) => addPerson(data)}
          // FormValidation.validateForm sets error message for FormGroup component
          // this line is required to use FormGroup component
          validate={(values) => FormValidation.validateForm(addPersonSchema, values)}
        >
          {({ errors, touched }) => {
            return (
              <Form className="w-50">
                <FormGroup
                  name="name"
                  type="text"
                  errors={errors}
                  touched={touched}
                  labelText="Name"
                  testIdPrefix="add-person"
                />
                <FormGroup
                  name="age"
                  type="text"
                  errors={errors}
                  touched={touched}
                  labelText="Age"
                  testIdPrefix="add-person"
                />
                <div className="flex">
                  <Button type="submit" color="primary" data-test-id="add-person-btn">
                    {person ? "Save Person" : "Add Person"}
                  </Button>

                  <Button color="secondary" onClick={handleClose} className="ml-4">
                    Cancel
                  </Button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </Dialog>
  );
}

export interface AddPersonProps {
  open: boolean;
  onClose: (result: boolean) => void;
}
