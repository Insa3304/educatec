declare namespace MercadoPago {
  interface MercadoPagoStatic {
    new (publicKey: string, options?: any): MercadoPagoInstance;
  }

  interface MercadoPagoInstance {
    bricks(): BricksBuilder;
  }

  interface BricksBuilder {
    create(brickName: string, containerId: string, options: BrickOptions): Promise<void>;
  }

  interface BrickOptions {
    initialization: {
      preferenceId: string;
    };
    customization?: {
      paymentMethods: {
        ticket?: string;
        creditCard?: string;
        debitCard?: string;
        mercadoPago?: string;
      };
      texts?: {
        valueProp?: string;
      };

    };
  }
}

declare const MercadoPago: MercadoPago.MercadoPagoStatic;
