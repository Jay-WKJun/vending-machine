import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useVendingMachineStateControllerContext } from "@/vendingMachineStateController";
import { usePaymentExecutor } from "./usePaymentExecutor";
import {
  CashModule,
  type CashModuleRef,
  paymentId as cashPaymentId,
} from "./CashModule";
import {
  CardModule,
  type CardModuleRef,
  paymentId as cardPaymentId,
} from "./CardModule";

type PaymentModule = typeof cashPaymentId | typeof cardPaymentId;

interface PaymentModuleProps {
  className?: string;
}

export function PaymentModule({ className }: PaymentModuleProps) {
  const cashModuleRef = useRef<CashModuleRef>(null);
  const cardModuleRef = useRef<CardModuleRef>(null);
  const [paymentsReadyStateMap, setPaymentsReadyStateMap] = useState<
    Record<PaymentModule, boolean>
  >({
    cash: false,
    card: false,
  });

  const payments = useMemo(
    () => [
      {
        isPaymentReady: paymentsReadyStateMap.card,
        paymentModuleRef: cardModuleRef,
      },
      {
        isPaymentReady: paymentsReadyStateMap.cash,
        paymentModuleRef: cashModuleRef,
      },
    ],
    [paymentsReadyStateMap]
  );

  usePaymentExecutor(payments);

  const { snapshot, send } = useVendingMachineStateControllerContext();

  useEffect(() => {
    const readyPayment = payments.find(({ isPaymentReady }) => isPaymentReady);
    const isPaymentReady = Boolean(readyPayment);

    send({
      type: "SET_PAYMENTS_INFO",
      isPaymentReady,
      paymentInitializers: payments.map(
        ({ paymentModuleRef }) =>
          () =>
            paymentModuleRef.current?.init()
      ),
    });

    // 결제 준비가 됐다면 자동 결제 시도
    if (isPaymentReady) send({ type: "PAYMENT_START" });
  }, [payments, send]);

  const handleCashInput = useCallback(
    (totalCashAmount: number) => {
      const selectedProductInfo = snapshot.context.selectedProductInfo;
      const isCashReady = selectedProductInfo
        ? totalCashAmount >= selectedProductInfo.price
        : false;

      setPaymentsReadyStateMap((prev) => ({
        ...prev,
        cash: isCashReady,
      }));
    },
    [snapshot.context.selectedProductInfo]
  );

  const handleCardReady = useCallback((isCardReady: boolean) => {
    setPaymentsReadyStateMap((prev) => ({
      ...prev,
      card: isCardReady,
    }));
  }, []);

  return (
    <div className={className}>
      <div className="flex gap-8">
        <CashModule ref={cashModuleRef} onCashInput={handleCashInput} />

        <CardModule ref={cardModuleRef} onCardReady={handleCardReady} />
      </div>
    </div>
  );
}
