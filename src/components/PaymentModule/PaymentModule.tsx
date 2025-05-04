import { useRef } from "react";
import { useVendingMachineStateControllerContext } from "../../vendingMachineStateController";
import { CashModule, type CashModuleRef } from "./CashModule";
import { CardModule, type CardModuleRef } from "./CardModule";

interface PaymentModuleProps {
  className?: string;
}

export function PaymentModule({ className }: PaymentModuleProps) {
  const cashModuleRef = useRef<CashModuleRef>(null);
  const cardModuleRef = useRef<CardModuleRef>(null);

  const { snapshot, send } = useVendingMachineStateControllerContext();

  return (
    <div className={className}>
      <div className="flex gap-8">
        <CashModule ref={cashModuleRef} />

        <CardModule ref={cardModuleRef} />
      </div>
    </div>
  );
}
