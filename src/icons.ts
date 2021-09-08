import { library, icon } from "@fortawesome/fontawesome-svg-core";
import {
  faChevronRight,
  faChevronLeft,
  faChevronUp,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";

library.add(faChevronRight, faChevronDown, faChevronUp, faChevronLeft);

export const right = icon({ prefix: "fas", iconName: "chevron-right" });
export const left = icon({ prefix: "fas", iconName: "chevron-left" });
export const up = icon({ prefix: "fas", iconName: "chevron-up" });
export const down = icon({ prefix: "fas", iconName: "chevron-down" });
