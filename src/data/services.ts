import { Service } from "@/types";
import { convertArrayByKeyToOBJ } from "@/utils";

import servicesJson from "./services.json";

export const serviceByName = convertArrayByKeyToOBJ(servicesJson, "name");

export default servicesJson as Service[];
