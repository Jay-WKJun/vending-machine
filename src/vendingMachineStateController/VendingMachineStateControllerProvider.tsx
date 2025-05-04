import { createContext, useContext } from "react";
import { useMachine } from "@xstate/react";
import { vendingMachineStateController } from "./VendingMachineStateController";

const VendingMachineStateContext = createContext<ReturnType<
  typeof useMachine<typeof vendingMachineStateController>
> | null>(null);

export const VendingMachineStateProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const machine = useMachine(vendingMachineStateController);

  return (
    <VendingMachineStateContext.Provider value={machine}>
      {children}
    </VendingMachineStateContext.Provider>
  );
};

export const useVendingMachineStateControllerContext = () => {
  const machine = useContext(VendingMachineStateContext);
  if (!machine) throw new Error("VendingMachineStateProvider가 필요합니다");

  const [snapshot, send] = machine;
  return { snapshot, send };
};
