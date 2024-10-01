import { v4 as uuidv4 } from "uuid";
export const replaceWithValidGuids = async (obj: any) => {
  const guidMap = new Map<string, string>();

  const replace = (value: any): any => {
    if (typeof value !== "object" || value === null) {
      return value;
    }

    if (Array.isArray(value)) {
      return value.map(replace);
    }

    const newObj: any = {};
    for (const [key, val] of Object.entries(value)) {
      if ((key === "id" || key.endsWith("Id")) && typeof val === "string") {
        if (!guidMap.has(val)) {
          guidMap.set(val, uuidv4());
        }
        newObj[key] = guidMap.get(val);
      } else {
        newObj[key] = replace(val);
      }
    }
    return newObj;
  };

  return replace(obj);
};
