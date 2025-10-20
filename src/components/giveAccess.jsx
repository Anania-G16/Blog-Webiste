import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
export default function (props) {
  const navigate = useNavigate();
  useEffect(() => {
    props.giveAccess(true);
    navigate("/view");
  }, [navigate, props]);
}
