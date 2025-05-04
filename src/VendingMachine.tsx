import { ProductNumberInput } from "./components/ProductNumberInput";
import { Display } from "./components/Display";
import { PaymentModule } from "./components/PaymentModule";
import { ProductDispenser } from "./components/ProductDispenser";
import { usePaymentWaitTimeout } from "./hooks/usePaymentWaitTimeout";

export function VendingMachine() {
  usePaymentWaitTimeout();

  return (
    <div className="flex flex-col justify-center items-center gap-8">
      <h1 className="text-2xl font-bold">자판기</h1>

      <div className="flex gap-8">
        <Display />

        <ProductNumberInput />
      </div>

      <PaymentModule />

      <ProductDispenser />
    </div>
  );
}
