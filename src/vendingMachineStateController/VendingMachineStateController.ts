import { setup, assign } from "xstate";
import type { Product } from "@/types/product";
import { second } from "@/utils/time";

type VendingMachineContext = {
  inputNumber: number | null;
  selectedProductInfo: Product | null;
  errorMessage: string | null;
  errorTimeout: number;
  isPaymentReady: boolean;
  paymentInitializers: (() => void)[];
};

const DEFAULT_ERROR_TIMEOUT = second(3);
const DEFAULT_DONE_TIMEOUT = second(2);
const DEFAULT_PAYMENT_WAIT_TIMEOUT = second(3);

const INITIAL_CONTEXT: VendingMachineContext = {
  inputNumber: null,
  selectedProductInfo: null,
  errorMessage: null,
  errorTimeout: DEFAULT_ERROR_TIMEOUT,
  isPaymentReady: false,
  paymentInitializers: [],
};

type VendingMachineEvent =
  | { type: "INPUT_NUMBER"; digit: number }
  | { type: "INIT_INPUT_NUMBER" }
  | { type: "PAYMENT_WAIT_TIMEOUT" }
  | {
      type: "SET_PAYMENTS_INFO";
      isPaymentReady: boolean;
      paymentInitializers: (() => void)[];
    }
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
    executePaymentInitializers: ({ context }) => {
      context.paymentInitializers.forEach((initializer) => initializer());
    },
    setError: assign(
      (_, params?: { errorMessage?: string; errorTimeout?: number }) => ({
        errorMessage: params?.errorMessage ?? "",
        errorTimeout: params?.errorTimeout ?? DEFAULT_ERROR_TIMEOUT,
      })
    ),
    // 외부 주입
    setProductInfo: () => {},
  },
  delays: {
    errorTimeout: ({ context }) => context.errorTimeout,
    doneTimeout: () => DEFAULT_DONE_TIMEOUT,
    paymentWaitTimeout: () => DEFAULT_PAYMENT_WAIT_TIMEOUT,
  },
}).createMachine({
  id: "vendingMachine",
  initial: "idle",
  context: INITIAL_CONTEXT,
  states: {
    // idle (통상) -> 상품 선택이 가능한 상태 (상품 이용 가능 판단은 ProductController에서 함)
    idle: {
      entry: [{ type: "initContext" }],
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
        PAYMENT_WAIT_TIMEOUT: {
          target: "timeout",
        },
        SET_PAYMENTS_INFO: {
          actions: assign(({ event }) => ({
            isPaymentReady: event.isPaymentReady,
            paymentInitializers: event.paymentInitializers,
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
          actions: {
            type: "setError",
            params: ({ event }) => ({ errorMessage: event.reason }),
          },
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
          actions: {
            type: "setError",
            params: ({ event }) => ({ errorMessage: event.reason }),
          },
        },
      },
    },
    error: {
      after: {
        errorTimeout: {
          actions: [
            { type: "executePaymentInitializers" },
            { type: "initContext" },
          ],
          target: "idle",
        },
      },
    },
    done: {
      after: {
        doneTimeout: {
          actions: [
            { type: "executePaymentInitializers" },
            { type: "initContext" },
          ],
          target: "idle",
        },
      },
    },
    timeout: {
      after: {
        paymentWaitTimeout: {
          actions: [
            { type: "executePaymentInitializers" },
            { type: "initContext" },
          ],
          target: "idle",
        },
      },
    },
  },
});
