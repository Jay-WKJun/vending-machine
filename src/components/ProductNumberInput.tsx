import { useCallback } from "react";
import { useVendingMachineStateControllerContext } from "../vendingMachineStateController";

export function ProductNumberInput() {
  const { send } = useVendingMachineStateControllerContext();

  const renderNumberButton = useCallback(
    (digit: number) => {
      return (
        <button onClick={() => send({ type: "INPUT_NUMBER", digit })}>
          {digit}
        </button>
      );
    },
    [send]
  );

  return (
    <div className="grid grid-cols-3 gap-2 border-2 border-gray-300 rounded-md p-2 min-w-50">
      {renderNumberButton(1)}
      {renderNumberButton(2)}
      {renderNumberButton(3)}
      {renderNumberButton(4)}
      {renderNumberButton(5)}
      {renderNumberButton(6)}
      {renderNumberButton(7)}
      {renderNumberButton(8)}
      {renderNumberButton(9)}
      <button onClick={() => send({ type: "INIT_INPUT_NUMBER" })}>
        초기화
      </button>
      {renderNumberButton(0)}
      <button onClick={() => send({ type: "PAYMENT_START" })}>선택</button>
    </div>
  );
}
