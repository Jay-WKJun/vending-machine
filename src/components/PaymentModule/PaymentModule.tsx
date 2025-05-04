import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useVendingMachineStateControllerContext } from "../../vendingMachineStateController";
import { usePaymentExecutor } from "./usePaymentExecutor";
import { CashModule, type CashModuleRef } from "./CashModule";
import { CardModule, type CardModuleRef } from "./CardModule";

type PaymentModule = "cash" | "card";

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

  const { snapshot, send } = useVendingMachineStateControllerContext();

  usePaymentExecutor(
    useMemo(
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
    )
  );

  useEffect(() => {
    const isSomePaymentReady = Object.values(paymentsReadyStateMap).some(
      (isReady) => isReady
    );

    send({
      type: "SET_PAYMENT_READY_STATE",
      isPaymentReady: isSomePaymentReady,
    });

    // 결제 준비가 됐다면 자동 결제 시도
    if (isSomePaymentReady) send({ type: "PAYMENT_START" });
  }, [send, paymentsReadyStateMap]);

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
