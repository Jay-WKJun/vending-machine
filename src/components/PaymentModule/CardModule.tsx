import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { getRandomSuccessResult } from "../../utils/mockUtils";

export type CardState =
  | "idle"
  | "validateCard"
  | "ready"
  | "inPaymentProcess"
  | "paymentSuccess"
  | "paymentFailed"
  | "error";

interface CardModuleProps {
  className?: string;
  onCardReady?: (isCardReady: boolean) => void;
}

export interface CardModuleRef {
  startPayment: () => Promise<boolean>;
  init: () => void;
}

export const CardModule = forwardRef<CardModuleRef, CardModuleProps>(
  ({ className, onCardReady }, ref) => {
    const [cardState, setCardState] = useState<CardState>("idle");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
      if (cardState === "ready") {
        onCardReady?.(true);
      }
    }, [onCardReady, cardState]);

    const handleCardInput = useCallback(async () => {
      if (
        cardState !== "idle" &&
        cardState !== "error" &&
        cardState !== "paymentFailed"
      )
        return;

      setCardState("validateCard");
      setErrorMessage("");

      const isSuccess = await getRandomSuccessResult(90);
      if (isSuccess) {
        setCardState("ready");
      } else {
        setCardState("error");
        setErrorMessage("카드 입력 실패, 다시 입력해주세요.");
      }
      return isSuccess;
    }, [cardState]);

    useImperativeHandle(ref, () => ({
      startPayment: async () => {
        if (cardState !== "ready") {
          setCardState("error");
          setErrorMessage("카드가 아직 준비되지 않았습니다.");
          return false;
        }

        setCardState("inPaymentProcess");
        const isSuccess = await getRandomSuccessResult(90, 3000);
        if (isSuccess) {
          setCardState("paymentSuccess");
          setTimeout(() => {
            setCardState("idle");
            setErrorMessage("");
          }, 2000);
        } else {
          setCardState("paymentFailed");
          setErrorMessage("결제에 실패했습니다. 다시 시도해주세요.");
          setTimeout(() => {
            setCardState("ready");
            setErrorMessage("");
          }, 2000);
        }
        return isSuccess;
      },
      init: () => {
        setCardState("idle");
        setErrorMessage("");
      },
    }));

    const cardModuleText = useMemo(() => {
      if (errorMessage) return errorMessage;
      if (cardState === "idle") return "카드를 입력해주세요.";
      if (cardState === "validateCard") return "카드 확인중...";
      if (cardState === "ready") return "카드 입력 완료";
      if (cardState === "inPaymentProcess") return "결제 중...";
      if (cardState === "paymentFailed") return "결제 실패, 다시 시도해주세요";
      if (cardState === "paymentSuccess") return "결제 성공";
    }, [cardState, errorMessage]);

    return (
      <div className={className}>
        <div className="flex flex-col justify-center items-center border-2 border-gray-300 rounded-md p-2 min-w-70 gap-2">
          <div
            className="text-lg font-bold"
            style={{ color: cardState === "error" ? "red" : "inherit" }}
          >
            {cardModuleText}
          </div>
          <button
            className="bg-blue-500 text-white px-2 py-1 rounded-md font-bold"
            style={{ padding: "10px" }}
            onClick={handleCardInput}
          >
            카드 입력
          </button>
        </div>
      </div>
    );
  }
);
