import { setup, assign } from "xstate";
import type { Product } from "../types/product";

type VendingMachineContext = {
  inputNumber: number | null;
  selectedProductInfo: Product | null;
  errorMessage: string | null;
};

const INITIAL_CONTEXT: VendingMachineContext = {
  inputNumber: null,
  selectedProductInfo: null,
  errorMessage: null,
};

type VendingMachineEvent =
  | { type: "INPUT_NUMBER"; digit: number }
  | { type: "INIT_INPUT_NUMBER" }
  | { type: "CONFIRM_SELECTION" }
  | { type: "PAYMENT_WAIT_TIMEOUT" }
  | { type: "TO_PROCESS_PAYMENT" }
  | { type: "PAYMENT_SUCCESS" }
  | { type: "PAYMENT_FAIL"; reason: string }
  | { type: "DISPENSE_COMPLETE" }
  | { type: "DISPENSE_FAIL"; reason: string };

// XState 머신 생성
export const vendingMachineStateController = setup({
  types: {
    context: {} as VendingMachineContext,
    events: {} as VendingMachineEvent,
    actions: { setProductInfo: () => {} },
  },
}).createMachine({
  id: "vendingMachine",
  initial: "idle",
  context: INITIAL_CONTEXT,
  states: {
    // idle (통상) -> 상품 선택이 가능한 상태 (상품 이용 가능 판단은 ProductController에서 함)
    idle: {
      entry: assign(INITIAL_CONTEXT),
      on: {
        INPUT_NUMBER: {
          actions: [
            assign(({ event }) => {
              const newInputNumber = event.digit;
              return { inputNumber: newInputNumber };
            }),
            { type: "setProductInfo" },
          ],
        },
        INIT_INPUT_NUMBER: {
          actions: assign(({ context }) => {
            return {
              ...context,
              inputNumber: null,
            };
          }),
        },
      },
    },
    // payment_ready (결제 대기) -> 상품 선택도 가능하지만 결제도 가능한 상태 (결제 가능 판단은 PaymentController에서 함)
    payment_ready: {},
    // paying (결제중...) -> 결제 중에 다른 입력을 막기 위한 용도
    paying: {},
    // dispensing (상품 출력 중...) -> 동일하게 다른 입력을 막기 위한 용도
    dispensing: {},
  },
});
