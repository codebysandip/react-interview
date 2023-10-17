import { Button } from "@mui/material";
import { Suspense, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Navigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "src/core/hook";
import { AddPerson } from "../home/home.component";
import ProfileReducer, {
  fetchProfile,
  personLoaded as personLoadedAction,
  updatePersonLoadedStatus,
} from "./profile.redux";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function ProfilePage() {
  const params = useParams();
  const person = useAppSelector((state) => state.profile.person);
  const dispatch = useAppDispatch();
  const personLoaded = useAppSelector((state) => state.profile.personLoaded);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const navigate = useNavigate();

  const openAddPersonModal = () => {
    setOpenModal(true);
  };

  useEffect(() => {
    dispatch(fetchProfile(+params.id!));
    return () => {
      dispatch(personLoadedAction(undefined));
      dispatch(updatePersonLoadedStatus(false));
    };
  }, []);

  const onCloseModal = (result: boolean) => {
    // [TODO] handle success and error case
    if (person && result) {
      navigate("/");
    } else {
      setOpenModal(false);
    }
  };

  if (person) {
    return (
      <>
        <h1 className="text-lg font-bold mb-4">Person Detail</h1>
        <div>
          <strong>Id:</strong>
          <span className="ml-2">{person.id}</span>
        </div>
        <div>
          <strong>Name:</strong>
          <span className="ml-2">{person.name}</span>
        </div>
        <div>
          <strong>Age:</strong>
          <span className="ml-2">{person.age}</span>
        </div>
        <div className="mt-4">
          <Button color="primary" onClick={openAddPersonModal}>
            Edit Person
          </Button>
        </div>
        {openModal && (
          <Suspense>
            <AddPerson open={openModal} onClose={onCloseModal} />
          </Suspense>
        )}
      </>
    );
  } else if (personLoaded) {
    return <Navigate to="/" />;
  }
  return null;
}

export const reducer = {
  profile: ProfileReducer,
};
