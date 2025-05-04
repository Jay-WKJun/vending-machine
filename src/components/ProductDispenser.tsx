import { useEffect, useMemo, useState } from "react";
import { useVendingMachineStateControllerContext } from "@/vendingMachineStateController";
import { productShelfController } from "@/services/ProductShelfController";
import type { Product } from "@/types/product";

export function ProductDispenser() {
  const [dispensedProduct, setDispensedProduct] = useState<Product | null>(
    null
  );

  const { snapshot, send } = useVendingMachineStateControllerContext();
  const isDispensing = snapshot.value === "dispensing";
  const isDone = snapshot.value === "done";
  const { selectedProductInfo } = snapshot.context;

  const isDispenserActive = isDispensing || isDone;

  useEffect(() => {
    if (isDispenserActive) return;

    setDispensedProduct(null);
  }, [isDispenserActive]);

  useEffect(() => {
    if (!isDispensing || !selectedProductInfo) return;

    async function dispenseProduct() {
      try {
        const product = await productShelfController.dispenseProduct(
          selectedProductInfo!.id
        );
        setDispensedProduct(product);
        send({ type: "DISPENSE_COMPLETE" });
      } catch {
        send({ type: "DISPENSE_FAIL", reason: "상품 추출 실패" });
      }
    }

    dispenseProduct();
  }, [isDispensing, selectedProductInfo, send]);

  const dispenserText = useMemo(() => {
    if (isDispensing) return "상품 추출중...";
    if (isDone) return dispensedProduct?.name;

    return "상품 나오는 곳";
  }, [isDispensing, isDone, dispensedProduct]);

  return (
    <div
      className="flex flex-col justify-center items-center border-2 border-gray-300 rounded-md p-2 min-w-80 min-h-15 text-lg font-bold"
      style={{
        backgroundColor: isDispenserActive
          ? "rgba(59, 186, 34, 0.6)"
          : "transparent",
      }}
    >
      {dispenserText}
    </div>
  );
}
