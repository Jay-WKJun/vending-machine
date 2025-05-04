import { setup, assign } from "xstate";
import type { Product } from "../types/product";

type VendingMachineContext = {
  inputNumber: number | null;
  selectedProductInfo: Product | null;
  errorMessage: string | null;
  errorTimeout: number;
  isPaymentReady: boolean;
};

const DEFAULT_ERROR_TIMEOUT = 5000;

const INITIAL_CONTEXT: VendingMachineContext = {
  inputNumber: null,
  selectedProductInfo: null,
  errorMessage: null,
  errorTimeout: DEFAULT_ERROR_TIMEOUT,
  isPaymentReady: false,
};

type VendingMachineEvent =
  | { type: "INPUT_NUMBER"; digit: number }
  | { type: "INIT_INPUT_NUMBER" }
  | { type: "PAYMENT_WAIT_TIMEOUT" }
  | { type: "SET_PAYMENT_READY_STATE"; isPaymentReady: boolean }
  | { type: "PAYMENT_START" }
  | { type: "PAYMENT_SUCCESS" }
  | { type: "PAYMENT_FAIL"; reason: string }
  | { type: "DISPENSE_COMPLETE" }
  | { type: "DISPENSE_FAIL"; reason: string };

export const vendingMachineStateController = setup({
  types: {
    context: {} as VendingMachineContext,
    events: {} as VendingMachineEvent,
  },
  actions: {
    initContext: assign(INITIAL_CONTEXT),
    setProductInfo: () => {},
    setError: assign(
      (_, params?: { errorMessage?: string; errorTimeout?: number }) => ({
        errorMessage: params?.errorMessage ?? "",
        errorTimeout: params?.errorTimeout ?? DEFAULT_ERROR_TIMEOUT,
      })
    ),
  },
  delays: {
    errorTimeout: ({ context }) => context.errorTimeout,
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
          actions: assign(() => ({
            inputNumber: null,
            selectedProductInfo: null,
          })),
        },
        SET_PAYMENT_READY_STATE: {
          actions: assign(({ event }) => ({
            isPaymentReady: event.isPaymentReady,
          })),
        },
        PAYMENT_START: {
          target: "paying",
          guard: ({ context }) =>
            Boolean(context.isPaymentReady && context.selectedProductInfo),
        },
      },
    },
    // paying (결제중...) -> 결제 중에 다른 입력을 막기 위한 용도
    paying: {
      on: {
        PAYMENT_SUCCESS: {
          target: "dispensing",
        },
        PAYMENT_FAIL: {
          target: "error",
          actions: assign(({ event }) => ({
            errorMessage: event.reason,
          })),
        },
      },
    },
    // dispensing (상품 출력 중...) -> 동일하게 다른 입력을 막기 위한 용도
    dispensing: {
      on: {
        DISPENSE_COMPLETE: {
          target: "done",
        },
        DISPENSE_FAIL: {
          target: "error",
          actions: assign(({ event }) => ({
            errorMessage: event.reason,
          })),
        },
      },
    },
    error: {
      after: {
        errorTimeout: {
          actions: [{ type: "initContext" }],
          target: "idle",
        },
      },
    },
    done: {
      after: {
        doneTimeout: {
          actions: [{ type: "initContext" }],
          target: "idle",
        },
      },
    },
  },
});
