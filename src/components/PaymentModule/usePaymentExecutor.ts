import { useEffect, RefObject } from "react";
import { useVendingMachineStateControllerContext } from "../../vendingMachineStateController";

export type PaymentMethod = {
  isPaymentReady: boolean;
  paymentModuleRef: RefObject<{
    startPayment: (productPrice: number) => Promise<boolean>;
    init: () => void;
  } | null>;
};

export type PaymentMethods = PaymentMethod[];

export function usePaymentExecutor(paymentMethods: PaymentMethods) {
  const { snapshot, send } = useVendingMachineStateControllerContext();
  const vendingMachineState = snapshot.value;
  const selectedProductInfo = snapshot.context.selectedProductInfo;
  const isDone = vendingMachineState.match("done");

  useEffect(() => {
    const isPayingState = vendingMachineState.match("paying");
    const paymentMethod = paymentMethods.find(
      ({ isPaymentReady }) => isPaymentReady
    )?.paymentModuleRef.current;

    if (!isPayingState || !selectedProductInfo || !paymentMethod) return;

    async function startPayment() {
      const res = await paymentMethod.startPayment(selectedProductInfo.price);

      if (res) send({ type: "PAYMENT_SUCCESS" });
      else send({ type: "PAYMENT_FAIL", reason: "결제 실패" });
    }

    startPayment();
  }, [paymentMethods, selectedProductInfo, send, vendingMachineState]);

  useEffect(() => {
    if (!isDone) return;

    paymentMethods.forEach((paymentMethod) => {
      paymentMethod.paymentModuleRef.current?.init();
    });
  }, [isDone, paymentMethods]);
}
