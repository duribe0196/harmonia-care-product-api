import { IPrice } from "../db/models/product";

export class Price implements IPrice {
  constructor(
    public amount: number,
    public currency: string = "COP",
  ) {}

  // Método para formatear el precio como una cadena
  format(locale: string = "es-CO"): string {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: this.currency,
    }).format(this.amount);
  }

  // Método para sumar dos precios del mismo tipo
  add(other: Price): Price {
    if (this.currency !== other.currency) {
      throw new Error("Cannot add prices with different currencies");
    }
    return new Price(this.amount + other.amount, this.currency);
  }

  // Método para convertir el precio a otra moneda (simplificado)
  convertTo(newCurrency: string, exchangeRate: number): Price {
    const newAmount = this.amount * exchangeRate;
    return new Price(newAmount, newCurrency);
  }
}
