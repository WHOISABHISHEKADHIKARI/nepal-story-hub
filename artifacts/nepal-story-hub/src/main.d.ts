import "./index.css";
declare const router: any;
declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}
export {};
