import { Button } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Suspense, lazy, useEffect, useState } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router";
import { ROUTE_PROFILE } from "src/const";
import { useAppDispatch } from "src/core/hook";
import { RootState } from "src/redux/create-store";
import "./home.comp.scss";
import HomeReducer, { fetchPersons } from "./home.redux";

export const AddPerson = lazy(
  () => import(/* webpackChunkName: "add-person" */ "./components/add-person.comp"),
);

const Home = ({ persons }: HomeProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [openModal, setOpenModal] = useState<boolean>(false);

  useEffect(() => {
    dispatch(fetchPersons());
  }, []);

  const openAddPersonModal = () => {
    setOpenModal(true);
  };

  return (
    <>
      <div className="inline-flex flex-column w-full justify-between items-baseline">
        <h1 className="text-lg font-bold mb-8">Persons</h1>
        <Button color="primary" onClick={openAddPersonModal}>
          Add Person
        </Button>
      </div>
      <div className="flex" data-test-id="home-page">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 400 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Age</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {persons.map((person) => (
                <TableRow
                  key={person.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  className="cursor-pointer"
                  onClick={() => navigate(ROUTE_PROFILE.replace(":id", person.id.toString()))}
                  hover
                >
                  <TableCell component="th" scope="row">
                    {person.name}
                  </TableCell>
                  <TableCell>{person.age}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {openModal && (
        <Suspense>
          <AddPerson open={openModal} onClose={() => setOpenModal(false)} />
        </Suspense>
      )}
    </>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    persons: state.home.persons,
  };
};
export default connect(mapStateToProps, {})(Home);

export interface HomeProps extends ReturnType<typeof mapStateToProps> {}

export const reducer = {
  home: HomeReducer,
};
