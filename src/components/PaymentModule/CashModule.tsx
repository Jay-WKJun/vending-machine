import {
  useCallback,
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { getRandomSuccessResult } from "../../utils/mockUtils";
import type { PaymentRef } from "./type";

export const paymentId = "cash";

interface CashModuleProps {
  className?: string;
  onCashInput?: (totalCashAmount: number) => void;
}

export type CashModuleRef = PaymentRef;

const EMPTY_CASH = 0;

export const CashModule = forwardRef<CashModuleRef, CashModuleProps>(
  ({ className, onCashInput }, ref) => {
    const [isInputActive, setIsInputActive] = useState(true);
    const [totalCashAmount, setTotalCashAmount] = useState(EMPTY_CASH);

    useImperativeHandle(ref, () => ({
      startPayment: async (productPrice: number) => {
        if (totalCashAmount < productPrice) return false;

        setIsInputActive(false);

        const isSuccess = await getRandomSuccessResult(99);
        if (isSuccess) {
          setTotalCashAmount((prev) => prev - productPrice);
        }
        return isSuccess;
      },
      lock: () => {
        setIsInputActive(false);
      },
      init: () => {
        // 잔돈 반환을 가정
        setTotalCashAmount(EMPTY_CASH);
        setIsInputActive(true);
      },
    }));

    useEffect(() => {
      onCashInput?.(totalCashAmount);
    }, [totalCashAmount, onCashInput]);

    const handleCashInput = useCallback(
      (amount: number) => {
        if (!isInputActive) return;
        setTotalCashAmount((prev) => prev + amount);
      },
      [isInputActive]
    );

    const renderCashInputButton = useCallback(
      (amount: number) => (
        <button
          key={`input-cash-${amount}`}
          onClick={() => handleCashInput(amount)}
        >
          + {amount}원
        </button>
      ),
      [handleCashInput]
    );

    return (
      <div className={className}>
        <div className="border-2 border-gray-300 rounded-md p-2 min-w-30">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-bold text-lg">현금</span>
            <span className="text-lg font-bold">{totalCashAmount}원</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[100, 500, 1000, 5000, 10000].map((amount) =>
              renderCashInputButton(amount)
            )}
          </div>
        </div>
      </div>
    );
  }
);
