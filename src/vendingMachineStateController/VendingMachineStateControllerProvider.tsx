import { assign } from "xstate";
import { createContext, useContext } from "react";
import { useMachine } from "@xstate/react";
import { vendingMachineStateController } from "./VendingMachineStateController";
import { productShelfController } from "../services/ProductShelfController";

const VendingMachineStateContext = createContext<ReturnType<
  typeof useMachine<typeof vendingMachineStateController>
> | null>(null);

export const VendingMachineStateProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const machine = useMachine(
    vendingMachineStateController.provide({
      actions: {
        setProductInfo: assign(({ context }) => {
          const selectedProductInfo = productShelfController.getProductInfo(
            context.inputNumber
          );
          return { selectedProductInfo };
        }),
      },
    })
  );

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
