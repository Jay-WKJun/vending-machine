import { useMemo } from "react";
import { useVendingMachineStateControllerContext } from "@/vendingMachineStateController";

export function Display() {
  const { snapshot } = useVendingMachineStateControllerContext();
  const vendingMachineState = snapshot.value;
  const { inputNumber, selectedProductInfo, errorMessage } = snapshot.context;

  const isError = vendingMachineState === "error";
  const isPaymentProgress = vendingMachineState === "paying";
  const isDone = vendingMachineState === "done";
  const isPaymentWaitTimeout = vendingMachineState === "timeout";

  const message = useMemo(() => {
    if (isError && errorMessage) return errorMessage;
    if (isPaymentProgress) return "결제 중...";
    if (isDone) return "결제 완료!";
    if (isPaymentWaitTimeout)
      return "결제 제한시간이 만료됐습니다.\n다시 진행해주세요.";

    if (inputNumber != null) {
      const productInfo = selectedProductInfo
        ? `${selectedProductInfo?.name}\n${selectedProductInfo?.price}원`
        : "상품 없음";

      return `입력 번호: ${inputNumber}\n${productInfo}`;
    }
    return "어서오세요!";
  }, [
    isDone,
    isError,
    inputNumber,
    errorMessage,
    isPaymentProgress,
    selectedProductInfo,
    isPaymentWaitTimeout,
  ]);

  return (
    <div
      className="flex flex-col justify-center items-center border-2 border-gray-300 rounded-md p-2 min-w-80"
      style={{
        backgroundColor: isError ? "rgba(252, 0, 0, 0.6)" : "transparent",
      }}
    >
      <span className="text-lg font-bold whitespace-pre-wrap text-center">
        {message}
      </span>
    </div>
  );
}
