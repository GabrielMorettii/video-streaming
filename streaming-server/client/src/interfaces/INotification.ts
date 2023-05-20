export interface INotification {
  id: string;
  type: "error" | "success" | "info";
  description: string;
}
