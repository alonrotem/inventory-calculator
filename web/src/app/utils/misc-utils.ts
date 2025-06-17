export class MiscUtils {

    static GetEnumKeyByValue<T extends object>(enumObj: T, value: string): string {
        let key =  Object.keys(enumObj).find(key => enumObj[key as keyof T] === value) ?? Object.keys(enumObj)[0];
        return key;
    }

    static GetEnumValueByKey<T extends object>(enumObj: T, key: string): T[keyof T] {
        return enumObj[key as keyof T];
    }

    static GetEnumMemberByValue<T extends { [key: string]: string }>(
        enumObj: T,
        value: string
        ): T[keyof T] {
        const enumValues = Object.values(enumObj);
        if (!enumValues.includes(value)) {
            throw new Error(`Invalid enum value: ${value}`);
        }
        return value as T[keyof T];
    }
}