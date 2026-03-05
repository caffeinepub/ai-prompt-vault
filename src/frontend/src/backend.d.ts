import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface PurchaseOrder {
    id: string;
    customerName: string;
    status: string;
    packageType: string;
    timestamp: bigint;
    customerEmail: string;
    selectedCategories: Array<string>;
}
export interface Prompt {
    id: string;
    categoryId: string;
    title: string;
    promptText: string;
    section: string;
}
export interface Category {
    id: string;
    icon: string;
    name: string;
    useCase: string;
    description: string;
    monetizationTips: string;
    beginnerInstructions: string;
}
export interface backendInterface {
    getAllOrders(): Promise<Array<PurchaseOrder>>;
    getCategories(): Promise<Array<Category>>;
    getCategoryById(id: string): Promise<Category>;
    getOrderById(id: string): Promise<PurchaseOrder>;
    getPromptById(id: string): Promise<Prompt>;
    getPromptsByCategory(categoryId: string): Promise<Array<Prompt>>;
    searchPrompts(searchQuery: string): Promise<Array<Prompt>>;
    submitOrder(customerName: string, customerEmail: string, packageType: string, selectedCategories: Array<string>): Promise<string>;
    submitOrderWithPayment(customerName: string, customerEmail: string, packageType: string, selectedCategories: Array<string>, razorpayPaymentId: string, razorpayOrderId: string): Promise<string>;
}
