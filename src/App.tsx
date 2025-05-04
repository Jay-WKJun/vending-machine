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
