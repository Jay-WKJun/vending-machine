import { useMemo } from "react";
import { useVendingMachineStateControllerContext } from "../vendingMachineStateController";

export function Display() {
  const { snapshot } = useVendingMachineStateControllerContext();
  const { inputNumber } = snapshot.context;

  const message = useMemo(() => {
    if (inputNumber) {
      return `선택하신 번호: ${String(inputNumber).padStart(2, "0")}`;
    }
    return "어서오세요!";
  }, [inputNumber]);

  return (
    <div className="flex flex-col justify-center items-center border-2 border-gray-300 rounded-md p-2 min-w-80">
      <span className="text-lg font-bold">{message}</span>
    </div>
  );
}
