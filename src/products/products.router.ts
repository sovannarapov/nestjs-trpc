import {
  Ctx,
  Input,
  Mutation,
  Query,
  Router,
  UseMiddlewares,
} from 'nestjs-trpc';
import { ProductsService } from './products.service';
import { Product, productSchema } from './product.schema';
import { z } from 'zod';
import { LoggerMiddleware } from '../trpc/middlware/logger.middleware';
import { IAppContext } from 'src/trpc/context/context.interface';

@Router({ alias: 'products' })
@UseMiddlewares(LoggerMiddleware)
export class ProductsRouter {
  constructor(private readonly _productsService: ProductsService) {}

  @Query({
    input: z.object({ id: z.string() }),
    output: productSchema,
  })
  getProductById(@Input('id') id: string) {
    return this._productsService.getProductById(id);
  }

  @Query({
    output: z.array(productSchema),
  })
  getAllProducts() {
    return this._productsService.getAllProducts();
  }

  @Mutation({
    input: z.object({
      id: z.string(),
      data: productSchema.partial(),
    }),
    output: productSchema,
  })
  updateProduct(
    @Input('id') id: string,
    @Input('data') data: Partial<Product>,
  ) {
    return this._productsService.updateProduct(id, data);
  }

  @Mutation({
    input: productSchema,
    output: productSchema,
  })
  createProduct(@Input() productData: Product, @Ctx() context: IAppContext) {
    console.log('App Context:', context);
    return this._productsService.createProduct(productData);
  }

  @Mutation({
    input: z.object({ id: z.string() }),
    output: z.boolean(),
  })
  deleteProduct(@Input('id') id: string) {
    return this._productsService.deleteProduct(id);
  }
}
