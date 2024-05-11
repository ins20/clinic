import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import api from "../axios";
import { Patient } from "../types";
import PatientUpdate from "../components/PatientUpdate";
import DeletePatient from "../components/DeletePatient";
import Records from "../components/Records";

const PatientPage = () => {
  const { id: patient_id } = useParams();
  const patient = useQuery({
    queryKey: ["patient", patient_id],
    queryFn: () =>
      api.get<Patient>(`patient/get`, {
        params: {
          patient_id,
        },
      }),
  });

  return (
    <div>
      {patient_id && <DeletePatient patient_id={patient_id} />}
      {patient.data && (
        <>
          <PatientUpdate initialValues={patient.data.data} />
          <Records patient_id={patient.data.data.id} />
        </>
      )}
    </div>
  );
};

export default PatientPage;
