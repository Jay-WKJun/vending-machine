// 상품을 다루는 Product Controller, 상품 정보와 이용 가능 여부 판단, 상품 출력 담당 (상품을 담당하는 외부 기계와 통신하는 역할)
// 결제를 다루는 Payment Controller, 결제 가능 여부 판단, 결제 input 담당, 결제 완료 후 결제 수단 초기화 담당 (결제를 담당하는 외부 기계와 통신하는 역할)
// 자판기 컨트롤링은 여기에서 총체적으로 다룸 = xstate에 이어 자판기 상태 관리

import { VendingMachineStateProvider } from "./vendingMachineStateController";
import { VendingMachine } from "./VendingMachine";

function App() {
  return (
    <VendingMachineStateProvider>
      <VendingMachine />
    </VendingMachineStateProvider>
  );
}

export default App;
