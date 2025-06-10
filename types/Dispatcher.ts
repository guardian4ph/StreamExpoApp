export type DispatcherType = "Guardian" | "LGU";

export interface Dispatcher {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dispatcherType: DispatcherType;
}
