import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
declare const Slider: React.ForwardRefExoticComponent<Omit<SliderPrimitive.SliderProps & React.RefAttributes<HTMLSpanElement>, "ref"> & {
    children?: React.ReactNode;
} & React.RefAttributes<HTMLSpanElement>>;
export { Slider };
