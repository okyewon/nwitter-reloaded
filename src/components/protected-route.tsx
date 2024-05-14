import { Navigate } from "react-router-dom";
import { auth } from "../firebase";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = auth.currentUser;
  console.log(auth);
  if (user === null) {
    return <Navigate to="/login" />;
  }
  return children;
}
