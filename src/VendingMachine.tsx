import { ProductNumberInput } from "./components/ProductNumberInput";
import { Display } from "./components/Display";

export function VendingMachine() {
  return (
    <div className="flex flex-col justify-center items-center gap-8">
      <h1 className="text-2xl font-bold">자판기</h1>

      <div className="flex gap-8">
        <Display />

        <ProductNumberInput />
      </div>

      <div className="flex gap-8">
        <div className="border-2 border-gray-300 rounded-md p-2 min-w-30">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-bold text-lg">잔액</span>
            <span className="text-lg font-bold">0원</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button>+ 100원</button>
            <button>+ 500원</button>
            <button>+ 1000원</button>
            <button>+ 5000원</button>
            <button>+ 10000원</button>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center border-2 border-gray-300 rounded-md p-2 min-w-40 gap-2">
          <div className="text-lg font-bold">대기중...</div>
          <button
            className="bg-blue-500 text-white px-2 py-1 rounded-md font-bold"
            style={{ padding: "10px" }}
          >
            카드 입력
          </button>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center border-2 border-gray-300 rounded-md p-2 min-w-80 min-h-15 text-lg font-bold">
        상품 나오는 곳
      </div>
    </div>
  );
}
