import { useEffect, useRef } from "react";
import { useVendingMachineStateControllerContext } from "@/vendingMachineStateController";
import { minute } from "@/utils/time";

export function usePaymentWaitTimeout() {
  const timeoutIdRef = useRef<number | undefined>(undefined);
  const { snapshot, send } = useVendingMachineStateControllerContext();
  const vendingMachineState = snapshot.value;
  const { inputNumber } = snapshot.context;

  useEffect(() => {
    if (inputNumber == null || vendingMachineState !== "idle") {
      clearTimeout(timeoutIdRef.current);
      return;
    }

    timeoutIdRef.current = setTimeout(() => {
      send({ type: "PAYMENT_WAIT_TIMEOUT" });
    }, minute(3));

    return () => {
      clearTimeout(timeoutIdRef.current);
    };
  }, [send, inputNumber, vendingMachineState]);
}
