import { countries } from "../constants/countries";

export const generateRandomString = (
   stringLength: number,
   options?: {
      /** @default true */
      includeCapitalLetters?: boolean;
      /** @default true */
      includeLowerLetters?: boolean;
      /** @default true */
      includeNumbers?: boolean;
      /** @default 1 */
      dashSections?: number;
   },
): string => {
   const capitals = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
   const lowers = "abcdefghijklmnopqrstuvwxyz";
   const numbers = "0123456789";

   const includes: string[] = [];

   if (options?.includeCapitalLetters !== false) includes.push(capitals);
   if (options?.includeLowerLetters !== false) includes.push(lowers);
   if (options?.includeNumbers !== false) includes.push(numbers);

   const characters = includes.join("");

   const dashSections = Math.max(1, options?.dashSections ?? 1);
   const dashSectionLength = Math.floor(stringLength / dashSections);

   if (stringLength < dashSections) return "";

   let result = "";
   let currentSectionLength = 0;

   while (result.length < stringLength) {
      if (currentSectionLength >= dashSectionLength) {
         result += "-";
         currentSectionLength = 0;
      }

      if (result.length < stringLength) {
         result += characters.charAt(Math.floor(Math.random() * characters.length));
         currentSectionLength += 1;
      }
   }

   return result;
};

export const formatPhoneNumber = (phoneNumber: string): string => {
   const cleanPhoneNumber = phoneNumber.replace(/\D/g, "");

   const country = countries.find(
      (country) => country.phoneNumberExtension === cleanPhoneNumber.slice(0, country.phoneNumberExtension.length),
   );

   if (!country) return phoneNumber;

   let phonNumberRest = cleanPhoneNumber.slice(country.phoneNumberExtension.length);

   if (country.phoneNumberFormat) {
      let formattedNumber = "";
      let index = 0;

      for (const char of country.phoneNumberFormat) {
         if (char === "X" && index < phonNumberRest.length) {
            formattedNumber += phonNumberRest[index];
            index++;
         } else {
            formattedNumber += char;
         }
      }

      phonNumberRest = formattedNumber.replace(/X/g, "").trim();
   }

   return `+${country.phoneNumberExtension} ${phonNumberRest}`;
};

export const eventPreventDefault = (event: React.MouseEvent) => {
   event.preventDefault();
};

export const eventStopPropagation = (event: React.MouseEvent) => {
   event.stopPropagation();
};

export const eventPreventStop = (event: React.MouseEvent) => {
   event.preventDefault();
   event.stopPropagation();
};

export const getPluralWord = (word: string, count: number): string => {
   if (count === 1) return word;

   const needChangeY = word.slice(-1) === "y" && !["a", "e", "o", "u", "i"].includes(word.slice(-2, -1));

   const pluralWord = needChangeY ? word.slice(0, -1) + "ies" : word.slice(-1) === "s" ? word + "es" : word + "s";

   return pluralWord;
};
