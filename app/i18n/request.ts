import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import fr from "../messages/fr.json";
import be_fr from "../messages/be_fr.json";
import be_nl from "../messages/be_nl.json";
import ch_fr from "../messages/ch_fr.json";
import en from "../messages/en.json";
import es from "../messages/es.json";
import de from "../messages/de.json";

const messages = {
  fr,
  be_fr,
  be_nl,
  ch_fr,
  en,
  es,
  de,
};

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;
  const resolvedLocale = locale && locale in messages ? locale : routing.defaultLocale;

  return {
    locale: resolvedLocale,
    messages: messages[resolvedLocale as keyof typeof messages],
  };
});
