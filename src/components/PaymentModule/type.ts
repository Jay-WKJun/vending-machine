export type PaymentRef = {
  startPayment: (productPrice: number) => Promise<boolean>;
  init: () => void;
  lock: () => void;
};
