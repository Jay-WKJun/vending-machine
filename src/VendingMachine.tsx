import { ProductNumberInput } from "./components/ProductNumberInput";
import { Display } from "./components/Display";
import { PaymentModule } from "./components/PaymentModule";

export function VendingMachine() {
  return (
    <div className="flex flex-col justify-center items-center gap-8">
      <h1 className="text-2xl font-bold">자판기</h1>

      <div className="flex gap-8">
        <Display />

        <ProductNumberInput />
      </div>

      <PaymentModule />

      <div className="flex flex-col justify-center items-center border-2 border-gray-300 rounded-md p-2 min-w-80 min-h-15 text-lg font-bold">
        상품 나오는 곳
      </div>
    </div>
  );
}
