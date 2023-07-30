import { Service } from "@/types";
import { convertArrayByKeyToOBJ } from "@/utils";

import servicesJson from "./services.json";

export const services = servicesJson as Service[];

export const servicesByName = convertArrayByKeyToOBJ(services, "name");
