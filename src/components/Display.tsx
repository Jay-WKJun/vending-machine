import { useMemo } from "react";
import { useVendingMachineStateControllerContext } from "../vendingMachineStateController";

export function Display() {
  const { snapshot } = useVendingMachineStateControllerContext();
  const { inputNumber, selectedProductInfo } = snapshot.context;

  const message = useMemo(() => {
    if (inputNumber != null) {
      const productInfo = selectedProductInfo
        ? `${selectedProductInfo?.name}\n${selectedProductInfo?.price}원`
        : "상품 없음";

      return `입력 번호: ${inputNumber}\n${productInfo}`;
    }
    return "어서오세요!";
  }, [inputNumber, selectedProductInfo]);

  return (
    <div className="flex flex-col justify-center items-center border-2 border-gray-300 rounded-md p-2 min-w-80">
      <span className="text-lg font-bold whitespace-pre-wrap text-center">
        {message}
      </span>
    </div>
  );
}
