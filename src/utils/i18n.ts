// basic i18n setup - might add more languages later

export type Locale = "en-US" | "es-ES";

export interface Translation {
  [key: string]: string | Translation;
}

export interface I18nConfig {
  locale: Locale;
  fallbackLocale: Locale;
  translations: Record<Locale, Translation>;
}

class I18n {
  private config: I18nConfig;
  private currentLocale: Locale;

  constructor(config: I18nConfig) {
    this.config = config;
    this.currentLocale = config.locale;
  }

  setLocale(locale: Locale): void {
    if (this.config.translations[locale]) {
      this.currentLocale = locale;
    } else {
      console.warn(
        `Locale ${locale} not found, falling back to ${this.config.fallbackLocale}`
      );
      this.currentLocale = this.config.fallbackLocale;
    }
  }

  getLocale(): Locale {
    return this.currentLocale;
  }

  t(key: string, params?: Record<string, string | number>): string {
    const translation = this.getTranslation(key);

    if (!translation) {
      console.warn(
        `Translation key "${key}" not found for locale "${this.currentLocale}"`
      );
      return key;
    }

    if (params) {
      return this.interpolate(translation, params);
    }

    return translation;
  }

  private getTranslation(key: string): string | null {
    const keys = key.split(".");
    let translation: any = this.config.translations[this.currentLocale];

    // try current locale first
    for (const k of keys) {
      if (translation && typeof translation === "object" && k in translation) {
        translation = translation[k];
      } else {
        translation = null;
        break;
      }
    }

    // fallback to fallback locale
    if (!translation && this.currentLocale !== this.config.fallbackLocale) {
      translation = this.config.translations[this.config.fallbackLocale];
      for (const k of keys) {
        if (
          translation &&
          typeof translation === "object" &&
          k in translation
        ) {
          translation = translation[k];
        } else {
          translation = null;
          break;
        }
      }
    }

    return typeof translation === "string" ? translation : null;
  }

  private interpolate(
    text: string,
    params: Record<string, string | number>
  ): string {
    return text.replace(/\{(\w+)\}/g, (match, key) => {
      return params[key]?.toString() || match;
    });
  }

  formatNumber(num: number, options?: Intl.NumberFormatOptions): string {
    return new Intl.NumberFormat(this.currentLocale, options).format(num);
  }

  formatCurrency(amount: number, currency: string = "USD"): string {
    return new Intl.NumberFormat(this.currentLocale, {
      style: "currency",
      currency,
    }).format(amount);
  }
}

// basic translations - just english and spanish for now
const defaultTranslations: Record<Locale, Translation> = {
  "en-US": {
    common: {
      loading: "Loading...",
      error: "An error occurred",
      retry: "Try Again",
      cancel: "Cancel",
      save: "Save",
      calculate: "Calculate",
      download: "Download",
    },
    form: {
      zipCode: "ZIP Code",
      squareFootage: "Square Footage",
      thermostatTemp: "Thermostat Temperature",
      seer2Rating: "SEER2 Rating",
      insulationQuality: "Insulation Quality",
      operatingHours: "Operating Hours",
      selectUnit: "Select AC Unit",
    },
    validation: {
      required: "This field is required",
      invalidZipCode: "Please enter a valid US ZIP code",
      invalidSquareFootage: "Square footage must be greater than 0",
      invalidTemperature: "Temperature must be between 60°F and 90°F",
      invalidSeer2: "SEER2 rating must be between 13 and 25",
      invalidHours: "Operating hours must be between 1 and 24",
    },
    results: {
      dailyCost: "Daily Cost",
      monthlyCost: "Monthly Cost",
      annualCost: "Annual Cost",
      energyUsage: "Energy Usage",
      btuRequirement: "BTU Requirement",
      efficiencyRating: "Efficiency Rating",
    },
  },
  "es-ES": {
    common: {
      loading: "Cargando...",
      error: "Ocurrió un error",
      retry: "Intentar de nuevo",
      cancel: "Cancelar",
      save: "Guardar",
      calculate: "Calcular",
      download: "Descargar",
    },
    form: {
      zipCode: "Código Postal",
      squareFootage: "Metros Cuadrados",
      thermostatTemp: "Temperatura del Termostato",
      seer2Rating: "Clasificación SEER2",
      insulationQuality: "Calidad del Aislamiento",
      operatingHours: "Horas de Operación",
      selectUnit: "Seleccionar Unidad de AC",
    },
    validation: {
      required: "Este campo es obligatorio",
      invalidZipCode: "Por favor ingrese un código postal válido de EE.UU.",
      invalidSquareFootage: "Los metros cuadrados deben ser mayores que 0",
      invalidTemperature: "La temperatura debe estar entre 60°F y 90°F",
      invalidSeer2: "La clasificación SEER2 debe estar entre 13 y 25",
      invalidHours: "Las horas de operación deben estar entre 1 y 24",
    },
    results: {
      dailyCost: "Costo Diario",
      monthlyCost: "Costo Mensual",
      annualCost: "Costo Anual",
      energyUsage: "Uso de Energía",
      btuRequirement: "Requerimiento BTU",
      efficiencyRating: "Clasificación de Eficiencia",
    },
  },
};

// create i18n instance
export const i18n = new I18n({
  locale: "en-US",
  fallbackLocale: "en-US",
  translations: defaultTranslations,
});

// hook for react components
export const useTranslation = () => {
  return {
    t: (key: string, params?: Record<string, string | number>) =>
      i18n.t(key, params),
    locale: i18n.getLocale(),
    setLocale: (locale: Locale) => i18n.setLocale(locale),
    formatNumber: (num: number, options?: Intl.NumberFormatOptions) =>
      i18n.formatNumber(num, options),
    formatCurrency: (amount: number, currency?: string) =>
      i18n.formatCurrency(amount, currency),
  };
};
