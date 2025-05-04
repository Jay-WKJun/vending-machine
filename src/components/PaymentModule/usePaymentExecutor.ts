import { useEffect, RefObject } from "react";
import { useVendingMachineStateControllerContext } from "@/vendingMachineStateController";
import type { PaymentRef } from "./type";

export type Payment = {
  isPaymentReady: boolean;
  paymentModuleRef: RefObject<PaymentRef | null>;
};

export type Payments = Payment[];

export function usePaymentExecutor(payments: Payments) {
  const { snapshot, send } = useVendingMachineStateControllerContext();
  const vendingMachineState = snapshot.value;
  const selectedProductInfo = snapshot.context.selectedProductInfo;

  useEffect(() => {
    const isPayingState = vendingMachineState === "paying";
    const [readyPayment, ...otherReadyPayments] = payments.filter(
      ({ isPaymentReady }) => isPaymentReady
    );
    const otherPayments = payments
      .filter(({ isPaymentReady }) => !isPaymentReady)
      .concat(otherReadyPayments);

    if (!isPayingState || !selectedProductInfo || !readyPayment) return;

    async function startPayment() {
      // 나머지 결제 방법들 작동 잠금
      otherPayments.forEach(({ paymentModuleRef }) => {
        paymentModuleRef.current?.lock();
      });

      const payment = readyPayment.paymentModuleRef.current;
      const res = await payment!.startPayment(selectedProductInfo!.price);

      if (res) send({ type: "PAYMENT_SUCCESS" });
      else send({ type: "PAYMENT_FAIL", reason: "결제 실패" });
    }

    startPayment();
  }, [payments, selectedProductInfo, send, vendingMachineState]);
}
