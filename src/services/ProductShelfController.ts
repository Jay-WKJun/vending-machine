import type { Product } from "@/types/product";
import { wait } from "@/utils/mockUtils";

class ProductShelfController {
  private products: Product[] = [
    { id: 1, name: "콜라", price: 1100 },
    { id: 2, name: "물", price: 600 },
    { id: 3, name: "커피", price: 700 },
  ];

  // 상품 정보 조회
  getProductInfo(productId: number): Product | null {
    const product = this.products.find((p) => p.id === productId);
    return product ?? null;
  }

  // 상품 구매 가능 여부 확인
  isAvailable(productId: number) {
    return Boolean(this.getProductInfo(productId));
  }

  // 상품 추출
  async dispenseProduct(productId: number): Promise<Product | null> {
    await wait(2000);
    return this.getProductInfo(productId);
  }
}

export const productShelfController = new ProductShelfController();
