import { Id, TypeOptions, toast } from "react-toastify";

export function updateToast(
  toUpdateToast: Id,
  message: string,
  type: TypeOptions
) {
  toast.update(toUpdateToast, {
    render: message,
    type,
    isLoading: false,
    autoClose: 5000,
  });
}
