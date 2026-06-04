import type { CarModel } from "./types";
import seal06Dmi from "../../content/models/seal-06-dmi.json";
import sealion06Dmi from "../../content/models/sealion-06-dmi.json";
import yuanUpDmi from "../../content/models/yuan-up-dmi.json";
import yuanUpEv from "../../content/models/yuan-up-ev.json";

export const seedModels: CarModel[] = [
  seal06Dmi,
  sealion06Dmi,
  yuanUpDmi,
  yuanUpEv,
] as CarModel[];
