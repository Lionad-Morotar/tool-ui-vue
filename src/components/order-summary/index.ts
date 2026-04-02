import OrderSummaryRoot from "./index.vue";
import type { OrderSummaryProps, OrderDecision } from "./schema";

export type { OrderSummaryProps, SerializableOrderSummary, OrderItem, Pricing, OrderDecision, OrderSummaryVariant } from "./schema";
export { SerializableOrderSummarySchema, OrderItemSchema, PricingSchema, OrderDecisionSchema, OrderSummaryVariantSchema, parseSerializableOrderSummary, safeParseSerializableOrderSummary } from "./schema";

// Compound component interfaces matching React
export interface OrderSummaryDisplayProps extends OrderSummaryProps {
  variant?: "summary";
}

export interface OrderSummaryReceiptProps extends Omit<OrderSummaryProps, "choice"> {
  variant?: "receipt";
  choice: OrderDecision;
}

// Display variant wrapper
function OrderSummaryDisplay(props: OrderSummaryDisplayProps) {
  return OrderSummaryRoot({ ...props, variant: "summary" } as OrderSummaryProps);
}

// Receipt variant wrapper
function OrderSummaryReceipt(props: OrderSummaryReceiptProps) {
  return OrderSummaryRoot({ ...props, variant: "receipt" } as OrderSummaryProps);
}

// Attach sub-components
const OrderSummary = Object.assign(OrderSummaryRoot, {
  Display: OrderSummaryDisplay,
  Receipt: OrderSummaryReceipt,
});

export { OrderSummary };
export default OrderSummary;
