import { useEffect, RefObject } from "react";
import { useVendingMachineStateControllerContext } from "../../vendingMachineStateController";

export type PaymentMethod = {
  isPaymentReady: boolean;
  paymentModuleRef: RefObject<{
    startPayment: (productPrice: number) => Promise<boolean>;
    lock: () => void;
    init: () => void;
  } | null>;
};

export type PaymentMethods = PaymentMethod[];

export function usePaymentExecutor(paymentMethods: PaymentMethods) {
  const { snapshot, send } = useVendingMachineStateControllerContext();
  const vendingMachineState = snapshot.value;
  const selectedProductInfo = snapshot.context.selectedProductInfo;

  useEffect(() => {
    const isPayingState = vendingMachineState.match("paying");
    const [readyPaymentMethod, ...otherReadyMethods] = paymentMethods.filter(
      ({ isPaymentReady }) => isPaymentReady
    );

    if (!isPayingState || !selectedProductInfo || !readyPaymentMethod) return;

    async function startPayment() {
      // 나머지 결제 방법들 작동 잠금
      paymentMethods
        .filter(({ isPaymentReady }) => !isPaymentReady)
        .concat(otherReadyMethods)
        .forEach(({ paymentModuleRef }) => {
          paymentModuleRef.current?.lock();
        });

      const paymentMethod = readyPaymentMethod.paymentModuleRef.current;
      const res = await paymentMethod!.startPayment(selectedProductInfo!.price);

      if (res) send({ type: "PAYMENT_SUCCESS" });
      else send({ type: "PAYMENT_FAIL", reason: "결제 실패" });
    }

    startPayment();
  }, [paymentMethods, selectedProductInfo, send, vendingMachineState]);
}
