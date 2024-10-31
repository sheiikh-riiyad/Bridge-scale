import FormData from "../Components/FormData";
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Header from "../Components/Header";

function RouteData() {
  const navigate = useNavigate();
  return (
    <>
      <Header />
      <div
        style={{
          minHeight: "83.9vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <FormData />
        {/* <button
          
          onClick={() => navigate("/")}
        >
          Go Back
        </button> */}

        <Button className="mt-2 mb-2" variant="outline-primary" onClick={() => navigate("/")} >CANCEL</Button>
      </div>
      
    </>
  );
}

export default RouteData;
