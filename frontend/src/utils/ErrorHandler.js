import toast from "react-hot-toast";

export default function handleError(err) {
  console.error(err);
  toast.error(err.error ? err.error.message : err.message);
}